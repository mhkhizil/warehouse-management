import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import { TransactionType, RefundStatus } from '@prisma/client';

export interface FinancialSummary {
  // REVENUE CALCULATIONS (Adjusted for refunds and credits)
  grossSales: number;
  totalRefunds: number;
  netRevenue: number;

  // COST CALCULATIONS
  totalPurchases: number;
  costOfGoodsSold: number;

  // PROFIT CALCULATIONS
  grossProfit: number;
  netProfit: number;
  profitMargin: number;

  // DEBT AND CREDIT ANALYSIS
  totalCustomerDebt: number;
  totalOutstandingCredits: number;
  totalSupplierDebt: number;
  netCashPosition: number;

  // EXCHANGE ANALYSIS
  exchangeRevenue: number;
  exchangeCosts: number;
  exchangeProfit: number;

  // CASH FLOW INDICATORS
  actualCashReceived: number;
  creditUtilization: number;
  refundsPaidOut: number;

  // BUSINESS HEALTH METRICS
  refundRate: number;
  creditToSalesRatio: number;
  debtToSalesRatio: number;

  // DETAILED BREAKDOWNS
  salesBreakdown: SalesBreakdown;
  refundBreakdown: RefundBreakdown;
  debtBreakdown: DebtBreakdown;
  creditBreakdown: CreditBreakdown;
}

export interface SalesBreakdown {
  totalTransactions: number;
  averageTransactionValue: number;
  topSellingItems: ItemSalesData[];
  customerSegmentation: CustomerSegmentData[];
}

export interface RefundBreakdown {
  totalRefundTransactions: number;
  moneyRefunds: number;
  itemExchanges: number;
  averageRefundValue: number;
  refundsByReason: RefundReasonData[];
  mostRefundedItems: ItemRefundData[];
}

export interface DebtBreakdown {
  totalActiveDebts: number;
  averageDebtAmount: number;
  overdueDebts: number;
  debtAging: DebtAgingData[];
  topDebtors: CustomerDebtData[];
}

export interface CreditBreakdown {
  totalActiveCredits: number;
  averageCreditAmount: number;
  creditUtilizationRate: number;
  creditAging: CreditAgingData[];
  topCreditHolders: CustomerCreditData[];
}

// Supporting interfaces
export interface ItemSalesData {
  itemId: number;
  itemName: string;
  quantitySold: number;
  totalRevenue: number;
  averagePrice: number;
}

export interface CustomerSegmentData {
  segment: string;
  customerCount: number;
  totalSpent: number;
  averageSpent: number;
}

export interface RefundReasonData {
  reason: string;
  count: number;
  totalAmount: number;
}

export interface ItemRefundData {
  itemId: number;
  itemName: string;
  refundCount: number;
  totalRefundAmount: number;
  refundRate: number; // refunds / sales for this item
}

export interface DebtAgingData {
  ageRange: string; // "0-30 days", "31-60 days", etc.
  count: number;
  totalAmount: number;
}

export interface CreditAgingData {
  ageRange: string;
  count: number;
  totalAmount: number;
}

export interface CustomerDebtData {
  customerId: number;
  customerName: string;
  totalDebt: number;
  overdueAmount: number;
  lastPaymentDate: Date | null;
}

export interface CustomerCreditData {
  customerId: number;
  customerName: string;
  totalCredit: number;
  lastUsedDate: Date | null;
  creditAge: number; // days since credit was issued
}

@Injectable()
export class ComprehensiveFinancialReportUseCase {
  private readonly logger = new Logger(
    ComprehensiveFinancialReportUseCase.name,
  );

  constructor(private readonly prisma: PrismaService) {}

