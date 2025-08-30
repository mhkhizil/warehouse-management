import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';

/**
 * FinancialPrecisionService
 *
 * Handles all financial calculations with proper decimal precision
 * to avoid JavaScript floating point arithmetic issues.
 *
 * CRITICAL: All monetary calculations MUST use this service
 * to ensure accurate financial reporting and prevent discrepancies.
 */
@Injectable()
export class FinancialPrecisionService {
  /**
   * Configure Decimal.js for financial calculations
   * - 2 decimal places for currency
   * - ROUND_HALF_UP for standard financial rounding
   */
  constructor() {
    // Set global precision for financial calculations
    Decimal.set({
      precision: 20, // High precision for intermediate calculations
      rounding: Decimal.ROUND_HALF_UP, // Standard financial rounding
      toExpNeg: -7, // Use exponential notation for very small numbers
      toExpPos: 21, // Use exponential notation for very large numbers
    });
  }

  /**
   * Add two or more monetary amounts with precision
   */
  add(...amounts: (number | string | Decimal)[]): Decimal {
    return amounts.reduce<Decimal>(
      (sum: Decimal, amount: number | string | Decimal) => {
        return sum.plus(new Decimal(amount || 0));
      },
      new Decimal(0),
    );
  }

  /**
   * Subtract monetary amounts with precision
   */
  subtract(
    minuend: number | string | Decimal,
    subtrahend: number | string | Decimal,
  ): Decimal {
    return new Decimal(minuend || 0).minus(new Decimal(subtrahend || 0));
  }

  /**
   * Multiply monetary amounts with precision
   */
  multiply(
    multiplicand: number | string | Decimal,
    multiplier: number | string | Decimal,
  ): Decimal {
    return new Decimal(multiplicand || 0).times(new Decimal(multiplier || 0));
  }

  /**
   * Divide monetary amounts with precision
   */
  divide(
    dividend: number | string | Decimal,
    divisor: number | string | Decimal,
  ): Decimal {
    const divisorDecimal = new Decimal(divisor || 1);
    if (divisorDecimal.isZero()) {
      throw new Error(
        'Division by zero is not allowed in financial calculations',
      );
    }
    return new Decimal(dividend || 0).dividedBy(divisorDecimal);
  }

  /**
   * Calculate sum of array items with precision
   */
  sum<T>(
    items: T[],
    valueExtractor: (item: T) => number | string | Decimal,
  ): Decimal {
    return items.reduce((total: Decimal, item) => {
      const value = valueExtractor(item);
      return total.plus(new Decimal(value || 0));
    }, new Decimal(0));
  }

  /**
   * Round to currency precision (2 decimal places)
   */
  toCurrency(amount: number | string | Decimal): Decimal {
    return new Decimal(amount || 0).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  }

  /**
   * Convert to number (use only for final display, never for calculations)
   */
  toNumber(amount: Decimal): number {
    return amount.toNumber();
  }

  /**
   * Convert to string with currency formatting
   */
  toFixed(amount: Decimal, decimalPlaces: number = 2): string {
    return amount.toFixed(decimalPlaces);
  }

  /**
   * Compare two monetary amounts
   */
  isEqual(
    amount1: number | string | Decimal,
    amount2: number | string | Decimal,
  ): boolean {
    return new Decimal(amount1 || 0).equals(new Decimal(amount2 || 0));
  }

  /**
   * Check if amount1 is greater than amount2
   */
  isGreaterThan(
    amount1: number | string | Decimal,
    amount2: number | string | Decimal,
  ): boolean {
    return new Decimal(amount1 || 0).greaterThan(new Decimal(amount2 || 0));
  }

  /**
   * Check if amount1 is greater than or equal to amount2
   */
  isGreaterThanOrEqual(
    amount1: number | string | Decimal,
    amount2: number | string | Decimal,
  ): boolean {
    return new Decimal(amount1 || 0).greaterThanOrEqualTo(
      new Decimal(amount2 || 0),
    );
  }

  /**
   * Check if amount1 is less than amount2
   */
  isLessThan(
    amount1: number | string | Decimal,
    amount2: number | string | Decimal,
  ): boolean {
    return new Decimal(amount1 || 0).lessThan(new Decimal(amount2 || 0));
  }

