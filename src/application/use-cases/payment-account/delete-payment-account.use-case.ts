import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { IPaymentAccountRepository } from '../../../domain/interfaces/repositories/payment-account.repository.interface';
import { PAYMENT_ACCOUNT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class DeletePaymentAccountUseCase {
  private readonly logger = new Logger(DeletePaymentAccountUseCase.name);

  constructor(
    @Inject(PAYMENT_ACCOUNT_REPOSITORY)
    private readonly paymentAccountRepository: IPaymentAccountRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: number): Promise<void> {
    this.logger.log(`Deleting payment account with ID: ${id}`);

    try {
      // Check if payment account exists
      const existingAccount = await this.paymentAccountRepository.findById(id);
      if (!existingAccount) {
        throw new NotFoundException(`Payment account with ID ${id} not found`);
      }

      // Check if account has associated transactions
      const transactionCount = await this.prisma.transaction.count({
        where: { paymentAccountId: id },
      });

      if (transactionCount > 0) {
        throw new BadRequestException(
          `Cannot delete payment account "${existingAccount.accountName}": ${transactionCount} transactions are associated with this account. Consider deactivating the account instead.`,
        );
      }

      // Delete the payment account
      await this.paymentAccountRepository.delete(id);

      this.logger.log(
        `Payment account "${existingAccount.accountName}" deleted successfully`,
      );
    } catch (error) {
      this.logger.error(`Failed to delete payment account: ${error.message}`);
      throw error;
    }
  }

  async deactivate(id: number): Promise<any> {
    this.logger.log(`Deactivating payment account with ID: ${id}`);

    try {
      // Check if payment account exists
      const existingAccount = await this.paymentAccountRepository.findById(id);
      if (!existingAccount) {
        throw new NotFoundException(`Payment account with ID ${id} not found`);
      }

      if (!existingAccount.isActive) {
        throw new BadRequestException(
          `Payment account "${existingAccount.accountName}" is already inactive`,
        );
      }

      // Deactivate the account
      const deactivatedAccount = await this.paymentAccountRepository.update(
        id,
        { isActive: false },
      );

      this.logger.log(
        `Payment account "${existingAccount.accountName}" deactivated successfully`,
      );
      return deactivatedAccount;
    } catch (error) {
      this.logger.error(
        `Failed to deactivate payment account: ${error.message}`,
      );
      throw error;
    }
  }

  async activate(id: number): Promise<any> {
    this.logger.log(`Activating payment account with ID: ${id}`);

    try {
      // Check if payment account exists
      const existingAccount = await this.paymentAccountRepository.findById(id);
      if (!existingAccount) {
        throw new NotFoundException(`Payment account with ID ${id} not found`);
      }

      if (existingAccount.isActive) {
        throw new BadRequestException(
          `Payment account "${existingAccount.accountName}" is already active`,
        );
      }

      // Activate the account
      const activatedAccount = await this.paymentAccountRepository.update(id, {
        isActive: true,
      });

      this.logger.log(
        `Payment account "${existingAccount.accountName}" activated successfully`,
      );
      return activatedAccount;
    } catch (error) {
      this.logger.error(`Failed to activate payment account: ${error.message}`);
      throw error;
    }
  }
}
