import { Item } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';
export type ItemFilter = {
    name?: string;
    brand?: string;
    type?: string;
    isSellable?: boolean;
    skip?: number;
    take?: number;
};
export interface IItemRepository extends IBaseRepository<Item, number> {
    findByName(name: string): Promise<Item | null>;
    findWithFilters(filter: ItemFilter): Promise<{
        items: Item[];
        total: number;
    }>;
    findSubItems(parentItemId: number): Promise<Item[]>;
}
