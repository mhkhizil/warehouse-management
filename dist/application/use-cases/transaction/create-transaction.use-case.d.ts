import { Transaction } from '@prisma/client';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
import { CreateTransactionDto } from '../../dtos/transaction/create-transaction.dto';
export declare class CreateTransactionUseCase {
    private readonly transactionRepository;
    private readonly itemRepository;
    private readonly stockRepository;
    private readonly customerRepository;
    private readonly debtRepository;
    private readonly logger;
    constructor(transactionRepository: ITransactionRepository, itemRepository: IItemRepository, stockRepository: IStockRepository, customerRepository: ICustomerRepository, debtRepository: IDebtRepository);
    execute(createTransactionDto: CreateTransactionDto): Promise<Transaction>;
}
