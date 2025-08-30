import { Injectable, Logger } from '@nestjs/common';

export interface WarrantyValidationResult {
  isValid: boolean;
  isEligible: boolean;
  warrantyStartDate: Date | null;
  warrantyEndDate: Date | null;
  daysRemaining: number;
  reason?: string;
}

export interface WarrantyItem {
  hasWarranty: boolean;
  warrantyStartDate?: Date | string | null;
  warrantyEndDate?: Date | string | null;
  warrantyDurationMonths?: number | null;
  warrantyDescription?: string | null;
}

/**
 * WarrantyValidationService
 *
 * Handles all warranty-related calculations and validations
 * Fixes MISCALCULATION 3.2: Warranty End Date Calculation
 *
 * CRITICAL BUSINESS RULES:
 * 1. Items MUST have warranty to be refundable
 * 2. Warranty dates must be properly calculated and validated
 * 3. Multiple refunds allowed until warranty expires
 */
@Injectable()
export class WarrantyValidationService {
  private readonly logger = new Logger(WarrantyValidationService.name);

  /**
   * CRITICAL FIX 3.2: Proper warranty validation with comprehensive date handling
   *
   * Validates warranty eligibility for refund with proper date calculations
   * and comprehensive error handling.
   */
  validateWarrantyEligibility(
    item: WarrantyItem,
    transactionDate: Date,
    checkDate: Date = new Date(),
  ): WarrantyValidationResult {
    this.logger.debug(
      `Validating warranty for item: ${JSON.stringify({
        hasWarranty: item.hasWarranty,
        warrantyStartDate: item.warrantyStartDate,
        warrantyEndDate: item.warrantyEndDate,
        warrantyDurationMonths: item.warrantyDurationMonths,
      })}`,
    );

    // BUSINESS RULE: Items MUST have warranty to be refundable
    if (!item.hasWarranty) {
      return {
        isValid: false,
        isEligible: false,
        warrantyStartDate: null,
        warrantyEndDate: null,
        daysRemaining: 0,
        reason: 'Item does not have warranty coverage',
      };
    }

    // Calculate warranty dates with proper validation
    const warrantyDates = this.calculateWarrantyDates(item, transactionDate);

    if (!warrantyDates.isValid) {
      return {
        isValid: false,
        isEligible: false,
        warrantyStartDate: warrantyDates.startDate,
        warrantyEndDate: warrantyDates.endDate,
        daysRemaining: 0,
        reason: warrantyDates.reason,
      };
    }

    // Check if warranty is still active
    const eligibilityCheck = this.checkWarrantyEligibility(
      warrantyDates.startDate!,
      warrantyDates.endDate!,
      checkDate,
    );

    return {
      isValid: true,
      isEligible: eligibilityCheck.isEligible,
      warrantyStartDate: warrantyDates.startDate,
      warrantyEndDate: warrantyDates.endDate,
      daysRemaining: eligibilityCheck.daysRemaining,
      reason: eligibilityCheck.reason,
    };
  }

  /**
   * CRITICAL: Calculate warranty dates with comprehensive validation
   *
   * Handles multiple scenarios:
   * 1. Explicit start and end dates provided
   * 2. Start date + duration in months
   * 3. Only duration (start = transaction date)
   * 4. Invalid or missing data
   */
  private calculateWarrantyDates(
    item: WarrantyItem,
    transactionDate: Date,
  ): {
    isValid: boolean;
    startDate: Date | null;
    endDate: Date | null;
    reason?: string;
  } {
    let warrantyStartDate: Date | null = null;
    let warrantyEndDate: Date | null = null;

    // SCENARIO 1: Explicit warranty start date provided
    if (item.warrantyStartDate) {
      try {
        warrantyStartDate = this.parseDate(item.warrantyStartDate);
        if (!warrantyStartDate) {
          return {
            isValid: false,
            startDate: null,
            endDate: null,
            reason: 'Invalid warranty start date format',
          };
        }
      } catch (error) {
        return {
          isValid: false,
          startDate: null,
          endDate: null,
          reason: `Invalid warranty start date: ${error.message}`,
        };
      }
    } else {
      // Default: warranty starts on transaction date
      warrantyStartDate = new Date(transactionDate);
    }

    // SCENARIO 2: Explicit warranty end date provided
    if (item.warrantyEndDate) {
      try {
        warrantyEndDate = this.parseDate(item.warrantyEndDate);
        if (!warrantyEndDate) {
          return {
            isValid: false,
            startDate: warrantyStartDate,
            endDate: null,
            reason: 'Invalid warranty end date format',
          };
        }
      } catch (error) {
        return {
          isValid: false,
          startDate: warrantyStartDate,
          endDate: null,
          reason: `Invalid warranty end date: ${error.message}`,
        };
      }
    }
    // SCENARIO 3: Calculate end date from duration
    else if (item.warrantyDurationMonths && item.warrantyDurationMonths > 0) {
      warrantyEndDate = this.addMonthsToDate(
        warrantyStartDate,
        item.warrantyDurationMonths,
      );
    }
    // SCENARIO 4: No end date or duration provided
    else {
      return {
        isValid: false,
        startDate: warrantyStartDate,
        endDate: null,
        reason: 'Warranty end date or duration must be specified',
      };
    }

    // Validate date logic
    if (warrantyStartDate && warrantyEndDate) {
      if (warrantyEndDate <= warrantyStartDate) {
        return {
          isValid: false,
          startDate: warrantyStartDate,
          endDate: warrantyEndDate,
          reason: 'Warranty end date must be after start date',
        };
      }
    }

    return {
      isValid: true,
      startDate: warrantyStartDate,
      endDate: warrantyEndDate,
    };
  }

