import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Refund,
  RefundType,
  RefundStatus,
  TransactionType,
} from '@prisma/client';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import { CreateRefundDto } from '../../dtos/refund/create-refund.dto';
import { ValidateRefundEligibilityUseCase } from './validate-refund-eligibility.use-case';
import { FinancialPrecisionService } from '../../../core/common/service/financial-precision.service';
import { WarrantyValidationService } from '../../../core/common/service/warranty-validation.service';
import Decimal from 'decimal.js';

@Injectable()
export class CreateRefundUseCase {
  private readonly logger = new Logger(CreateRefundUseCase.name);

  constructor(
    private readonly validateRefundEligibilityUseCase: ValidateRefundEligibilityUseCase,
    private readonly prisma: PrismaService,
    private readonly financialPrecision: FinancialPrecisionService,
    private readonly warrantyValidation: WarrantyValidationService,
  ) {}

  async execute(
    transactionId: number,
    createRefundDto: CreateRefundDto,
  ): Promise<Refund> {
    this.logger.log(
      `Creating refund for transaction ${transactionId} with type: ${createRefundDto.refundType}`,
    );

    // Use Prisma transaction for atomic operations
    return await this.prisma.$transaction(async (tx) => {
      // Validate original transaction exists and is a SELL transaction
      const originalTransaction = await tx.transaction.findUnique({
        where: { id: transactionId },
        include: {
          customer: true,
          transactionItems: {
            include: {
              item: true,
              stock: true,
            },
          },
        },
      });

      if (!originalTransaction) {
        throw new NotFoundException(
          `Transaction with ID ${transactionId} not found`,
        );
      }

      if (originalTransaction.type !== TransactionType.SELL) {
        throw new BadRequestException('Only SELL transactions can be refunded');
      }

      if (!originalTransaction.customerId) {
        throw new BadRequestException(
          'Transaction must have a customer to process refund',
        );
      }

      // Validate refund eligibility
      const transactionItemIds = createRefundDto.refundItems.map(
        (item) => item.originalTransactionItemId,
      );

      const eligibilityResult =
        await this.validateRefundEligibilityUseCase.validateSpecificItems(
          transactionId,
          transactionItemIds,
        );

      if (!eligibilityResult.isEligible) {
        throw new BadRequestException(
          `Refund not eligible: ${eligibilityResult.overallReason}`,
        );
      }

      // CRITICAL FIX: Calculate already refunded quantities for multiple refunds
      const existingRefunds = await tx.refund.findMany({
        where: {
          originalTransactionId: transactionId,
          status: { in: [RefundStatus.PROCESSED] }, // CRITICAL FIX 1.3: Use enum value
        },
        include: {
          refundItems: true,
        },
      });

      // Build map of already refunded quantities per transaction item
      const alreadyRefundedMap = new Map<number, number>();
      existingRefunds.forEach((refund) => {
        refund.refundItems.forEach((refundItem) => {
          const key = refundItem.originalTransactionItemId;
          const existing = alreadyRefundedMap.get(key) || 0;
          alreadyRefundedMap.set(key, existing + refundItem.quantityToRefund);
        });
      });

      // Validate each refund item
      for (const refundItemDto of createRefundDto.refundItems) {
        // SECURITY FIX: Verify the transaction item belongs to this transaction
        const transactionItem = originalTransaction.transactionItems.find(
          (item) => item.id === refundItemDto.originalTransactionItemId,
        );

        if (!transactionItem) {
          throw new BadRequestException(
            `Transaction item ${refundItemDto.originalTransactionItemId} does not belong to transaction ${transactionId}`,
          );
        }

        const eligibleItem = eligibilityResult.items.find(
          (item) => item.id === refundItemDto.originalTransactionItemId,
        );

        if (!eligibleItem) {
          throw new NotFoundException(
            `Transaction item with ID ${refundItemDto.originalTransactionItemId} not found`,
          );
        }

        if (!eligibleItem.eligibility.isEligible) {
          throw new BadRequestException(
            `Item ${eligibleItem.item?.name || 'Unknown'} is not eligible for refund: ${eligibleItem.eligibility.reason}`,
          );
        }

        // CRITICAL FIX: Validate quantity considering already processed refunds
        const alreadyRefunded =
          alreadyRefundedMap.get(refundItemDto.originalTransactionItemId) || 0;
        const availableToRefund = eligibleItem.quantity - alreadyRefunded;

        if (refundItemDto.quantityToRefund > availableToRefund) {
          throw new BadRequestException(
            `Cannot refund ${refundItemDto.quantityToRefund} units of item ${eligibleItem.item?.name || 'Unknown'}. ` +
              `Only ${availableToRefund} units available (${eligibleItem.quantity} purchased, ${alreadyRefunded} already refunded).`,
          );
        }

        // Validate refund amount doesn't exceed original amount
        const maxRefundAmount =
          eligibleItem.unitPrice * refundItemDto.quantityToRefund;
        if (refundItemDto.refundAmount > maxRefundAmount) {
          throw new BadRequestException(
            `Refund amount ${refundItemDto.refundAmount} exceeds maximum refundable amount ${maxRefundAmount} for item ${eligibleItem.item?.name || 'Unknown'}`,
          );
        }
      }

      // For item exchange, validate exchange items
      if (createRefundDto.refundType === RefundType.ITEM_EXCHANGE) {
        if (
          !createRefundDto.exchangeItems ||
          createRefundDto.exchangeItems.length === 0
        ) {
          throw new BadRequestException(
            'Exchange items are required for ITEM_EXCHANGE refund type',
          );
        }

        // Validate exchange items exist and have sufficient stock
        for (const exchangeItemDto of createRefundDto.exchangeItems) {
          const item = await tx.item.findUnique({
            where: { id: exchangeItemDto.itemId },
          });

          if (!item) {
            throw new NotFoundException(
              `Exchange item with ID ${exchangeItemDto.itemId} not found`,
            );
          }

          // Check stock availability
          const stock = await tx.stock.findFirst({
            where: { itemId: exchangeItemDto.itemId },
          });

          if (!stock || stock.quantity < exchangeItemDto.quantity) {
            throw new BadRequestException(
              `Insufficient stock for exchange item ${item.name}. Available: ${stock?.quantity || 0}, Required: ${exchangeItemDto.quantity}`,
            );
          }

          // Validate total amount calculation
          const expectedTotal =
            exchangeItemDto.unitPrice * exchangeItemDto.quantity;
          if (Math.abs(exchangeItemDto.totalAmount - expectedTotal) > 0.01) {
            throw new BadRequestException(
              `Invalid total amount for exchange item ${item.name}. Expected: ${expectedTotal}, Provided: ${exchangeItemDto.totalAmount}`,
            );
          }
        }
      }

      // Calculate total refund amount
      const totalRefundAmount = createRefundDto.refundItems.reduce(
        (sum, item) => sum + item.refundAmount,
        0,
      );

      // CRITICAL FIX 5.2: Validate zero or negative refund amounts
      await this.validateRefundAmounts(createRefundDto, totalRefundAmount);

      // CRITICAL FIX 2.2: Validate total refunds don't exceed original transaction
      const totalAlreadyRefunded = existingRefunds.reduce(
        (sum, refund) => sum + refund.totalRefundAmount,
        0,
      );

      const totalRefundsAfterThis = totalAlreadyRefunded + totalRefundAmount;
      const maxRefundable = originalTransaction.totalAmount;

      if (totalRefundsAfterThis > maxRefundable) {
        throw new BadRequestException(
          `Total refund amount ($${totalRefundsAfterThis.toFixed(2)}) would exceed original transaction amount ($${maxRefundable.toFixed(2)}). ` +
            `Already refunded: $${totalAlreadyRefunded.toFixed(2)}, Current refund: $${totalRefundAmount.toFixed(2)}, Maximum allowed: $${(maxRefundable - totalAlreadyRefunded).toFixed(2)}`,
        );
      }

      // Log refund validation for audit trail
      this.logger.log(
        `Refund validation passed: Transaction $${maxRefundable.toFixed(2)}, Already refunded $${totalAlreadyRefunded.toFixed(2)}, Current refund $${totalRefundAmount.toFixed(2)}, Remaining refundable $${(maxRefundable - totalRefundsAfterThis).toFixed(2)}`,
      );

      // CRITICAL FIX 3.1: Calculate exchange amount due with proper decimal precision
      let exchangeAmountDue: number | null = null;
      if (
        createRefundDto.refundType === RefundType.ITEM_EXCHANGE &&
        createRefundDto.exchangeItems
      ) {
        // Use FinancialPrecisionService to avoid floating point errors
        const totalExchangeAmount = this.financialPrecision.sum(
          createRefundDto.exchangeItems,
          (item) => item.totalAmount,
        );

        // CRITICAL: Use precise decimal calculation for exchange amount
        const exchangeAmountDecimal =
          this.financialPrecision.calculateExchangeAmountDue(
            totalExchangeAmount,
            totalRefundAmount,
          );

        exchangeAmountDue = this.financialPrecision.toNumber(
          exchangeAmountDecimal,
        );

        // Positive value = Customer pays additional money (new item more expensive)
        // Negative value = Customer gets money back (new item less expensive)
        // Zero = Same value exchange (no money transfer)

        this.logger.log(
          `PRECISE Exchange calculation: New items $${this.financialPrecision.toFixed(totalExchangeAmount)} - Refunded items $${totalRefundAmount} = ${this.financialPrecision.isGreaterThanOrEqual(exchangeAmountDecimal, 0) ? 'Customer pays' : 'Customer receives'} $${this.financialPrecision.toFixed(this.financialPrecision.abs(exchangeAmountDecimal))}`,
        );
      }

      // Create refund record
      const refund = await tx.refund.create({
        data: {
          refundType: createRefundDto.refundType,
          originalTransactionId: transactionId,
          customerId: originalTransaction.customerId,
          totalRefundAmount,
          reason: createRefundDto.reason,
          exchangeAmountDue,
          refundItems: {
            create: createRefundDto.refundItems.map((item) => ({
              originalTransactionItemId: item.originalTransactionItemId,
              quantityToRefund: item.quantityToRefund,
              refundAmount: item.refundAmount,
              isWarrantyValid:
                eligibilityResult.items.find(
                  (eligibleItem) =>
                    eligibleItem.id === item.originalTransactionItemId,
                )?.hasWarranty || false,
            })),
          },
          exchangeItems: createRefundDto.exchangeItems
            ? {
                create: createRefundDto.exchangeItems.map((item) => ({
                  itemId: item.itemId,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  totalAmount: item.totalAmount,
                  hasWarranty: item.hasWarranty || false,
                  warrantyDurationMonths: item.warrantyDurationMonths,
                  // CRITICAL FIX 3.2: Proper warranty date calculation with validation
                  ...this.calculateExchangeItemWarrantyDates(
                    item,
                    originalTransaction.date,
                  ),
                  warrantyDescription: item.warrantyDescription,
                })),
              }
            : undefined,
        },
        include: {
          originalTransaction: true,
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

      this.logger.log(`Refund created successfully with ID: ${refund.id}`);
      return refund;
    });
  }

  /**
   * CRITICAL FIX 3.2: Calculate warranty dates for exchange items with proper validation
   *
   * Prevents undefined warranty dates and ensures proper warranty coverage calculation
   */
  private calculateExchangeItemWarrantyDates(
    exchangeItem: any,
    transactionDate: Date,
  ): { warrantyStartDate?: Date; warrantyEndDate?: Date } {
    if (!exchangeItem.hasWarranty) {
      return {
        warrantyStartDate: undefined,
        warrantyEndDate: undefined,
      };
    }

    // Use WarrantyValidationService for proper date calculation
    const warrantyValidation =
      this.warrantyValidation.validateWarrantyEligibility(
        {
          hasWarranty: exchangeItem.hasWarranty,
          warrantyStartDate: exchangeItem.warrantyStartDate,
          warrantyEndDate: exchangeItem.warrantyEndDate,
          warrantyDurationMonths: exchangeItem.warrantyDurationMonths,
          warrantyDescription: exchangeItem.warrantyDescription,
        },
        transactionDate,
      );

    if (!warrantyValidation.isValid) {
      this.logger.warn(
        `Invalid warranty configuration for exchange item: ${warrantyValidation.reason}`,
      );
      // Return undefined dates for invalid warranty configurations
      return {
        warrantyStartDate: undefined,
        warrantyEndDate: undefined,
      };
    }

    return {
      warrantyStartDate: warrantyValidation.warrantyStartDate || undefined,
      warrantyEndDate: warrantyValidation.warrantyEndDate || undefined,
    };
  }

  /**
   * CRITICAL FIX 5.2: Validate zero or negative refund amounts
   *
   * Prevents creation of refunds with zero or negative amounts which could cause
   * financial discrepancies and business logic failures.
   */
  private async validateRefundAmounts(
    createRefundDto: any,
    totalRefundAmount: number,
  ): Promise<void> {
    this.logger.debug(
      `Validating refund amounts: Total refund amount: $${totalRefundAmount}`,
    );

    // Validate total refund amount is positive
    if (totalRefundAmount <= 0) {
      this.logger.error(
        `INVALID REFUND AMOUNT: Total refund amount is $${totalRefundAmount} (must be positive)`,
      );

      throw new BadRequestException(
        `Invalid refund: Total refund amount must be positive, but got $${totalRefundAmount}. Please ensure all refund items have valid amounts.`,
      );
    }

    // Validate total refund amount is finite and reasonable
    if (!Number.isFinite(totalRefundAmount) || isNaN(totalRefundAmount)) {
      throw new BadRequestException(
        `Invalid refund: Total refund amount must be a valid number, but got $${totalRefundAmount}.`,
      );
    }

    // Validate individual refund item amounts
    for (let i = 0; i < createRefundDto.refundItems.length; i++) {
      const refundItem = createRefundDto.refundItems[i];

      // Validate individual refund amount is positive
      if (refundItem.refundAmount <= 0) {
        this.logger.error(
          `INVALID ITEM REFUND AMOUNT: Refund item ${i + 1} (transaction item ${refundItem.originalTransactionItemId}) has amount $${refundItem.refundAmount}`,
        );

        throw new BadRequestException(
          `Invalid refund: Refund item ${i + 1} has invalid amount $${refundItem.refundAmount}. All refund amounts must be positive.`,
        );
      }

      // Validate individual refund amount is finite
      if (
        !Number.isFinite(refundItem.refundAmount) ||
        isNaN(refundItem.refundAmount)
      ) {
        throw new BadRequestException(
          `Invalid refund: Refund item ${i + 1} has invalid amount $${refundItem.refundAmount}. Amount must be a valid number.`,
        );
      }

      // Validate quantity is positive
      if (refundItem.quantityToRefund <= 0) {
        this.logger.error(
          `INVALID REFUND QUANTITY: Refund item ${i + 1} (transaction item ${refundItem.originalTransactionItemId}) has quantity ${refundItem.quantityToRefund}`,
        );

        throw new BadRequestException(
          `Invalid refund: Refund item ${i + 1} has invalid quantity ${refundItem.quantityToRefund}. Quantity must be positive.`,
        );
      }

      // Validate quantity is finite and integer
      if (
        !Number.isInteger(refundItem.quantityToRefund) ||
        !Number.isFinite(refundItem.quantityToRefund)
      ) {
        throw new BadRequestException(
          `Invalid refund: Refund item ${i + 1} has invalid quantity ${refundItem.quantityToRefund}. Quantity must be a positive integer.`,
        );
      }

      // Use FinancialPrecisionService for precise amount validation
      this.financialPrecision.validateMonetaryAmount(
        refundItem.refundAmount,
        `Refund item ${i + 1} amount`,
      );
    }

    // For item exchanges, validate exchange item amounts
    if (
      createRefundDto.refundType === 'ITEM_EXCHANGE' &&
      createRefundDto.exchangeItems &&
      createRefundDto.exchangeItems.length > 0
    ) {
      for (let i = 0; i < createRefundDto.exchangeItems.length; i++) {
        const exchangeItem = createRefundDto.exchangeItems[i];

        // Validate exchange item total amount is positive
        if (exchangeItem.totalAmount <= 0) {
          this.logger.error(
            `INVALID EXCHANGE AMOUNT: Exchange item ${i + 1} (item ${exchangeItem.itemId}) has amount $${exchangeItem.totalAmount}`,
          );

          throw new BadRequestException(
            `Invalid exchange: Exchange item ${i + 1} has invalid amount $${exchangeItem.totalAmount}. All exchange amounts must be positive.`,
          );
        }

        // Validate exchange item unit price is positive
        if (exchangeItem.unitPrice <= 0) {
          throw new BadRequestException(
            `Invalid exchange: Exchange item ${i + 1} has invalid unit price $${exchangeItem.unitPrice}. Unit price must be positive.`,
          );
        }

        // Validate exchange item quantity is positive
        if (exchangeItem.quantity <= 0) {
          throw new BadRequestException(
            `Invalid exchange: Exchange item ${i + 1} has invalid quantity ${exchangeItem.quantity}. Quantity must be positive.`,
          );
        }

        // Validate quantity is integer
        if (!Number.isInteger(exchangeItem.quantity)) {
          throw new BadRequestException(
            `Invalid exchange: Exchange item ${i + 1} has invalid quantity ${exchangeItem.quantity}. Quantity must be a positive integer.`,
          );
        }

        // Validate amount calculation consistency
        const expectedAmount = this.financialPrecision.multiply(
          exchangeItem.unitPrice,
          exchangeItem.quantity,
        );
        const actualAmount = this.financialPrecision.decimal(
          exchangeItem.totalAmount,
        );

        if (!this.financialPrecision.isEqual(expectedAmount, actualAmount)) {
          this.logger.error(
            `AMOUNT CALCULATION MISMATCH: Exchange item ${i + 1} - Expected: $${this.financialPrecision.toFixed(expectedAmount)}, Actual: $${this.financialPrecision.toFixed(actualAmount)}`,
          );

          throw new BadRequestException(
            `Invalid exchange: Exchange item ${i + 1} amount calculation error. Expected $${this.financialPrecision.toFixed(expectedAmount)} (${exchangeItem.quantity} × $${exchangeItem.unitPrice}), but got $${exchangeItem.totalAmount}.`,
          );
        }

        // Use FinancialPrecisionService for precise validation
        this.financialPrecision.validateMonetaryAmount(
          exchangeItem.totalAmount,
          `Exchange item ${i + 1} total amount`,
        );
        this.financialPrecision.validateMonetaryAmount(
          exchangeItem.unitPrice,
          `Exchange item ${i + 1} unit price`,
        );
      }
    }

    this.logger.log(
      `✅ Refund amounts validation passed: Total refund $${totalRefundAmount}, ${createRefundDto.refundItems.length} refund items, ${createRefundDto.exchangeItems?.length || 0} exchange items`,
    );
  }
}
