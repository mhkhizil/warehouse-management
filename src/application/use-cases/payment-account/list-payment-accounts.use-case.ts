import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  IPaymentAccountRepository,
  PaymentAccountFilter,
} from '../../../domain/interfaces/repositories/payment-account.repository.interface';
import { PAYMENT_ACCOUNT_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class ListPaymentAccountsUseCase {
  private readonly logger = new Logger(ListPaymentAccountsUseCase.name);

  constructor(
    @Inject(PAYMENT_ACCOUNT_REPOSITORY)
    private readonly paymentAccountRepository: IPaymentAccountRepository,
  ) {}

  async execute(
    filter?: PaymentAccountFilter,
  ): Promise<{ accounts: any[]; total: number }> {
    this.logger.log('Retrieving payment accounts list');

    try {
      const accounts = await this.paymentAccountRepository.findAll(filter);
      const total = await this.paymentAccountRepository.count(filter);

      this.logger.log(
        `Retrieved ${accounts.length} payment accounts (total: ${total})`,
      );

      return {
        accounts,
        total,
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve payment accounts: ${error.message}`,
      );
      throw error;
    }
  }

  async getActiveAccounts(): Promise<any[]> {
    this.logger.log('Retrieving active payment accounts');

    try {
      const accounts = await this.paymentAccountRepository.findActive();

      this.logger.log(`Retrieved ${accounts.length} active payment accounts`);
      return accounts;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve active payment accounts: ${error.message}`,
      );
      throw error;
    }
  }
}
