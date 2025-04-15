import { Module } from '@nestjs/common';
import { StocksController } from '../controller/stocks.controller';
import { CreateStockUseCase } from '../use-cases/stock/create-stock.use-case';
import { DeleteStockUseCase } from '../use-cases/stock/delete-stock.use-case';
import { GetStockUseCase } from '../use-cases/stock/get-stock.use-case';
import { ListStocksUseCase } from '../use-cases/stock/list-stocks.use-case';
import { UpdateStockUseCase } from '../use-cases/stock/update-stock.use-case';
import { RepositoriesModule } from '../../infrastructure/persistence/repositories/repositories.module';
import {
  STOCK_REPOSITORY,
  ITEM_REPOSITORY,
} from '../../domain/constants/repository.tokens';
import { StockRepository } from '../../infrastructure/persistence/repositories/stock.repository';
import { ItemRepository } from '../../infrastructure/persistence/repositories/item.repository';

@Module({
  imports: [RepositoriesModule],
  controllers: [StocksController],
  providers: [
    {
      provide: CreateStockUseCase,
      useFactory: (stockRepo, itemRepo) => {
        return new CreateStockUseCase(stockRepo, itemRepo);
      },
      inject: [STOCK_REPOSITORY, ITEM_REPOSITORY],
    },
    {
      provide: DeleteStockUseCase,
      useFactory: (stockRepo) => {
        return new DeleteStockUseCase(stockRepo);
      },
      inject: [STOCK_REPOSITORY],
    },
    {
      provide: GetStockUseCase,
      useFactory: (stockRepo, itemRepo) => {
        return new GetStockUseCase(stockRepo, itemRepo);
      },
      inject: [STOCK_REPOSITORY, ITEM_REPOSITORY],
    },
    {
      provide: ListStocksUseCase,
      useFactory: (stockRepo) => {
        return new ListStocksUseCase(stockRepo);
      },
      inject: [STOCK_REPOSITORY],
    },
    {
      provide: UpdateStockUseCase,
      useFactory: (stockRepo) => {
        return new UpdateStockUseCase(stockRepo);
      },
      inject: [STOCK_REPOSITORY],
    },
    {
      provide: STOCK_REPOSITORY,
      useClass: StockRepository,
    },
    {
      provide: ITEM_REPOSITORY,
      useClass: ItemRepository,
    },
  ],
  exports: [
    CreateStockUseCase,
    DeleteStockUseCase,
    GetStockUseCase,
    ListStocksUseCase,
    UpdateStockUseCase,
  ],
})
export class StocksModule {}
