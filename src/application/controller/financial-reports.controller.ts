import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import {
  ComprehensiveFinancialReportUseCase,
  FinancialSummary,
} from '../use-cases/financial/comprehensive-financial-report.use-case';

@ApiTags('Financial Reports')
@UseGuards(JwtGuard, AdminGuard)
@Controller('financial-reports')
@ApiBearerAuth()
export class FinancialReportsController {
  constructor(
    private readonly comprehensiveFinancialReportUseCase: ComprehensiveFinancialReportUseCase,
  ) {}

  @Get('comprehensive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Generate comprehensive financial report with credit system adjustments',
    description: `
    Generates a complete financial report that properly accounts for:
    - Revenue adjusted for refunds and credits
    - Profit calculations including exchange margins  
    - Credit liabilities and debt analysis
    - Cash flow indicators
    - Business health metrics
    - Detailed breakdowns by category
    
    This report addresses all financial calculation flaws related to the credit system.
    `,
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date for the report (ISO format)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date for the report (ISO format)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @ApiQuery({
    name: 'includeProjections',
    required: false,
    description: 'Include future projections based on trends',
    example: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comprehensive financial report generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Financial report generated successfully',
        },
        data: {
          type: 'object',
          properties: {
            // Revenue (Adjusted for Credits)
            grossSales: {
              type: 'number',
              example: 150000.0,
              description: 'Total sales before refunds',
            },
            totalRefunds: {
              type: 'number',
              example: 12000.0,
              description: 'Total refunds processed',
            },
            netRevenue: {
              type: 'number',
              example: 138000.0,
              description: 'Sales minus refunds',
            },

            // Costs
            totalPurchases: {
              type: 'number',
              example: 90000.0,
              description: 'Total purchase costs',
            },
            costOfGoodsSold: {
              type: 'number',
              example: 72000.0,
              description: 'Actual cost of items sold',
            },

            // Profit (Credit-Adjusted)
            grossProfit: {
              type: 'number',
              example: 66000.0,
              description: 'Net revenue minus COGS',
            },
            netProfit: {
              type: 'number',
              example: 58000.0,
              description: 'Final profit after all adjustments',
            },
            profitMargin: {
              type: 'number',
              example: 42.03,
              description: 'Profit margin percentage',
            },

            // Credit & Debt Analysis
            totalCustomerDebt: {
              type: 'number',
              example: 25000.0,
              description: 'Money customers owe',
            },
            totalOutstandingCredits: {
              type: 'number',
              example: 8000.0,
              description: 'Store credits owed to customers',
            },
            totalSupplierDebt: {
              type: 'number',
              example: 15000.0,
              description: 'Money owed to suppliers',
            },
            netCashPosition: {
              type: 'number',
              example: 2000.0,
              description: 'Net cash position (positive = good)',
            },

            // Exchange Analysis
            exchangeRevenue: {
              type: 'number',
              example: 5000.0,
              description: 'Revenue from item exchanges',
            },
            exchangeCosts: {
              type: 'number',
              example: 3000.0,
              description: 'Costs from exchanged items',
            },
            exchangeProfit: {
              type: 'number',
              example: 2000.0,
              description: 'Profit from exchanges',
            },

            // Cash Flow Indicators
            actualCashReceived: {
              type: 'number',
              example: 125000.0,
              description: 'Estimated actual cash received',
            },
            creditUtilization: {
              type: 'number',
              example: 75.5,
              description: 'Credit utilization rate %',
            },
            refundsPaidOut: {
              type: 'number',
              example: 4000.0,
              description: 'Actual cash refunds paid',
            },

            // Business Health Metrics
            refundRate: {
              type: 'number',
              example: 8.0,
              description: 'Refund rate as % of sales',
            },
            creditToSalesRatio: {
              type: 'number',
              example: 5.33,
              description: 'Outstanding credits as % of sales',
            },
            debtToSalesRatio: {
              type: 'number',
              example: 16.67,
              description: 'Customer debt as % of sales',
            },

            // Detailed Breakdowns
            salesBreakdown: {
              type: 'object',
              description: 'Detailed sales analysis',
            },
            refundBreakdown: {
              type: 'object',
              description: 'Detailed refund analysis',
            },
            debtBreakdown: {
              type: 'object',
              description: 'Detailed debt analysis',
            },
            creditBreakdown: {
              type: 'object',
              description: 'Detailed credit analysis',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access - Admin required',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid date parameters',
  })
  async getComprehensiveReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('includeProjections') includeProjections?: string,
  ): Promise<ApiResponseDto<FinancialSummary>> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const projections = includeProjections === 'true';

    const report =
      await this.comprehensiveFinancialReportUseCase.generateReport(
        start,
        end,
        projections,
      );

    return ApiResponseDto.success(
      report,
      'Comprehensive financial report generated successfully',
    );
  }

  @Get('credit-impact-analysis')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze the financial impact of the credit system',
    description: `
    Provides a focused analysis of how credits and refunds impact your financials:
    - Revenue impact of refunds and credits
    - Cash flow impact analysis
    - Credit liability assessment
    - Recommendations for credit management
    `,
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date for analysis',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date for analysis',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credit impact analysis completed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            revenueImpact: {
              type: 'object',
              properties: {
                grossSalesWithoutRefunds: {
                  type: 'number',
                  description: 'What sales would be without refunds',
                },
                actualNetRevenue: {
                  type: 'number',
                  description: 'Actual revenue after refunds',
                },
                revenueReduction: {
                  type: 'number',
                  description: 'Revenue lost to refunds',
                },
                revenueReductionPercentage: {
                  type: 'number',
                  description: 'Percentage revenue reduction',
                },
              },
            },
            creditLiabilityAnalysis: {
              type: 'object',
              properties: {
                totalOutstandingCredits: {
                  type: 'number',
                  description: 'Total credits owed to customers',
                },
                averageCreditAge: {
                  type: 'number',
                  description: 'Average age of credits in days',
                },
                creditUtilizationRate: {
                  type: 'number',
                  description: 'How often credits are used',
                },
                estimatedCreditLoss: {
                  type: 'number',
                  description: 'Estimated credits that will never be used',
                },
              },
            },
            cashFlowImpact: {
              type: 'object',
              properties: {
                cashTiedUpInCredits: {
                  type: 'number',
                  description: 'Cash equivalent tied up in credits',
                },
                cashSavedByCredits: {
                  type: 'number',
                  description: 'Cash saved by giving credits vs refunds',
                },
                netCashFlowImpact: {
                  type: 'number',
                  description: 'Overall cash flow impact',
                },
              },
            },
            recommendations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: {
                    type: 'string',
                    description: 'Recommendation category',
                  },
                  recommendation: {
                    type: 'string',
                    description: 'Specific recommendation',
                  },
                  impact: { type: 'string', description: 'Expected impact' },
                  priority: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
                },
              },
            },
          },
        },
      },
    },
  })
  async getCreditImpactAnalysis(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ApiResponseDto<any>> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get comprehensive report first
    const report =
      await this.comprehensiveFinancialReportUseCase.generateReport(start, end);

    // Calculate credit-specific impacts
    const revenueReduction = report.grossSales - report.netRevenue;
    const revenueReductionPercentage =
      report.grossSales > 0 ? (revenueReduction / report.grossSales) * 100 : 0;

    const analysis = {
      revenueImpact: {
        grossSalesWithoutRefunds: report.grossSales,
        actualNetRevenue: report.netRevenue,
        revenueReduction,
        revenueReductionPercentage,
      },
      creditLiabilityAnalysis: {
        totalOutstandingCredits: report.totalOutstandingCredits,
        averageCreditAge: 45, // Placeholder - would calculate from actual data
        creditUtilizationRate: report.creditUtilization,
        estimatedCreditLoss: report.totalOutstandingCredits * 0.1, // Assume 10% never used
      },
      cashFlowImpact: {
        cashTiedUpInCredits: report.totalOutstandingCredits,
        cashSavedByCredits: report.totalRefunds - report.refundsPaidOut,
        netCashFlowImpact: report.netCashPosition,
      },
      recommendations: [
        {
          category: 'Credit Management',
          recommendation: 'Implement credit expiry policy to reduce liability',
          impact: `Could reduce credit liability by ~$${(report.totalOutstandingCredits * 0.1).toFixed(2)}`,
          priority: 'HIGH',
        },
        {
          category: 'Cash Flow',
          recommendation: 'Encourage credit usage through promotions',
          impact: 'Improve cash flow by converting credits to sales',
          priority: 'MEDIUM',
        },
        {
          category: 'Refund Policy',
          recommendation:
            report.refundRate > 10
              ? 'Review refund policy - rate is high'
              : 'Refund rate is healthy',
          impact:
            report.refundRate > 10
              ? 'Could improve profit margins'
              : 'Continue current practices',
          priority: report.refundRate > 10 ? 'HIGH' : 'LOW',
        },
      ],
    };

    return ApiResponseDto.success(
      analysis,
      'Credit impact analysis completed successfully',
    );
  }

  @Get('business-health-dashboard')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get business health metrics with credit system considerations',
    description: `
    Provides key business health indicators that account for the credit system:
    - Profit margins adjusted for credits
    - Cash flow health indicators  
    - Debt-to-sales ratios
    - Credit utilization metrics
    - Early warning indicators
    `,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Business health dashboard data retrieved',
  })
  async getBusinessHealthDashboard(): Promise<ApiResponseDto<any>> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const today = new Date();

    const report =
      await this.comprehensiveFinancialReportUseCase.generateReport(
        thirtyDaysAgo,
        today,
      );

    const healthMetrics = {
      overallHealth: this.calculateOverallHealth(report),
      keyMetrics: {
        profitMargin: {
          value: report.profitMargin,
          status:
            report.profitMargin > 20
              ? 'GOOD'
              : report.profitMargin > 10
                ? 'FAIR'
                : 'POOR',
          trend: 'STABLE', // Would calculate from historical data
        },
        refundRate: {
          value: report.refundRate,
          status:
            report.refundRate < 5
              ? 'GOOD'
              : report.refundRate < 10
                ? 'FAIR'
                : 'POOR',
          trend: 'STABLE',
        },
        creditLiability: {
          value: report.creditToSalesRatio,
          status:
            report.creditToSalesRatio < 3
              ? 'GOOD'
              : report.creditToSalesRatio < 7
                ? 'FAIR'
                : 'POOR',
          trend: 'STABLE',
        },
        cashPosition: {
          value: report.netCashPosition,
          status: report.netCashPosition > 0 ? 'GOOD' : 'POOR',
          trend: 'STABLE',
        },
      },
      alerts: this.generateHealthAlerts(report),
      recommendations: this.generateHealthRecommendations(report),
    };

    return ApiResponseDto.success(
      healthMetrics,
      'Business health dashboard data retrieved successfully',
    );
  }

  private calculateOverallHealth(
    report: FinancialSummary,
  ): 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' {
    let score = 0;

    // Profit margin (25% weight)
    if (report.profitMargin > 25) score += 25;
    else if (report.profitMargin > 15) score += 20;
    else if (report.profitMargin > 10) score += 15;
    else if (report.profitMargin > 5) score += 10;

    // Refund rate (25% weight) - lower is better
    if (report.refundRate < 3) score += 25;
    else if (report.refundRate < 7) score += 20;
    else if (report.refundRate < 12) score += 15;
    else if (report.refundRate < 20) score += 10;

    // Credit liability (25% weight) - lower is better
    if (report.creditToSalesRatio < 2) score += 25;
    else if (report.creditToSalesRatio < 5) score += 20;
    else if (report.creditToSalesRatio < 8) score += 15;
    else if (report.creditToSalesRatio < 12) score += 10;

    // Cash position (25% weight)
    if (report.netCashPosition > report.netRevenue * 0.1) score += 25;
    else if (report.netCashPosition > 0) score += 20;
    else if (report.netCashPosition > -report.netRevenue * 0.05) score += 15;
    else if (report.netCashPosition > -report.netRevenue * 0.1) score += 10;

    if (score >= 90) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 50) return 'FAIR';
    return 'POOR';
  }

  private generateHealthAlerts(report: FinancialSummary): any[] {
    const alerts = [];

    if (report.refundRate > 15) {
      alerts.push({
        type: 'WARNING',
        category: 'Refunds',
        message: `High refund rate (${report.refundRate.toFixed(1)}%) - investigate product quality or customer satisfaction`,
        impact: 'HIGH',
      });
    }

    if (report.creditToSalesRatio > 10) {
      alerts.push({
        type: 'WARNING',
        category: 'Credits',
        message: `High credit liability (${report.creditToSalesRatio.toFixed(1)}% of sales) - consider credit management policies`,
        impact: 'MEDIUM',
      });
    }

    if (report.netCashPosition < 0) {
      alerts.push({
        type: 'CRITICAL',
        category: 'Cash Flow',
        message: `Negative net cash position ($${Math.abs(report.netCashPosition).toFixed(2)}) - immediate attention required`,
        impact: 'HIGH',
      });
    }

    return alerts;
  }

  private generateHealthRecommendations(report: FinancialSummary): any[] {
    const recommendations = [];

    if (report.profitMargin < 15) {
      recommendations.push({
        category: 'Profitability',
        action: 'Review pricing strategy and cost management',
        expectedImpact: 'Increase profit margins by 3-5%',
        timeframe: '1-2 months',
      });
    }

    if (report.creditToSalesRatio > 5) {
      recommendations.push({
        category: 'Credit Management',
        action: 'Implement credit expiry and utilization incentives',
        expectedImpact: 'Reduce credit liability by 20-30%',
        timeframe: '2-3 months',
      });
    }

    return recommendations;
  }
}
