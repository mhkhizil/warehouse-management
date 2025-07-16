import { Stock } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IStockRepository, StockFilter } from '../../../domain/interfaces/repositories/stock.repository.interface';
export declare class StockRepository implements IStockRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<Stock>): Promise<Stock>;
    findById(id: number): Promise<Stock | null>;
    findAll(): Promise<Stock[]>;
    update(id: number, data: Partial<Stock>): Promise<Stock>;
    delete(id: number): Promise<boolean>;
    findByItemId(itemId: number): Promise<Stock | null>;
    updateQuantity(id: number, quantity: number): Promise<Stock>;
    findLowStock(threshold?: number): Promise<Stock[]>;
    findWithFilters(filter: StockFilter): Promise<{
        stocks: Stock[];
        total: number;
    }>;
}
