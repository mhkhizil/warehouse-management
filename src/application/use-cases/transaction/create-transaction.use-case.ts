import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Transaction, TransactionType } from '@prisma/client';
import {
  TRANSACTION_REPOSITORY,
  ITEM_REPOSITORY,
  STOCK_REPOSITORY,
  CUSTOMER_REPOSITORY,
  DEBT_REPOSITORY,
} from '../../../domain/constants/repository.tokens';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
import { CreateTransactionDto } from '../../dtos/transaction/create-transaction.dto';

@Injectable()
export class CreateTransactionUseCase {
  private readonly logger = new Logger(CreateTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: IItemRepository,
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: IStockRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: IDebtRepository,
  ) {}

  async execute(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    this.logger.log(
      `Creating transaction with type: ${createTransactionDto.type}`,
    );

    // Validate item exists
    const item = await this.itemRepository.findById(
      createTransactionDto.itemId,
    );
    if (!item) {
      throw new NotFoundException(
        `Item with ID ${createTransactionDto.itemId} not found`,
      );
    }

    // Different validation based on transaction type
    if (createTransactionDto.type === TransactionType.SELL) {
      // For SELL, validate customer exists and item is sellable
      if (!createTransactionDto.customerId) {
        throw new BadRequestException(
          'Customer ID is required for SELL transactions',
        );
      }

      const customer = await this.customerRepository.findById(
        createTransactionDto.customerId,
      );
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${createTransactionDto.customerId} not found`,
        );
      }

      if (!item.isSellable) {
        throw new BadRequestException(
          `Item with ID ${createTransactionDto.itemId} is not sellable`,
        );
      }

      // Check if there's enough stock
      const stock = await this.stockRepository.findByItemId(
        createTransactionDto.itemId,
      );
      if (!stock) {
        throw new NotFoundException(
          `No stock found for item with ID ${createTransactionDto.itemId}`,
        );
      }

      if (stock.quantity < createTransactionDto.quantity) {
        throw new BadRequestException(
          `Not enough stock. Requested: ${createTransactionDto.quantity}, Available: ${stock.quantity}`,
        );
      }

      // Update stock
      await this.stockRepository.updateQuantity(
        stock.id,
        stock.quantity - createTransactionDto.quantity,
      );
    } else if (createTransactionDto.type === TransactionType.BUY) {
      // For BUY, validate stock exists
      if (!createTransactionDto.stockId) {
        throw new BadRequestException(
          'Stock ID is required for BUY transactions',
        );
      }

      const stock = await this.stockRepository.findById(
        createTransactionDto.stockId,
      );
      if (!stock) {
        throw new NotFoundException(
          `Stock with ID ${createTransactionDto.stockId} not found`,
        );
      }

      // Update stock
      await this.stockRepository.updateQuantity(
        stock.id,
        stock.quantity + createTransactionDto.quantity,
      );
    }

    // Calculate total amount if not provided
    if (!createTransactionDto.totalAmount) {
      createTransactionDto.totalAmount =
        createTransactionDto.unitPrice * createTransactionDto.quantity;
    }

    // Set transaction date if not provided
    if (!createTransactionDto.date) {
      createTransactionDto.date = new Date();
    }

    // Create transaction
    const transaction =
      await this.transactionRepository.create(createTransactionDto);

    // Create debt if needed
    if (
      createTransactionDto.type === TransactionType.SELL &&
      createTransactionDto.createDebt &&
      createTransactionDto.debt
    ) {
      // Link the debt to the transaction and customer
      createTransactionDto.debt.transactionId = transaction.id;

      if (!createTransactionDto.debt.customerId) {
        createTransactionDto.debt.customerId = createTransactionDto.customerId;
      }

      await this.debtRepository.create(createTransactionDto.debt);
    }

    return transaction;
  }
}
