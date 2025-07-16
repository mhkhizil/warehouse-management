import { Item } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IItemRepository, ItemFilter } from '../../../domain/interfaces/repositories/item.repository.interface';
export declare class ItemRepository implements IItemRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<Item>): Promise<Item>;
    findById(id: number): Promise<Item | null>;
    findAll(): Promise<Item[]>;
    update(id: number, data: Partial<Item>): Promise<Item>;
    delete(id: number): Promise<boolean>;
    findByName(name: string): Promise<Item | null>;
    findSubItems(parentItemId: number): Promise<Item[]>;
    findWithFilters(filter: ItemFilter): Promise<{
        items: Item[];
        total: number;
    }>;
}
