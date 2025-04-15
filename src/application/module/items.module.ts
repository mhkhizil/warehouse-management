import { Module } from '@nestjs/common';
import { ItemsController } from '../controller/items.controller';
import { CreateItemUseCase } from '../use-cases/item/create-item.use-case';
import { DeleteItemUseCase } from '../use-cases/item/delete-item.use-case';
import { GetItemUseCase } from '../use-cases/item/get-item.use-case';
import { ListItemsUseCase } from '../use-cases/item/list-items.use-case';
import { UpdateItemUseCase } from '../use-cases/item/update-item.use-case';
import { RepositoriesModule } from '../../infrastructure/persistence/repositories/repositories.module';
import {
  ITEM_REPOSITORY,
  STOCK_REPOSITORY,
} from '../../domain/constants/repository.tokens';
import { ItemRepository } from '../../infrastructure/persistence/repositories/item.repository';
import { StockRepository } from '../../infrastructure/persistence/repositories/stock.repository';

@Module({
  imports: [RepositoriesModule],
  controllers: [ItemsController],
  providers: [
    {
      provide: CreateItemUseCase,
      useFactory: (itemRepo, stockRepo) => {
        return new CreateItemUseCase(itemRepo, stockRepo);
      },
      inject: [ITEM_REPOSITORY, STOCK_REPOSITORY],
    },
    {
      provide: DeleteItemUseCase,
      useFactory: (itemRepo) => {
        return new DeleteItemUseCase(itemRepo);
      },
      inject: [ITEM_REPOSITORY],
    },
    {
      provide: GetItemUseCase,
      useFactory: (itemRepo) => {
        return new GetItemUseCase(itemRepo);
      },
      inject: [ITEM_REPOSITORY],
    },
    {
      provide: ListItemsUseCase,
      useFactory: (itemRepo) => {
        return new ListItemsUseCase(itemRepo);
      },
      inject: [ITEM_REPOSITORY],
    },
    {
      provide: UpdateItemUseCase,
      useFactory: (itemRepo, stockRepo) => {
        return new UpdateItemUseCase(itemRepo, stockRepo);
      },
      inject: [ITEM_REPOSITORY, STOCK_REPOSITORY],
    },
    {
      provide: ITEM_REPOSITORY,
      useClass: ItemRepository,
    },
    {
      provide: STOCK_REPOSITORY,
      useClass: StockRepository,
    },
  ],
  exports: [
    CreateItemUseCase,
    DeleteItemUseCase,
    GetItemUseCase,
    ListItemsUseCase,
    UpdateItemUseCase,
  ],
})
export class ItemsModule {}
