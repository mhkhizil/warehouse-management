import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { IPaymentAccountRepository } from '../../../domain/interfaces/repositories/payment-account.repository.interface';
import { PAYMENT_ACCOUNT_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class GetPaymentAccountUseCase {
  private readonly logger = new Logger(GetPaymentAccountUseCase.name);

  constructor(
    @Inject(PAYMENT_ACCOUNT_REPOSITORY)
    private readonly paymentAccountRepository: IPaymentAccountRepository,
  ) {}

  async execute(id: number): Promise<any> {
    this.logger.log(`Retrieving payment account with ID: ${id}`);

    const paymentAccount = await this.paymentAccountRepository.findById(id);

    if (!paymentAccount) {
      throw new NotFoundException(`Payment account with ID ${id} not found`);
    }

    this.logger.log(
      `Payment account retrieved successfully: ${paymentAccount.accountName}`,
    );
    return paymentAccount;
  }
}
