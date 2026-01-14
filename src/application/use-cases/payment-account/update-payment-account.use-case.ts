import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { IPaymentAccountRepository } from '../../../domain/interfaces/repositories/payment-account.repository.interface';
import { PAYMENT_ACCOUNT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { UpdatePaymentAccountDto } from '../../dtos/payment-account/update-payment-account.dto';

@Injectable()
export class UpdatePaymentAccountUseCase {
  private readonly logger = new Logger(UpdatePaymentAccountUseCase.name);

  constructor(
    @Inject(PAYMENT_ACCOUNT_REPOSITORY)
    private readonly paymentAccountRepository: IPaymentAccountRepository,
  ) {}

  async execute(
    id: number,
    updatePaymentAccountDto: UpdatePaymentAccountDto,
  ): Promise<any> {
    this.logger.log(`Updating payment account with ID: ${id}`);

    try {
      // Check if payment account exists
      const existingAccount = await this.paymentAccountRepository.findById(id);
      if (!existingAccount) {
        throw new NotFoundException(`Payment account with ID ${id} not found`);
      }

      // Validate update data
      await this.validateUpdateData(id, updatePaymentAccountDto);

      // Update the payment account
      const updatedAccount = await this.paymentAccountRepository.update(
        id,
        updatePaymentAccountDto,
      );

      this.logger.log(
        `Payment account updated successfully: ${updatedAccount.accountName}`,
      );
      return updatedAccount;
    } catch (error) {
      this.logger.error(`Failed to update payment account: ${error.message}`);
      throw error;
    }
  }

  private async validateUpdateData(
    id: number,
    data: UpdatePaymentAccountDto,
  ): Promise<void> {
    // Check for duplicate account names (if updating name)
    if (data.accountName) {
      const existingAccounts = await this.paymentAccountRepository.findAll({
        search: data.accountName,
      });

      const duplicateName = existingAccounts.find(
        (account) =>
          account.id !== id &&
          account.accountName.toLowerCase() === data.accountName.toLowerCase(),
      );

      if (duplicateName) {
        throw new BadRequestException(
          `Payment account with name "${data.accountName}" already exists`,
        );
      }
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
