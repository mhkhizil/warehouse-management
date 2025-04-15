import { Stock } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export type StockFilter = {
  refillAlert?: boolean;
  itemId?: number;
  minQuantity?: number;
  maxQuantity?: number;
  skip?: number;
  take?: number;
};

export interface IStockRepository extends IBaseRepository<Stock, number> {
  findByItemId(itemId: number): Promise<Stock | null>;
  findWithFilters(
    filter: StockFilter,
  ): Promise<{ stocks: Stock[]; total: number }>;
  updateQuantity(id: number, quantity: number): Promise<Stock>;
  findLowStock(threshold?: number): Promise<Stock[]>;
}