  async generateReport(
    startDate: Date,
    endDate: Date,
    includeProjections: boolean = false,
  ): Promise<FinancialSummary> {
    this.logger.log(
      `Generating comprehensive financial report from ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );

    // Execute all calculations in parallel for performance
    const [
      salesData,
      purchaseData,
      refundData,
      debtData,
      creditData,
      exchangeData,
    ] = await Promise.all([
      this.calculateSalesMetrics(startDate, endDate),
      this.calculatePurchaseMetrics(startDate, endDate),
      this.calculateRefundMetrics(startDate, endDate),
      this.calculateDebtMetrics(),
      this.calculateCreditMetrics(),
      this.calculateExchangeMetrics(startDate, endDate),
    ]);

    // CRITICAL: Adjust revenue for refunds and credits
    const netRevenue = salesData.grossSales - refundData.totalRefunds;
    const grossProfit = netRevenue - purchaseData.costOfGoodsSold;
    const netProfit = grossProfit + exchangeData.exchangeProfit;

    // Calculate business health metrics
    const refundRate =
      salesData.grossSales > 0
        ? (refundData.totalRefunds / salesData.grossSales) * 100
        : 0;
    const creditToSalesRatio =
      salesData.grossSales > 0
        ? (creditData.totalOutstandingCredits / salesData.grossSales) * 100
        : 0;
    const debtToSalesRatio =
      salesData.grossSales > 0
        ? (debtData.totalCustomerDebt / salesData.grossSales) * 100
        : 0;
    const profitMargin = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;

    // Calculate net cash position (what you actually have vs what you owe)
    const netCashPosition =
      debtData.totalCustomerDebt -
      creditData.totalOutstandingCredits -
      debtData.totalSupplierDebt;

    return {
      // Revenue (adjusted for refunds)
      grossSales: salesData.grossSales,
      totalRefunds: refundData.totalRefunds,
      netRevenue,

      // Costs
      totalPurchases: purchaseData.totalPurchases,
      costOfGoodsSold: purchaseData.costOfGoodsSold,

      // Profit
      grossProfit,
      netProfit,
      profitMargin,

      // Debt and Credit
      totalCustomerDebt: debtData.totalCustomerDebt,
      totalOutstandingCredits: creditData.totalOutstandingCredits,
      totalSupplierDebt: debtData.totalSupplierDebt,
      netCashPosition,

      // Exchange
      exchangeRevenue: exchangeData.exchangeRevenue,
      exchangeCosts: exchangeData.exchangeCosts,
      exchangeProfit: exchangeData.exchangeProfit,

      // Cash Flow (estimated)
      actualCashReceived: salesData.grossSales - debtData.totalCustomerDebt,
      creditUtilization: creditData.creditUtilizationRate,
      refundsPaidOut:
        refundData.totalRefunds - creditData.totalOutstandingCredits,

      // Health Metrics
      refundRate,
      creditToSalesRatio,
      debtToSalesRatio,

      // Detailed Breakdowns
      salesBreakdown: salesData.breakdown,
      refundBreakdown: refundData.breakdown,
      debtBreakdown: debtData.breakdown,
      creditBreakdown: creditData.breakdown,
    };
  }

  private async calculateSalesMetrics(startDate: Date, endDate: Date) {
    // Get all SELL transactions in date range
    const salesTransactions = await this.prisma.transaction.findMany({
      where: {
        type: TransactionType.SELL,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        transactionItems: {
          include: {
            item: true,
          },
        },
      },
    });

    const grossSales = salesTransactions.reduce(
      (sum, t) => sum + t.totalAmount,
      0,
    );

    // Calculate detailed breakdown
    const breakdown: SalesBreakdown = {
      totalTransactions: salesTransactions.length,
      averageTransactionValue:
        salesTransactions.length > 0
          ? grossSales / salesTransactions.length
          : 0,
      topSellingItems: await this.getTopSellingItems(startDate, endDate),
      customerSegmentation: await this.getCustomerSegmentation(
        startDate,
        endDate,
      ),
    };

    return { grossSales, breakdown };
  }

  private async calculateRefundMetrics(startDate: Date, endDate: Date) {
    // Get all processed refunds in date range
    const processedRefunds = await this.prisma.refund.findMany({
      where: {
        status: RefundStatus.PROCESSED,
        processedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        refundItems: {
          include: {
            originalTransactionItem: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    });

    const totalRefunds = processedRefunds.reduce(
      (sum, r) => sum + r.totalRefundAmount,
      0,
    );
    const moneyRefunds = processedRefunds
      .filter((r) => r.refundType === 'MONEY_REFUND')
      .reduce((sum, r) => sum + r.totalRefundAmount, 0);
    const itemExchanges = processedRefunds
      .filter((r) => r.refundType === 'ITEM_EXCHANGE')
      .reduce((sum, r) => sum + r.totalRefundAmount, 0);

    const breakdown: RefundBreakdown = {
      totalRefundTransactions: processedRefunds.length,
      moneyRefunds,
      itemExchanges,
      averageRefundValue:
        processedRefunds.length > 0
          ? totalRefunds / processedRefunds.length
          : 0,
      refundsByReason: await this.getRefundsByReason(startDate, endDate),
      mostRefundedItems: await this.getMostRefundedItems(startDate, endDate),
    };

    return { totalRefunds, breakdown };
  }

  private async calculateDebtMetrics() {
    // Get all active customer debts (positive amounts)
    const customerDebts = await this.prisma.debt.findMany({
      where: {
        amount: { gt: 0 },
        isSettled: false,
      },
      include: {
        customer: true,
      },
    });

    // Get all supplier debts
    const supplierDebts = await this.prisma.supplierDebt.findMany({
      where: {
        isSettled: false,
      },
    });

    const totalCustomerDebt = customerDebts.reduce(
      (sum, d) => sum + d.amount,
      0,
    );
    const totalSupplierDebt = supplierDebts.reduce(
      (sum, d) => sum + d.amount,
      0,
    );

    const breakdown: DebtBreakdown = {
      totalActiveDebts: customerDebts.length,
      averageDebtAmount:
        customerDebts.length > 0 ? totalCustomerDebt / customerDebts.length : 0,
      overdueDebts: customerDebts.filter((d) => new Date() > d.dueDate).length,
      debtAging: await this.getDebtAging(),
      topDebtors: await this.getTopDebtors(),
    };

    return { totalCustomerDebt, totalSupplierDebt, breakdown };
  }

  private async calculateCreditMetrics() {
    // Get all customer credits (negative debt amounts)
    const customerCredits = await this.prisma.debt.findMany({
      where: {
        amount: { lt: 0 },
        isSettled: false,
      },
      include: {
        customer: true,
      },
    });

    const totalOutstandingCredits = Math.abs(
      customerCredits.reduce((sum, d) => sum + d.amount, 0),
    );

    // Calculate credit utilization (how much credit has been used vs issued)
    const creditUtilizationRate = 75; // Placeholder - would need payment tracking to calculate accurately

    const breakdown: CreditBreakdown = {
      totalActiveCredits: customerCredits.length,
      averageCreditAmount:
        customerCredits.length > 0
          ? totalOutstandingCredits / customerCredits.length
          : 0,
      creditUtilizationRate,
      creditAging: await this.getCreditAging(),
      topCreditHolders: await this.getTopCreditHolders(),
    };

    return { totalOutstandingCredits, creditUtilizationRate, breakdown };
  }

  private async calculatePurchaseMetrics(startDate: Date, endDate: Date) {
    const purchaseTransactions = await this.prisma.transaction.findMany({
      where: {
        type: TransactionType.BUY,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalPurchases = purchaseTransactions.reduce(
      (sum, t) => sum + t.totalAmount,
      0,
    );

    // For COGS, we need to calculate based on items actually sold, not just purchased
    // This is a simplified version - in reality, you'd track inventory valuation
    const costOfGoodsSold = totalPurchases * 0.8; // Simplified - assumes 80% of purchases were sold

    return { totalPurchases, costOfGoodsSold };
  }

  private async calculateExchangeMetrics(startDate: Date, endDate: Date) {
    // Get all item exchanges
    const exchanges = await this.prisma.refund.findMany({
      where: {
        refundType: 'ITEM_EXCHANGE',
        status: RefundStatus.PROCESSED,
        processedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        exchangeItems: {
          include: {
            item: true,
          },
        },
      },
    });

    const exchangeRevenue = exchanges.reduce((sum, e) => {
      const exchangeItemsValue = e.exchangeItems.reduce(
        (itemSum, item) => itemSum + item.totalAmount,
        0,
      );
      return sum + exchangeItemsValue;
    }, 0);

    const exchangeCosts = exchanges.reduce(
      (sum, e) => sum + e.totalRefundAmount,
      0,
    );
    const exchangeProfit = exchangeRevenue - exchangeCosts;

    return { exchangeRevenue, exchangeCosts, exchangeProfit };
  }

  // Helper methods for detailed breakdowns
  private async getTopSellingItems(
    startDate: Date,
    endDate: Date,
  ): Promise<ItemSalesData[]> {
    // Implementation would aggregate transaction items by item
    return [];
  }

  private async getCustomerSegmentation(
    startDate: Date,
    endDate: Date,
  ): Promise<CustomerSegmentData[]> {
    // Implementation would segment customers by spending ranges
    return [];
  }

  private async getRefundsByReason(
    startDate: Date,
    endDate: Date,
  ): Promise<RefundReasonData[]> {
    // Implementation would group refunds by reason
    return [];
  }

  private async getMostRefundedItems(
    startDate: Date,
    endDate: Date,
  ): Promise<ItemRefundData[]> {
    // Implementation would aggregate refund items by item
    return [];
  }

  private async getDebtAging(): Promise<DebtAgingData[]> {
    // Implementation would group debts by age ranges
    return [];
  }

  private async getTopDebtors(): Promise<CustomerDebtData[]> {
    // Implementation would get customers with highest debts
    return [];
  }

  private async getCreditAging(): Promise<CreditAgingData[]> {
    // Implementation would group credits by age ranges
    return [];
  }

  private async getTopCreditHolders(): Promise<CustomerCreditData[]> {
    // Implementation would get customers with highest credits
    return [];
  }
}
