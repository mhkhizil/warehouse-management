import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import {
  Refund,
  RefundType,
  RefundStatus,
  TransactionType,
} from '@prisma/client';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import { IRefundRepository } from '../../../domain/interfaces/repositories/refund.repository.interface';
import { REFUND_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { FinancialPrecisionService } from '../../../core/common/service/financial-precision.service';
import { WarrantyValidationService } from '../../../core/common/service/warranty-validation.service';
import Decimal from 'decimal.js';

@Injectable()
export class ProcessRefundUseCase {
  private readonly logger = new Logger(ProcessRefundUseCase.name);

  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: IRefundRepository,
    private readonly prisma: PrismaService,
    private readonly financialPrecision: FinancialPrecisionService,
    private readonly warrantyValidation: WarrantyValidationService,
  ) {}

  async execute(refundId: number, processedBy?: number): Promise<Refund> {
    this.logger.log(`Processing refund with ID: ${refundId}`);

    // Use Prisma transaction for atomic operations
    return await this.prisma.$transaction(async (tx) => {
      // Fetch refund with all relations
      const refund = await tx.refund.findUnique({
        where: { id: refundId },
        include: {
          originalTransaction: {
            include: {
              transactionItems: {
                include: {
                  item: true,
                  stock: true,
                },
              },
            },
          },
          refundItems: {
            include: {
              originalTransactionItem: {
                include: {
                  item: true,
                  stock: true,
                },
              },
            },
          },
          exchangeItems: {
            include: {
              item: true,
            },
          },
          customer: true,
        },
      });

      if (!refund) {
        throw new NotFoundException(`Refund with ID ${refundId} not found`);
      }

      // ADMIN AUTO-APPROVAL: Check if admin can process refund directly
      await this.validateRefundStatusForProcessing(refund, processedBy, tx);

      // CRITICAL FIX 5.1: Handle orphaned refunds (original transaction deleted)
      await this.validateOrphanedRefund(refund);

      // CRITICAL FIX 4.1: Validate transaction item ownership to prevent bypass attacks
      await this.validateTransactionItemOwnership(refund);

      // Process based on refund type
      if (refund.refundType === RefundType.MONEY_REFUND) {
        await this.processMoneyRefund(tx, refund);
      } else if (refund.refundType === RefundType.ITEM_EXCHANGE) {
        await this.processItemExchange(tx, refund);
      }

      // Create refund transaction for accounting purposes
      // For refunds, we always default to CASH payment method
      const refundPaymentMethod = 'CASH';

      const refundTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.REFUND,
          customerId: refund.customerId,
          totalAmount: -refund.totalRefundAmount, // Negative amount for refund
          date: new Date(),
          paymentMethod: 'CASH', // Refunds are typically given as cash
        },
      });

      // CRITICAL FIX 1.1: Handle debt adjustment without duplication
      if (refund.refundType === RefundType.MONEY_REFUND) {
        // For money refunds, reduce customer debt by full refund amount
        await this.adjustCustomerDebt(tx, refund);
      }
      // NOTE: For item exchanges, debt adjustment is handled INSIDE processItemExchange()
      // to avoid double adjustment. The processItemExchange() method handles both:
      // 1. Base debt reduction for refunded amount
      // 2. Additional debt adjustments for exchange amount differences

      // Update refund status and link refund transaction
      const updatedRefund = await tx.refund.update({
        where: { id: refundId },
        data: {
          status: RefundStatus.PROCESSED,
          processedAt: new Date(),
          processedBy,
          refundTransactionId: refundTransaction.id,
        },
        include: {
          originalTransaction: true,
          refundTransaction: true,
          customer: true,
          refundItems: {
            include: {
              originalTransactionItem: {
                include: {
                  item: true,
                },
              },
            },
          },
          exchangeItems: {
            include: {
              item: true,
            },
          },
        },
      });

      this.logger.log(`Refund ${refundId} processed successfully`);
      return updatedRefund;
    });
  }

  private async processMoneyRefund(tx: any, refund: any): Promise<void> {
    this.logger.log(`Processing money refund for refund ID: ${refund.id}`);

    // CRITICAL FIX: Check if this refund has already been processed to prevent double stock addition
    if (refund.status === RefundStatus.PROCESSED) {
      // CRITICAL FIX 1.3: Use enum value
      this.logger.warn(
        `Refund ${refund.id} is already processed, skipping stock updates`,
      );
      return;
    }

    // Return items to stock
    for (const refundItem of refund.refundItems) {
      const originalItem = refundItem.originalTransactionItem;

      // CRITICAL FIX 1.2: Comprehensive validation before stock updates
      if (!originalItem) {
        throw new BadRequestException(
          `Original transaction item not found for refund item ${refundItem.id}`,
        );
      }

      if (!originalItem.itemId) {
        throw new BadRequestException(
          `Invalid item reference in transaction item ${originalItem.id}`,
        );
      }

      // CRITICAL FIX 2.1: Enhanced stock-transaction relationship validation
      if (originalItem.stockId) {
        // Verify stock record exists and belongs to correct item
        const stockRecord = await tx.stock.findUnique({
          where: { id: originalItem.stockId },
        });

        if (!stockRecord) {
          // BUSINESS RULE: You don't delete records, so this indicates data corruption
          this.logger.error(
            `CRITICAL: Stock record ${originalItem.stockId} referenced by transaction item ${originalItem.id} not found. This indicates data corruption.`,
          );

          // Create replacement stock record to maintain data integrity
          this.logger.warn(
            `Creating replacement stock record for item ${originalItem.itemId} to maintain data integrity`,
          );

          await tx.stock.create({
            data: {
              itemId: originalItem.itemId,
              quantity: refundItem.quantityToRefund,
              refillAlert: false,
              lastRefilled: new Date(),
            },
          });
        } else {
          // Validate stock-item relationship
          if (stockRecord.itemId !== originalItem.itemId) {
            throw new BadRequestException(
              `CRITICAL: Stock record ${originalItem.stockId} belongs to different item (expected: ${originalItem.itemId}, actual: ${stockRecord.itemId}). Data integrity violation detected.`,
            );
          }

          // CRITICAL FIX 3.3: Enhanced atomic stock update with race condition protection
          const updatedStock = await this.atomicStockIncrement(
            tx,
            originalItem.stockId,
            originalItem.itemId,
            refundItem.quantityToRefund,
            `money refund for transaction ${refund.originalTransactionId}`,
          );

          if (!updatedStock.success) {
            // This should never happen given your business rules, but handle gracefully
            this.logger.error(
              `CRITICAL: Failed to update stock ${originalItem.stockId}. Creating new stock record. Reason: ${updatedStock.reason}`,
            );

            await tx.stock.create({
              data: {
                itemId: originalItem.itemId,
                quantity: refundItem.quantityToRefund,
                refillAlert: false,
                lastRefilled: new Date(),
              },
            });
          }
        }
      } else {
        // Transaction item has no stock reference - create new stock record
        await tx.stock.create({
          data: {
            itemId: originalItem.itemId,
            quantity: refundItem.quantityToRefund,
            refillAlert: false,
            lastRefilled: new Date(),
          },
        });
      }

      this.logger.log(
        `Returned ${refundItem.quantityToRefund} units of item ${originalItem.item.name} to stock`,
      );
    }
  }

  private async processItemExchange(tx: any, refund: any): Promise<void> {
    this.logger.log(`Processing item exchange for refund ID: ${refund.id}`);

    // First, return old items to stock (same as money refund)
    await this.processMoneyRefund(tx, refund);

    // CRITICAL FIX 1.1: Handle base debt adjustment for refunded amount
    await this.adjustCustomerDebtForExchange(tx, refund);

    // Then, reduce stock for new exchange items (with enhanced atomic update)
    for (const exchangeItem of refund.exchangeItems) {
      // CRITICAL FIX 3.3: Enhanced atomic stock decrement with race condition protection
      try {
        const decrementResult = await this.atomicStockDecrement(
          tx,
          exchangeItem.itemId,
          exchangeItem.quantity,
          `item exchange for refund ${refund.id}`,
        );

        if (!decrementResult.success) {
          // No stock was updated, either no stock record or insufficient quantity
          const stock = await tx.stock.findFirst({
            where: { itemId: exchangeItem.itemId },
          });

          if (!stock) {
            throw new BadRequestException(
              `No stock available for exchange item: ${exchangeItem.item.name}`,
            );
          } else {
            throw new BadRequestException(
              `Insufficient stock for exchange item ${exchangeItem.item.name}. Available: ${stock.quantity}, Required: ${exchangeItem.quantity}`,
            );
          }
        }
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new BadRequestException(
          `Failed to update stock for exchange item ${exchangeItem.item.name}: ${error.message}`,
        );
      }

      this.logger.log(
        `Reduced stock by ${exchangeItem.quantity} units for exchange item ${exchangeItem.item.name}`,
      );
    }

    // BUSINESS LOGIC FIX: Handle exchange money flow
    if (refund.exchangeAmountDue !== null && refund.exchangeAmountDue !== 0) {
      if (refund.exchangeAmountDue > 0) {
        // Customer pays additional money (new item more expensive)
        this.logger.log(
          `Exchange requires additional payment of $${refund.exchangeAmountDue} from customer`,
        );

        // Create additional transaction for the extra payment
        await tx.transaction.create({
          data: {
            type: TransactionType.SELL, // Additional sale for price difference
            customerId: refund.customerId,
            totalAmount: refund.exchangeAmountDue,
            date: new Date(),
            // Default to CASH for exchange additional payments
            paymentMethod: 'CASH',
          },
        });

        // CRITICAL FIX 2.3: Update existing debt instead of creating new record
        const existingDebt = await tx.debt.findFirst({
          where: {
            customerId: refund.customerId,
            transactionId: refund.originalTransactionId,
            isSettled: false,
          },
        });

        if (existingDebt) {
          // Update existing debt by adding the exchange amount
          const newDebtAmount = existingDebt.amount + refund.exchangeAmountDue;
          await tx.debt.update({
            where: { id: existingDebt.id },
            data: {
              amount: newDebtAmount,
              // Extend due date if adding more debt
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
          });
          this.logger.log(
            `Updated existing debt from $${existingDebt.amount} to $${newDebtAmount} for additional exchange payment`,
          );
        } else {
          // Create new debt record only if none exists
          await tx.debt.create({
            data: {
              customerId: refund.customerId,
              amount: refund.exchangeAmountDue,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
              transactionId: refund.originalTransactionId,
            },
          });
          this.logger.log(
            `Created new debt record for $${refund.exchangeAmountDue} exchange payment`,
          );
        }
      } else {
        // Customer receives money back (new item less expensive)
        const moneyBack = Math.abs(refund.exchangeAmountDue);
        this.logger.log(`Exchange gives customer $${moneyBack} back`);

        // Create refund transaction for the money difference
        await tx.transaction.create({
          data: {
            type: TransactionType.REFUND,
            customerId: refund.customerId,
            totalAmount: -moneyBack, // Negative for money going out
            date: new Date(),
            paymentMethod: 'CASH', // Refunds are typically cash-based
          },
        });

        // EDGE CASE FIX: Handle money back when debt is insufficient
        const existingDebt = await tx.debt.findFirst({
          where: {
            customerId: refund.customerId,
            transactionId: refund.originalTransactionId,
            isSettled: false,
          },
        });

        if (existingDebt) {
          if (existingDebt.amount >= moneyBack) {
            // Normal case: Debt covers the money back
            const newDebtAmount = existingDebt.amount - moneyBack;
            await tx.debt.update({
              where: { id: existingDebt.id },
              data: {
                amount: newDebtAmount,
                isSettled: newDebtAmount === 0,
              },
            });
            this.logger.log(
              `Reduced debt from $${existingDebt.amount} to $${newDebtAmount}`,
            );
          } else {
            // EDGE CASE: Money back exceeds debt - customer has credit balance
            const excessAmount = moneyBack - existingDebt.amount;

            // Settle the existing debt completely
            await tx.debt.update({
              where: { id: existingDebt.id },
              data: {
                amount: 0,
                isSettled: true,
              },
            });

            // CRITICAL FIX 4.2: Secure unlimited credit creation with validation and audit logging
            const creditAmount =
              this.financialPrecision.toCurrency(excessAmount);

            // Validate credit creation (business logic allows unlimited credits)
            await this.validateAndAuditCreditCreation(
              refund,
              this.financialPrecision.toNumber(creditAmount),
              'exchange-excess-payment',
              `Debt fully settled ($${existingDebt.amount}), excess payment converted to credit`,
            );

            await tx.debt.update({
              where: { id: existingDebt.id },
              data: {
                amount: -this.financialPrecision.toNumber(creditAmount), // Negative amount indicates credit balance
                dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
                isSettled: false,
                remarks: `Credit from exchange refund #${refund.id} - excess amount ($${this.financialPrecision.toFixed(creditAmount)})`,
              },
            });

            this.logger.log(
              `✅ Debt fully settled ($${existingDebt.amount}) and created SECURED credit balance of $${this.financialPrecision.toFixed(creditAmount)} for customer ${refund.customerId}`,
            );
          }
        } else {
          // CRITICAL FIX 2.3: Check for any existing debt records before creating new one
          const anyExistingDebt = await tx.debt.findFirst({
            where: {
              customerId: refund.customerId,
              transactionId: refund.originalTransactionId,
            },
          });

          if (anyExistingDebt) {
            // Update existing debt record (even if settled) to credit balance
            await tx.debt.update({
              where: { id: anyExistingDebt.id },
              data: {
                amount: -moneyBack, // Negative amount indicates credit balance
                dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
                isSettled: false,
                remarks: `Credit from exchange refund #${refund.id} - converted from settled debt`,
              },
            });
            this.logger.log(
              `Updated existing debt record to credit balance of $${moneyBack} for customer`,
            );
          } else {
            // CRITICAL FIX 4.2: Secure new credit record creation with validation
            const creditAmountDecimal =
              this.financialPrecision.toCurrency(moneyBack);

            // Validate credit creation (business logic allows unlimited credits)
            await this.validateAndAuditCreditCreation(
              refund,
              this.financialPrecision.toNumber(creditAmountDecimal),
              'exchange-new-credit',
              `No existing debt found, creating new credit record`,
            );

            // Create new debt record only if absolutely no debt record exists
            await tx.debt.create({
              data: {
                customerId: refund.customerId,
                amount: -this.financialPrecision.toNumber(creditAmountDecimal), // Negative amount indicates credit balance
                dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
                isSettled: false,
                remarks: `Credit from exchange refund #${refund.id} - no existing debt - amount: $${this.financialPrecision.toFixed(creditAmountDecimal)}`,
                transactionId: refund.originalTransactionId,
              },
            });
            this.logger.log(
              `✅ No existing debt found - created SECURED credit balance of $${this.financialPrecision.toFixed(creditAmountDecimal)} for customer ${refund.customerId}`,
            );
          }
        }
      }
    } else {
      // Same value exchange - no money transfer
      this.logger.log('Exchange has same value - no money transfer required');
    }
  }

  async updateStatus(
    refundId: number,
    status: RefundStatus,
    processedBy?: number,
  ): Promise<Refund> {
    const refund = await this.refundRepository.findById(refundId);

    if (!refund) {
      throw new NotFoundException(`Refund with ID ${refundId} not found`);
    }

    // Validate status transition
    this.validateStatusTransition(refund.status, status);

    return this.refundRepository.updateStatus(refundId, status, processedBy);
  }

  private validateStatusTransition(
    currentStatus: RefundStatus,
    newStatus: RefundStatus,
  ): void {
    const validTransitions: Record<RefundStatus, RefundStatus[]> = {
      [RefundStatus.PENDING]: [
        RefundStatus.APPROVED,
        RefundStatus.REJECTED,
        RefundStatus.CANCELLED,
      ],
      [RefundStatus.APPROVED]: [RefundStatus.PROCESSED, RefundStatus.CANCELLED],
      [RefundStatus.PROCESSED]: [], // Terminal state
      [RefundStatus.REJECTED]: [], // Terminal state
      [RefundStatus.CANCELLED]: [], // Terminal state
    };

    const allowedStatuses = validTransitions[currentStatus];

    if (!allowedStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  private async adjustCustomerDebt(tx: any, refund: any): Promise<void> {
    this.logger.log(`Adjusting customer debt for refund ID: ${refund.id}`);

    // CRITICAL FIX: Calculate total already refunded amount to prevent over-reduction
    const processedRefunds = await tx.refund.findMany({
      where: {
        originalTransactionId: refund.originalTransactionId,
        status: RefundStatus.PROCESSED, // CRITICAL FIX 1.3: Use enum value
        id: { not: refund.id }, // Exclude current refund
      },
    });

    const totalAlreadyRefunded = processedRefunds.reduce(
      (sum, processedRefund) => sum + processedRefund.totalRefundAmount,
      0,
    );

    // Find existing debt for the original transaction
    const existingDebt = await tx.debt.findFirst({
      where: {
        customerId: refund.customerId,
        transactionId: refund.originalTransactionId,
      },
    });

    if (existingDebt) {
      // Calculate original transaction amount
      const originalTransaction = await tx.transaction.findUnique({
        where: { id: refund.originalTransactionId },
      });

      if (!originalTransaction) {
        throw new Error(
          `Original transaction ${refund.originalTransactionId} not found`,
        );
      }

      // CRITICAL FIX 2.2: Enhanced debt calculation with credit limit handling
      const totalRefunded = totalAlreadyRefunded + refund.totalRefundAmount;
      const correctDebtAmount = originalTransaction.totalAmount - totalRefunded;

      if (correctDebtAmount <= 0) {
        // Customer has overpaid or refunds exceed original amount
        const creditAmount = Math.abs(correctDebtAmount);

        if (creditAmount === 0) {
          // Exact settlement - mark debt as settled
          await tx.debt.update({
            where: { id: existingDebt.id },
            data: {
              amount: 0,
              isSettled: true,
            },
          });
          this.logger.log(
            `Debt exactly settled with total refunds: $${totalRefunded}`,
          );
        } else {
          // CRITICAL FIX 4.2: Secure credit balance creation with validation
          const creditAmountDecimal =
            this.financialPrecision.toCurrency(creditAmount);

          // Validate credit creation (business logic allows unlimited credits)
          await this.validateAndAuditCreditCreation(
            refund,
            this.financialPrecision.toNumber(creditAmountDecimal),
            'money-refund-credit',
            `Debt converted to credit balance (original: $${originalTransaction.totalAmount}, total refunded: $${totalRefunded})`,
          );

          // Customer has credit balance - convert to negative debt (credit limit)
          await tx.debt.update({
            where: { id: existingDebt.id },
            data: {
              amount: -this.financialPrecision.toNumber(creditAmountDecimal), // NEGATIVE VALUE = CREDIT BALANCE
              isSettled: false, // Keep active for credit tracking
              remarks: `Credit from money refund #${refund.id} - amount: $${this.financialPrecision.toFixed(creditAmountDecimal)}`,
            },
          });
          this.logger.log(
            `✅ Debt converted to SECURED credit balance: -$${this.financialPrecision.toFixed(creditAmountDecimal)} for customer ${refund.customerId} (original: $${originalTransaction.totalAmount}, total refunded: $${totalRefunded})`,
          );
        }
      } else {
        // Normal case: Customer still owes money
        await tx.debt.update({
          where: { id: existingDebt.id },
          data: {
            amount: correctDebtAmount,
            isSettled: false,
          },
        });
        this.logger.log(
          `Updated debt to $${correctDebtAmount} (original: $${originalTransaction.totalAmount}, total refunded: $${totalRefunded})`,
        );
      }
    } else {
      this.logger.warn(
        `No debt found for customer ${refund.customerId} and transaction ${refund.originalTransactionId}`,
      );
    }
  }

  private async adjustCustomerDebtForExchange(
    tx: any,
    refund: any,
  ): Promise<void> {
    this.logger.log(
      `Adjusting customer debt for exchange refund ID: ${refund.id}`,
    );

    // For exchanges, only reduce debt by the refunded amount (not including exchange difference)
    // The exchange difference is handled separately in processItemExchange
    const processedRefunds = await tx.refund.findMany({
      where: {
        originalTransactionId: refund.originalTransactionId,
        status: RefundStatus.PROCESSED, // CRITICAL FIX 1.3: Use enum value
        id: { not: refund.id },
      },
    });

    const totalAlreadyRefunded = processedRefunds.reduce(
      (sum, processedRefund) => sum + processedRefund.totalRefundAmount,
      0,
    );

    const existingDebt = await tx.debt.findFirst({
      where: {
        customerId: refund.customerId,
        transactionId: refund.originalTransactionId,
        isSettled: false,
      },
    });

    if (existingDebt) {
      const originalTransaction = await tx.transaction.findUnique({
        where: { id: refund.originalTransactionId },
      });

      if (!originalTransaction) {
        throw new Error(
          `Original transaction ${refund.originalTransactionId} not found`,
        );
      }

      // For exchanges, reduce debt by refunded amount only
      // Exchange amount difference is handled separately
      const totalRefunded = totalAlreadyRefunded + refund.totalRefundAmount;
      const baseDebtReduction = originalTransaction.totalAmount - totalRefunded;

      if (baseDebtReduction <= 0) {
        await tx.debt.update({
          where: { id: existingDebt.id },
          data: {
            amount: 0,
            isSettled: true,
          },
        });
        this.logger.log(
          `Debt settled for exchange with total refunds: ${totalRefunded}`,
        );
      } else {
        await tx.debt.update({
          where: { id: existingDebt.id },
          data: {
            amount: baseDebtReduction,
          },
        });
        this.logger.log(
          `Updated debt to ${baseDebtReduction} for exchange (original: ${originalTransaction.totalAmount}, refunded: ${totalRefunded})`,
        );
      }
    } else {
      this.logger.warn(
        `No debt found for customer ${refund.customerId} and transaction ${refund.originalTransactionId}`,
      );
    }
  }

  /**
   * CRITICAL FIX 3.3: Atomic stock increment with comprehensive race condition protection
   *
   * Handles concurrent refund processing by using atomic operations and proper validation.
   * Multiple refunds processing simultaneously will not corrupt stock quantities.
   */
  private async atomicStockIncrement(
    tx: any,
    stockId: number,
    expectedItemId: number,
    quantityToAdd: number,
    operation: string,
  ): Promise<{ success: boolean; count?: number; reason?: string }> {
    this.logger.debug(
      `Atomic stock increment: stockId=${stockId}, itemId=${expectedItemId}, quantity=${quantityToAdd}, operation=${operation}`,
    );

    try {
      // CRITICAL: Use updateMany with precise conditions to ensure atomicity
      const result = await tx.stock.updateMany({
        where: {
          id: stockId,
          itemId: expectedItemId, // Verify item relationship
          // Additional safety: ensure stock record is not in an invalid state
          quantity: { gte: 0 }, // Stock should never be negative
        },
        data: {
          quantity: {
            increment: quantityToAdd,
          },
          lastRefilled: new Date(), // Track when stock was last modified
        },
      });

      if (result.count === 1) {
        this.logger.debug(
          `Successfully incremented stock ${stockId} by ${quantityToAdd} for ${operation}`,
        );
        return { success: true, count: result.count };
      } else if (result.count === 0) {
        this.logger.warn(
          `Failed to increment stock ${stockId}: No matching record found or item ID mismatch`,
        );
        return {
          success: false,
          count: 0,
          reason: 'No matching stock record found or item ID mismatch',
        };
      } else {
        this.logger.error(
          `CRITICAL: Multiple stock records updated (${result.count}) for single stock ID ${stockId}`,
        );
        return {
          success: false,
          count: result.count,
          reason: 'Multiple stock records updated - data integrity violation',
        };
      }
    } catch (error) {
      this.logger.error(
        `Error during atomic stock increment for stock ${stockId}: ${error.message}`,
      );
      return {
        success: false,
        reason: `Database error: ${error.message}`,
      };
    }
  }

  /**
   * CRITICAL FIX 3.3: Atomic stock decrement with comprehensive race condition protection
   *
   * Ensures that stock is only decremented if sufficient quantity is available.
   * Prevents overselling and negative stock quantities.
   */
  private async atomicStockDecrement(
    tx: any,
    itemId: number,
    quantityToReduce: number,
    operation: string,
  ): Promise<{
    success: boolean;
    actualQuantityReduced?: number;
    reason?: string;
  }> {
    this.logger.debug(
      `Atomic stock decrement: itemId=${itemId}, quantity=${quantityToReduce}, operation=${operation}`,
    );

    try {
      // CRITICAL: Use updateMany with quantity condition to prevent overselling
      const result = await tx.stock.updateMany({
        where: {
          itemId: itemId,
          quantity: { gte: quantityToReduce }, // Only update if sufficient stock
          // Additional safety: ensure stock is in valid state
        },
        data: {
          quantity: {
            decrement: quantityToReduce,
          },
          lastRefilled: new Date(), // Track when stock was last modified
        },
      });

      if (result.count > 0) {
        this.logger.debug(
          `Successfully decremented stock for item ${itemId} by ${quantityToReduce} for ${operation}`,
        );
        return {
          success: true,
          actualQuantityReduced: quantityToReduce,
        };
      } else {
        // Check why the update failed
        const currentStock = await tx.stock.findFirst({
          where: { itemId: itemId },
          select: { id: true, quantity: true, itemId: true },
        });

        if (!currentStock) {
          this.logger.warn(
            `Failed to decrement stock for item ${itemId}: No stock record found`,
          );
          return {
            success: false,
            reason: `No stock record found for item ${itemId}`,
          };
        } else if (currentStock.quantity < quantityToReduce) {
          this.logger.warn(
            `Failed to decrement stock for item ${itemId}: Insufficient stock (available: ${currentStock.quantity}, requested: ${quantityToReduce})`,
          );
          return {
            success: false,
            reason: `Insufficient stock: available ${currentStock.quantity}, requested ${quantityToReduce}`,
          };
        } else {
          this.logger.error(
            `CRITICAL: Stock decrement failed for unknown reason. Item ${itemId}, Stock ID: ${currentStock.id}, Available: ${currentStock.quantity}, Requested: ${quantityToReduce}`,
          );
          return {
            success: false,
            reason: 'Unknown error during stock decrement',
          };
        }
      }
    } catch (error) {
      this.logger.error(
        `Error during atomic stock decrement for item ${itemId}: ${error.message}`,
      );
      return {
        success: false,
        reason: `Database error: ${error.message}`,
      };
    }
  }

  /**
   * CRITICAL: Enhanced stock operation with retry logic for high-concurrency scenarios
   *
   * In extremely high-traffic scenarios, provides retry mechanism for atomic operations
   */
  private async atomicStockOperationWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 10,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Only retry on specific database concurrency errors
        if (
          error.code === 'P2034' || // Transaction conflicts
          error.code === 'P2002' || // Unique constraint violation
          error.message.includes('concurrent') ||
          error.message.includes('deadlock')
        ) {
          this.logger.warn(
            `Stock operation failed on attempt ${attempt}/${maxRetries}: ${error.message}. Retrying in ${delayMs}ms...`,
          );

          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, delayMs * attempt),
          );
          continue;
        }

        // Non-retryable error
        throw error;
      }
    }

    throw lastError;
  }

  /**
   * CRITICAL FIX 4.1: Validate transaction item ownership to prevent bypass attacks
   *
   * Ensures that all refund items actually belong to the original transaction.
   * Prevents database corruption or malicious attacks from processing wrong items.
   */
  private async validateTransactionItemOwnership(refund: any): Promise<void> {
    this.logger.debug(
      `Validating transaction item ownership for refund ${refund.id} against transaction ${refund.originalTransactionId}`,
    );

    // Get all valid transaction item IDs from the original transaction
    const validTransactionItemIds = new Set(
      refund.originalTransaction.transactionItems.map((item) => item.id),
    );

    this.logger.debug(
      `Valid transaction item IDs: [${Array.from(validTransactionItemIds).join(', ')}]`,
    );

    // Validate each refund item belongs to the original transaction
    for (const refundItem of refund.refundItems) {
      const originalTransactionItemId = refundItem.originalTransactionItem.id;

      if (!validTransactionItemIds.has(originalTransactionItemId)) {
        this.logger.error(
          `SECURITY VIOLATION: Refund item ${refundItem.id} references transaction item ${originalTransactionItemId} which does not belong to transaction ${refund.originalTransactionId}`,
        );

        throw new BadRequestException(
          `SECURITY ERROR: Invalid transaction item reference detected. Refund item ${refundItem.id} does not belong to transaction ${refund.originalTransactionId}`,
        );
      }

      // Additional validation: Ensure the transaction item data matches expectations
      const expectedTransactionItem =
        refund.originalTransaction.transactionItems.find(
          (item) => item.id === originalTransactionItemId,
        );

      if (!expectedTransactionItem) {
        // This should never happen if the above check passed, but extra safety
        throw new BadRequestException(
          `CRITICAL ERROR: Transaction item ${originalTransactionItemId} not found in transaction ${refund.originalTransactionId}`,
        );
      }

      // Validate item consistency
      if (
        refundItem.originalTransactionItem.itemId !==
        expectedTransactionItem.itemId
      ) {
        this.logger.error(
          `DATA INTEGRITY VIOLATION: Transaction item ${originalTransactionItemId} has mismatched item ID (expected: ${expectedTransactionItem.itemId}, actual: ${refundItem.originalTransactionItem.itemId})`,
        );

        throw new BadRequestException(
          `DATA INTEGRITY ERROR: Transaction item data corruption detected for item ${originalTransactionItemId}`,
        );
      }

      // Validate quantity consistency (refund quantity should not exceed original quantity)
      if (refundItem.quantityToRefund > expectedTransactionItem.quantity) {
        this.logger.error(
          `BUSINESS RULE VIOLATION: Refund quantity ${refundItem.quantityToRefund} exceeds original transaction quantity ${expectedTransactionItem.quantity} for item ${originalTransactionItemId}`,
        );

        throw new BadRequestException(
          `BUSINESS ERROR: Cannot refund ${refundItem.quantityToRefund} items when only ${expectedTransactionItem.quantity} were purchased`,
        );
      }

      this.logger.debug(
        `✅ Validated refund item ${refundItem.id}: transaction item ${originalTransactionItemId} belongs to transaction ${refund.originalTransactionId}`,
      );
    }

    this.logger.log(
      `✅ All ${refund.refundItems.length} refund items validated successfully for transaction ${refund.originalTransactionId}`,
    );
  }

  /**
   * CRITICAL FIX 4.2: Validate and audit credit creation
   *
   * While business logic allows unlimited credits (expensive item → cheap item exchanges),
   * we need comprehensive validation and audit logging for security and compliance.
   */
  private async validateAndAuditCreditCreation(
    refund: any,
    creditAmount: number,
    creditType: string,
    reason: string,
  ): Promise<void> {
    this.logger.debug(
      `Validating credit creation: Customer ${refund.customerId}, Amount: $${creditAmount}, Type: ${creditType}`,
    );

    // Validate credit amount is positive (will be stored as negative debt)
    if (creditAmount <= 0) {
      throw new BadRequestException(
        `Invalid credit amount: $${creditAmount}. Credit amount must be positive.`,
      );
    }

    // Validate credit amount is finite and reasonable
    if (!Number.isFinite(creditAmount) || isNaN(creditAmount)) {
      throw new BadRequestException(
        `Invalid credit amount: $${creditAmount}. Credit amount must be a finite number.`,
      );
    }

    // Business logic validation: Ensure credit is justified by refund context
    const maxAllowableCredit =
      this.calculateMaxAllowableCreditForRefund(refund);
    if (creditAmount > maxAllowableCredit) {
      this.logger.error(
        `SECURITY ALERT: Credit amount $${creditAmount} exceeds maximum allowable credit $${maxAllowableCredit} for refund ${refund.id}`,
      );
      throw new BadRequestException(
        `Credit amount $${creditAmount} exceeds maximum allowable credit based on refund context.`,
      );
    }

    // AUDIT LOGGING: Comprehensive credit creation audit
    this.logger.warn(
      `🔍 CREDIT CREATION AUDIT: Customer ${refund.customerId} | Refund ${refund.id} | Amount: $${creditAmount} | Type: ${creditType} | Reason: ${reason} | Original Transaction: ${refund.originalTransactionId} | Original Amount: $${refund.originalTransaction?.totalAmount || 'N/A'}`,
    );

    // Additional security checks based on credit type
    switch (creditType) {
      case 'exchange-excess-payment':
        await this.validateExchangeExcessCredit(refund, creditAmount);
        break;
      case 'money-refund-credit':
        await this.validateMoneyRefundCredit(refund, creditAmount);
        break;
      case 'exchange-new-credit':
        await this.validateExchangeNewCredit(refund, creditAmount);
        break;
      default:
        this.logger.warn(`Unknown credit type: ${creditType}`);
    }

    this.logger.log(
      `✅ Credit creation validated: $${creditAmount} for customer ${refund.customerId} (${creditType})`,
    );
  }

  /**
   * Calculate maximum allowable credit for a refund based on business context
   *
   * Business Rule: Customer can get unlimited credit when exchanging expensive items for cheaper ones,
   * but the credit amount should not exceed the total value of items being refunded.
   */
  private calculateMaxAllowableCreditForRefund(refund: any): number {
    // Calculate total value of items being refunded
    const totalRefundValue = refund.refundItems.reduce((total, item) => {
      return total + item.refundAmount;
    }, 0);

    // For exchanges, also consider exchange items
    let totalExchangeValue = 0;
    if (refund.exchangeItems && refund.exchangeItems.length > 0) {
      totalExchangeValue = refund.exchangeItems.reduce((total, item) => {
        return total + item.totalAmount;
      }, 0);
    }

    // Maximum credit = Total refund value (since that's what customer paid for)
    // This prevents fraudulent over-crediting while allowing legitimate high-value exchanges
    const maxCredit = Math.max(
      totalRefundValue,
      refund.originalTransaction?.totalAmount || totalRefundValue,
    );

    this.logger.debug(
      `Max allowable credit calculation: Refund value: $${totalRefundValue}, Exchange value: $${totalExchangeValue}, Original transaction: $${refund.originalTransaction?.totalAmount || 'N/A'}, Max credit: $${maxCredit}`,
    );

    return maxCredit;
  }

  /**
   * Validate exchange excess credit (customer gets money back from exchange)
   */
  private async validateExchangeExcessCredit(
    refund: any,
    creditAmount: number,
  ): Promise<void> {
    if (!refund.exchangeAmountDue || refund.exchangeAmountDue >= 0) {
      throw new BadRequestException(
        `Invalid exchange excess credit: Exchange amount due should be negative (customer gets money back), but got: $${refund.exchangeAmountDue}`,
      );
    }

    const expectedCredit = Math.abs(refund.exchangeAmountDue);
    const tolerance = 0.01; // 1 cent tolerance

    if (Math.abs(creditAmount - expectedCredit) > tolerance) {
      this.logger.error(
        `Credit amount mismatch: Expected $${expectedCredit} based on exchange amount due, but got $${creditAmount}`,
      );
      throw new BadRequestException(
        `Credit amount validation failed: Expected $${expectedCredit}, got $${creditAmount}`,
      );
    }
  }

  /**
   * Validate money refund credit
   */
  private async validateMoneyRefundCredit(
    refund: any,
    creditAmount: number,
  ): Promise<void> {
    const totalRefundAmount = refund.totalRefundAmount || 0;

    if (creditAmount > totalRefundAmount) {
      throw new BadRequestException(
        `Money refund credit amount $${creditAmount} cannot exceed total refund amount $${totalRefundAmount}`,
      );
    }
  }

  /**
   * Validate exchange new credit (new credit record creation)
   */
  private async validateExchangeNewCredit(
    refund: any,
    creditAmount: number,
  ): Promise<void> {
    // Ensure this is actually an exchange refund
    if (refund.refundType !== 'ITEM_EXCHANGE') {
      throw new BadRequestException(
        `Exchange new credit validation failed: Refund type is ${refund.refundType}, expected ITEM_EXCHANGE`,
      );
    }

    // Ensure exchange amount due is negative (customer gets money back)
    if (!refund.exchangeAmountDue || refund.exchangeAmountDue >= 0) {
      throw new BadRequestException(
        `Exchange new credit validation failed: Exchange amount due should be negative, got $${refund.exchangeAmountDue}`,
      );
    }
  }

  /**
   * CRITICAL FIX 5.1: Validate orphaned refunds (original transaction deleted)
   *
   * Handles the edge case where a refund exists but its original transaction has been deleted.
   * Provides graceful handling instead of system crashes.
   */
  private async validateOrphanedRefund(refund: any): Promise<void> {
    this.logger.debug(
      `Validating orphaned refund: Refund ${refund.id} references transaction ${refund.originalTransactionId}`,
    );

    // Check if original transaction exists and is accessible
    if (!refund.originalTransaction) {
      this.logger.error(
        `ORPHANED REFUND DETECTED: Refund ${refund.id} references non-existent transaction ${refund.originalTransactionId}`,
      );

      // Handle orphaned refund gracefully
      await this.handleOrphanedRefund(refund);

      throw new BadRequestException(
        `Cannot process refund ${refund.id}: Original transaction ${refund.originalTransactionId} no longer exists. Refund has been marked as CANCELLED.`,
      );
    }

    // Validate transaction data integrity
    if (
      !refund.originalTransaction.transactionItems ||
      refund.originalTransaction.transactionItems.length === 0
    ) {
      this.logger.error(
        `TRANSACTION DATA CORRUPTION: Transaction ${refund.originalTransactionId} has no transaction items`,
      );

      throw new BadRequestException(
        `Cannot process refund ${refund.id}: Original transaction ${refund.originalTransactionId} has corrupted data (no transaction items).`,
      );
    }

    // Validate customer relationship
    if (refund.customerId !== refund.originalTransaction.customerId) {
      this.logger.error(
        `CUSTOMER MISMATCH: Refund ${refund.id} customer ${refund.customerId} does not match transaction ${refund.originalTransactionId} customer ${refund.originalTransaction.customerId}`,
      );

      throw new BadRequestException(
        `Cannot process refund ${refund.id}: Customer mismatch detected. This may indicate data corruption.`,
      );
    }

    // Validate transaction type (only SELL transactions can be refunded)
    if (refund.originalTransaction.type !== TransactionType.SELL) {
      this.logger.error(
        `INVALID TRANSACTION TYPE: Refund ${refund.id} references ${refund.originalTransaction.type} transaction, but only SELL transactions can be refunded`,
      );

      throw new BadRequestException(
        `Cannot process refund ${refund.id}: Only SELL transactions can be refunded, but original transaction ${refund.originalTransactionId} is type ${refund.originalTransaction.type}.`,
      );
    }

    this.logger.debug(
      `✅ Orphaned refund validation passed: Refund ${refund.id} has valid original transaction ${refund.originalTransactionId}`,
    );
  }

  /**
   * Handle orphaned refund by marking it as cancelled and logging for audit
   */
  private async handleOrphanedRefund(refund: any): Promise<void> {
    try {
      // Mark the refund as CANCELLED in a separate transaction to avoid rollback
      await this.prisma.refund.update({
        where: { id: refund.id },
        data: {
          status: RefundStatus.CANCELLED,
          processedAt: new Date(),
          reason: `CANCELLED: Original transaction ${refund.originalTransactionId} no longer exists`,
        },
      });

      this.logger.warn(
        `🚨 ORPHANED REFUND HANDLED: Refund ${refund.id} marked as CANCELLED due to missing original transaction ${refund.originalTransactionId}`,
      );

      // TODO: Consider notifying administrators about orphaned refunds
      // This could indicate data integrity issues that need investigation
    } catch (error) {
      this.logger.error(
        `Failed to handle orphaned refund ${refund.id}: ${error.message}`,
      );
      // Don't throw here - we still want to inform the user about the orphaned refund
    }
  }

  /**
   * ADMIN AUTO-APPROVAL: Validate refund status for processing with admin bypass
   *
   * Business Logic:
   * - Regular users: Refund must be APPROVED before processing
   * - Admin users: Can process refunds directly from PENDING status (auto-approval)
   */
  private async validateRefundStatusForProcessing(
    refund: any,
    processedBy: number | undefined,
    tx: any,
  ): Promise<void> {
    this.logger.debug(
      `Validating refund status for processing: Refund ${refund.id}, Status: ${refund.status}, ProcessedBy: ${processedBy}`,
    );

    // If refund is already APPROVED, allow processing for any user
    if (refund.status === RefundStatus.APPROVED) {
      this.logger.debug(
        `✅ Refund ${refund.id} is already APPROVED - proceeding with processing`,
      );
      return;
    }

    // If no processedBy user provided, require APPROVED status
    if (!processedBy) {
      throw new BadRequestException(
        `Refund must be APPROVED before processing. Current status: ${refund.status}. Please provide processedBy user ID for admin auto-approval.`,
      );
    }

    // Check if the processing user is an admin
    const processingUser = await tx.user.findUnique({
      where: { id: processedBy },
      select: { id: true, role: true, email: true },
    });

    if (!processingUser) {
      throw new BadRequestException(
        `Invalid processedBy user ID: ${processedBy}. User not found.`,
      );
    }

    // Admin auto-approval logic
    if (processingUser.role === 'ADMIN') {
      // Admin can process refunds directly from PENDING status
      if (refund.status === RefundStatus.PENDING) {
        this.logger.log(
          `🔓 ADMIN AUTO-APPROVAL: Admin ${processingUser.email} (ID: ${processedBy}) is auto-approving and processing refund ${refund.id} from ${refund.status} status`,
        );

        // Auto-approve the refund
        await tx.refund.update({
          where: { id: refund.id },
          data: {
            status: RefundStatus.APPROVED,
            reason: refund.reason
              ? `${refund.reason} | AUTO-APPROVED by admin ${processingUser.email}`
              : `AUTO-APPROVED by admin ${processingUser.email}`,
          },
        });

        this.logger.log(
          `✅ Refund ${refund.id} auto-approved by admin ${processingUser.email} and ready for processing`,
        );
        return;
      } else if (
        refund.status === RefundStatus.REJECTED ||
        refund.status === RefundStatus.CANCELLED
      ) {
        // Even admins cannot process rejected or cancelled refunds
        throw new BadRequestException(
          `Cannot process refund ${refund.id}: Refund has been ${refund.status}. Even admins cannot process ${refund.status} refunds.`,
        );
      } else if (refund.status === RefundStatus.PROCESSED) {
        throw new BadRequestException(
          `Cannot process refund ${refund.id}: Refund has already been PROCESSED.`,
        );
      } else {
        // Unknown status
        throw new BadRequestException(
          `Cannot process refund ${refund.id}: Unknown refund status ${refund.status}.`,
        );
      }
    } else {
      // Non-admin users require APPROVED status
      this.logger.warn(
        `⚠️ NON-ADMIN PROCESSING ATTEMPT: User ${processingUser.email} (ID: ${processedBy}, Role: ${processingUser.role}) attempted to process refund ${refund.id} with status ${refund.status}`,
      );

      throw new BadRequestException(
        `Refund must be APPROVED before processing. Current status: ${refund.status}. Only admins can auto-approve pending refunds. Please have an admin approve this refund first.`,
      );
    }
  }
}