  /**
   * Check if amount is zero
   */
  isZero(amount: number | string | Decimal): boolean {
    return new Decimal(amount || 0).isZero();
  }

  /**
   * Check if amount is positive
   */
  isPositive(amount: number | string | Decimal): boolean {
    return new Decimal(amount || 0).isPositive();
  }

  /**
   * Check if amount is negative
   */
  isNegative(amount: number | string | Decimal): boolean {
    return new Decimal(amount || 0).isNegative();
  }

  /**
   * Get absolute value
   */
  abs(amount: number | string | Decimal): Decimal {
    return new Decimal(amount || 0).abs();
  }

  /**
   * Calculate percentage of an amount
   */
  percentage(
    amount: number | string | Decimal,
    percent: number | string | Decimal,
  ): Decimal {
    return this.multiply(amount, this.divide(percent, 100));
  }

  /**
   * Calculate what percentage amount1 is of amount2
   */
  percentageOf(
    amount1: number | string | Decimal,
    amount2: number | string | Decimal,
  ): Decimal {
    if (this.isZero(amount2)) {
      return new Decimal(0);
    }
    return this.multiply(this.divide(amount1, amount2), 100);
  }

  /**
   * CRITICAL: Calculate exchange amount due with proper precision
   * Fixes MISCALCULATION 3.1: Floating Point Precision Errors
   */
  calculateExchangeAmountDue(
    exchangeItemsTotal: number | string | Decimal,
    refundItemsTotal: number | string | Decimal,
  ): Decimal {
    const exchangeTotal = new Decimal(exchangeItemsTotal || 0);
    const refundTotal = new Decimal(refundItemsTotal || 0);

    // Positive = Customer pays more (new items more expensive)
    // Negative = Customer gets money back (new items less expensive)
    // Zero = Equal exchange (no money transfer)
    return this.toCurrency(exchangeTotal.minus(refundTotal));
  }

  /**
   * CRITICAL: Validate and calculate transaction totals with precision
   */
  calculateTransactionTotal<T>(
    items: T[],
    quantityExtractor: (item: T) => number,
    unitPriceExtractor: (item: T) => number | string | Decimal,
  ): { itemTotals: Decimal[]; grandTotal: Decimal } {
    const itemTotals = items.map((item) => {
      const quantity = new Decimal(quantityExtractor(item) || 0);
      const unitPrice = new Decimal(unitPriceExtractor(item) || 0);
      return this.toCurrency(quantity.times(unitPrice));
    });

    const grandTotal = this.toCurrency(
      itemTotals.reduce(
        (sum, itemTotal) => sum.plus(itemTotal),
        new Decimal(0),
      ),
    );

    return { itemTotals, grandTotal };
  }

  /**
   * CRITICAL: Safe monetary comparison for business logic
   */
  compareAmounts(
    amount1: number | string | Decimal,
    amount2: number | string | Decimal,
    tolerance: number = 0.01, // 1 cent tolerance for rounding differences
  ): 'greater' | 'less' | 'equal' {
    const diff = this.subtract(amount1, amount2);
    const absDiff = this.abs(diff);

    if (this.isLessThan(absDiff, tolerance)) {
      return 'equal';
    }

    return this.isPositive(diff) ? 'greater' : 'less';
  }

  /**
   * Create a new Decimal instance (for advanced operations)
   */
  decimal(value: number | string | Decimal): Decimal {
    return new Decimal(value || 0);
  }

  /**
   * Validate that an amount is a valid monetary value
   */
  validateMonetaryAmount(amount: any, fieldName: string = 'amount'): void {
    try {
      const decimal = new Decimal(amount || 0);
      if (!decimal.isFinite()) {
        throw new Error(`${fieldName} must be a finite number`);
      }
      if (decimal.isNaN()) {
        throw new Error(`${fieldName} must be a valid number`);
      }
    } catch (error) {
      throw new Error(`Invalid ${fieldName}: ${error.message}`);
    }
  }

  /**
   * Safe conversion from any value to Decimal with validation
   */
  safeDecimal(
    value: any,
    defaultValue: number | string | Decimal = 0,
  ): Decimal {
    try {
      const decimal = new Decimal(value || defaultValue);
      if (!decimal.isFinite() || decimal.isNaN()) {
        return new Decimal(defaultValue);
      }
      return decimal;
    } catch {
      return new Decimal(defaultValue);
    }
  }
}
