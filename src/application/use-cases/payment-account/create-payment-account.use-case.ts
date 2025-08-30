import {
  Injectable,
  Logger,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { IPaymentAccountRepository } from '../../../domain/interfaces/repositories/payment-account.repository.interface';
import { PAYMENT_ACCOUNT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { CreatePaymentAccountDto } from '../../dtos/payment-account/create-payment-account.dto';

@Injectable()
export class CreatePaymentAccountUseCase {
  private readonly logger = new Logger(CreatePaymentAccountUseCase.name);

  constructor(
    @Inject(PAYMENT_ACCOUNT_REPOSITORY)
    private readonly paymentAccountRepository: IPaymentAccountRepository,
  ) {}

  async execute(
    createPaymentAccountDto: CreatePaymentAccountDto,
  ): Promise<any> {
    this.logger.log(
      `Creating payment account: ${createPaymentAccountDto.accountName}`,
    );

    try {
      // Validate account data
      await this.validatePaymentAccountData(createPaymentAccountDto);

      // Create the payment account
      const paymentAccount = await this.paymentAccountRepository.create(
        createPaymentAccountDto,
      );

      this.logger.log(
        `Payment account created successfully with ID: ${paymentAccount.id}`,
      );
      return paymentAccount;
    } catch (error) {
      this.logger.error(`Failed to create payment account: ${error.message}`);
      throw error;
    }
  }

  private async validatePaymentAccountData(
    data: CreatePaymentAccountDto,
  ): Promise<void> {
    // Check for duplicate account names
    const existingAccounts = await this.paymentAccountRepository.findAll({
      search: data.accountName,
    });

    const duplicateName = existingAccounts.find(
      (account) =>
        account.accountName.toLowerCase() === data.accountName.toLowerCase(),
    );

    if (duplicateName) {
      throw new BadRequestException(
        `Payment account with name "${data.accountName}" already exists`,
      );
    }

    // Validate balance if provided
    if (data.balance !== undefined && data.balance < 0) {
      throw new BadRequestException('Account balance cannot be negative');
    }

    // Validate account number format if provided
    if (data.accountNumber && data.accountNumber.length < 4) {
      throw new BadRequestException(
        'Account number must be at least 4 characters long',
      );
    }
  }
}
