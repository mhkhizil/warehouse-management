import { Injectable, Logger } from '@nestjs/common';
import { TransactionItem } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

export interface RefundEligibility {
  isEligible: boolean;
  reason?: string;
}

export interface RefundEligibilityItem {
  id: number;
  itemId: number;
  item?: any;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  hasWarranty: boolean;
  warrantyEndDate?: Date;
  eligibility: RefundEligibility;
}

export interface RefundEligibilityResult {
  isEligible: boolean;
  overallReason?: string;
  items: RefundEligibilityItem[];
}

@Injectable()
export class ValidateRefundEligibilityUseCase {
  private readonly logger = new Logger(ValidateRefundEligibilityUseCase.name);

  constructor(private readonly prisma: PrismaService) {}

  async validateTransaction(
    transactionId: number,
  ): Promise<RefundEligibilityResult> {
    this.logger.log(
      `Validating refund eligibility for transaction ${transactionId}`,
    );

    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        transactionItems: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!transaction) {
      return {
        isEligible: false,
        overallReason: 'Transaction not found',
        items: [],
      };
    }

    const eligibilityItems = transaction.transactionItems.map((item) =>
      this.checkItemEligibility(item),
    );

    const allEligible = eligibilityItems.every(
      (item) => item.eligibility.isEligible,
    );

    return {
      isEligible: allEligible,
      overallReason: allEligible
        ? undefined
        : 'Some items are not eligible for refund',
      items: eligibilityItems,
    };
  }

  async validateSpecificItems(
    transactionId: number,
    itemIds: number[],
  ): Promise<RefundEligibilityResult> {
    this.logger.log(
      `Validating refund eligibility for specific items ${itemIds.join(', ')} in transaction ${transactionId}`,
    );

    const transactionItems = await this.prisma.transactionItem.findMany({
      where: {
        id: { in: itemIds },
        transactionId,
      },
      include: {
        item: true,
      },
    });

    if (transactionItems.length !== itemIds.length) {
      const foundIds = transactionItems.map((item) => item.id);
      const missingIds = itemIds.filter((id) => !foundIds.includes(id));

      return {
        isEligible: false,
        overallReason: `Some requested items were not found in the transaction: ${missingIds.join(', ')}`,
        items: [],
      };
    }

    const eligibilityItems = transactionItems.map((item) =>
      this.checkItemEligibility(item),
    );

    const allEligible = eligibilityItems.every(
      (item) => item.eligibility.isEligible,
    );

    return {
      isEligible: allEligible,
      overallReason: allEligible
        ? undefined
        : 'Some requested items are not eligible for refund',
      items: eligibilityItems,
    };
  }

  private checkItemEligibility(transactionItem: any): RefundEligibilityItem {
    const eligibility: RefundEligibility = {
      isEligible: true,
    };

    // BUSINESS RULE FIX: Items MUST have warranty to be refundable
    if (!transactionItem.hasWarranty) {
      eligibility.isEligible = false;
      eligibility.reason = 'Item must have warranty to be eligible for refund';
    } else {
      // Check warranty validity for items with warranty
      if (!transactionItem.warrantyEndDate) {
        eligibility.isEligible = false;
        eligibility.reason = 'Warranty end date not set';
      } else if (new Date() > new Date(transactionItem.warrantyEndDate)) {
        eligibility.isEligible = false;
        eligibility.reason = 'Warranty has expired';
      }
      // If warranty exists and is valid, item is eligible for refund
    }

    return {
      id: transactionItem.id,
      itemId: transactionItem.itemId,
      item: transactionItem.item,
      quantity: transactionItem.quantity,
      unitPrice: transactionItem.unitPrice,
      totalAmount: transactionItem.totalAmount,
      hasWarranty: transactionItem.hasWarranty,
      warrantyEndDate: transactionItem.warrantyEndDate,
      eligibility,
    };
  }
}
