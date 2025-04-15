import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
export declare class DeleteItemUseCase {
    private readonly itemRepository;
    private readonly logger;
    constructor(itemRepository: IItemRepository);
    execute(id: number): Promise<boolean>;
}
