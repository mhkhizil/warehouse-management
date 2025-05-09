import { Transaction } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
export interface BuyFromSupplierDto {
    supplierId: number;
    itemId: number;
    quantity: number;
    unitPrice: number;
    createDebt?: boolean;
    debtDueDate?: string;
    debtRemarks?: string;
}
export declare class BuyFromSupplierUseCase {
    private supplierRepository;
    private itemRepository;
    private stockRepository;
    private transactionRepository;
    private supplierDebtRepository;
    private prisma;
    constructor(supplierRepository: ISupplierRepository, itemRepository: IItemRepository, stockRepository: IStockRepository, transactionRepository: ITransactionRepository, supplierDebtRepository: ISupplierDebtRepository, prisma: PrismaService);
    execute(data: BuyFromSupplierDto): Promise<Transaction>;
}