  /**
   * Check if warranty is currently eligible for refund
   */
  private checkWarrantyEligibility(
    warrantyStartDate: Date,
    warrantyEndDate: Date,
    checkDate: Date,
  ): {
    isEligible: boolean;
    daysRemaining: number;
    reason?: string;
  } {
    const now = checkDate.getTime();
    const startTime = warrantyStartDate.getTime();
    const endTime = warrantyEndDate.getTime();

    // Check if warranty period has started
    if (now < startTime) {
      const daysUntilStart = Math.ceil(
        (startTime - now) / (1000 * 60 * 60 * 24),
      );
      return {
        isEligible: false,
        daysRemaining: 0,
        reason: `Warranty period has not started yet (starts in ${daysUntilStart} days)`,
      };
    }

    // Check if warranty period has expired
    if (now > endTime) {
      const daysExpired = Math.floor((now - endTime) / (1000 * 60 * 60 * 24));
      return {
        isEligible: false,
        daysRemaining: 0,
        reason: `Warranty has expired ${daysExpired} days ago`,
      };
    }

    // Warranty is active
    const daysRemaining = Math.ceil((endTime - now) / (1000 * 60 * 60 * 24));
    return {
      isEligible: true,
      daysRemaining: Math.max(0, daysRemaining),
    };
  }

  /**
   * Parse date from various formats with comprehensive error handling
   */
  private parseDate(dateValue: Date | string | null | undefined): Date | null {
    if (!dateValue) {
      return null;
    }

    if (dateValue instanceof Date) {
      // Validate that it's a valid date
      if (isNaN(dateValue.getTime())) {
        throw new Error('Invalid Date object');
      }
      return dateValue;
    }

    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      if (isNaN(parsed.getTime())) {
        throw new Error(`Cannot parse date string: "${dateValue}"`);
      }
      return parsed;
    }

    throw new Error(`Unsupported date type: ${typeof dateValue}`);
  }

  /**
   * Add months to a date with proper handling of month boundaries
   *
   * Example: Jan 31 + 1 month = Feb 28 (or 29 in leap year)
   * This prevents invalid dates like Feb 31
   */
  private addMonthsToDate(date: Date, months: number): Date {
    const result = new Date(date);
    const originalDay = result.getDate();

    // Add the months
    result.setMonth(result.getMonth() + months);

    // Handle month boundary issues (e.g., Jan 31 + 1 month should be Feb 28/29, not Mar 2/3)
    if (result.getDate() !== originalDay) {
      // The day changed because we overflowed into the next month
      // Set to the last day of the intended month
      result.setDate(0); // This sets to the last day of the previous month
    }

    return result;
  }

  /**
   * Get warranty summary for display/logging
   */
  getWarrantySummary(item: WarrantyItem, transactionDate: Date): string {
    if (!item.hasWarranty) {
      return 'No warranty coverage';
    }

    const validation = this.validateWarrantyEligibility(item, transactionDate);

    if (!validation.isValid) {
      return `Invalid warranty: ${validation.reason}`;
    }

    const startStr =
      validation.warrantyStartDate?.toLocaleDateString() || 'Unknown';
    const endStr =
      validation.warrantyEndDate?.toLocaleDateString() || 'Unknown';
    const status = validation.isEligible
      ? `${validation.daysRemaining} days remaining`
      : 'Expired';

    return `Warranty: ${startStr} - ${endStr} (${status})`;
  }

  /**
   * Check if warranty covers a specific date
   */
  isDateCoveredByWarranty(
    item: WarrantyItem,
    transactionDate: Date,
    checkDate: Date,
  ): boolean {
    const validation = this.validateWarrantyEligibility(
      item,
      transactionDate,
      checkDate,
    );
    return validation.isValid && validation.isEligible;
  }

  /**
   * Get remaining warranty days
   */
  getRemainingWarrantyDays(
    item: WarrantyItem,
    transactionDate: Date,
    checkDate: Date = new Date(),
  ): number {
    const validation = this.validateWarrantyEligibility(
      item,
      transactionDate,
      checkDate,
    );
    return validation.daysRemaining;
  }

  /**
   * Bulk validate warranty for multiple items
   */
  validateMultipleWarranties(
    items: WarrantyItem[],
    transactionDate: Date,
    checkDate: Date = new Date(),
  ): WarrantyValidationResult[] {
    return items.map((item) =>
      this.validateWarrantyEligibility(item, transactionDate, checkDate),
    );
  }
}

