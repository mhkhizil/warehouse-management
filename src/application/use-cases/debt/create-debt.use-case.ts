import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Debt } from '@prisma/client';
import {
  CUSTOMER_REPOSITORY,
  DEBT_REPOSITORY,
  TRANSACTION_REPOSITORY,
} from '../../../domain/constants/repository.tokens';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { CreateDebtDto } from '../../dtos/debt/create-debt.dto';

@Injectable()
export class CreateDebtUseCase {
  private readonly logger = new Logger(CreateDebtUseCase.name);

  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: IDebtRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(createDebtDto: CreateDebtDto): Promise<Debt> {
    this.logger.log(
      `Creating debt for customer ID: ${createDebtDto.customerId}`,
    );

    // Validate customer exists
    const customer = await this.customerRepository.findById(
      createDebtDto.customerId,
    );
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${createDebtDto.customerId} not found`,
      );
    }

    // Validate transaction exists if provided
    if (createDebtDto.transactionId) {
      const transaction = await this.transactionRepository.findById(
        createDebtDto.transactionId,
      );
      if (!transaction) {
        throw new NotFoundException(
          `Transaction with ID ${createDebtDto.transactionId} not found`,
        );
      }
    }

    // Set default values if not provided
    if (!createDebtDto.isSettled) {
      createDebtDto.isSettled = false;
    }

    if (!createDebtDto.alertSent) {
      createDebtDto.alertSent = false;
    }

    // Create debt
    const debt = await this.debtRepository.create(createDebtDto);
    this.logger.log(`Debt created with ID: ${debt.id}`);

    return debt;
  }
}
