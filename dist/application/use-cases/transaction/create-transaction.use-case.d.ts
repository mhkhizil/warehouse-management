import { Transaction } from '@prisma/client';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { ITransactionItemRepository } from '../../../domain/interfaces/repositories/transaction-item.repository.interface';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { CreateTransactionDto } from '../../dtos/transaction/create-transaction.dto';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
export declare class CreateTransactionUseCase {
    private readonly transactionRepository;
    private readonly transactionItemRepository;
    private readonly itemRepository;
    private readonly stockRepository;
    private readonly customerRepository;
    private readonly debtRepository;
    private readonly supplierRepository;
    private readonly supplierDebtRepository;
    private readonly prisma;
    private readonly logger;
    constructor(transactionRepository: ITransactionRepository, transactionItemRepository: ITransactionItemRepository, itemRepository: IItemRepository, stockRepository: IStockRepository, customerRepository: ICustomerRepository, debtRepository: IDebtRepository, supplierRepository: ISupplierRepository, supplierDebtRepository: ISupplierDebtRepository, prisma: PrismaService);
    execute(createTransactionDto: CreateTransactionDto): Promise<Transaction>;
}
