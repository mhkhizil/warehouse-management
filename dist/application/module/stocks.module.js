"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StocksModule = void 0;
const common_1 = require("@nestjs/common");
const stocks_controller_1 = require("../controller/stocks.controller");
const create_stock_use_case_1 = require("../use-cases/stock/create-stock.use-case");
const delete_stock_use_case_1 = require("../use-cases/stock/delete-stock.use-case");
const get_stock_use_case_1 = require("../use-cases/stock/get-stock.use-case");
const list_stocks_use_case_1 = require("../use-cases/stock/list-stocks.use-case");
const update_stock_use_case_1 = require("../use-cases/stock/update-stock.use-case");
const repositories_module_1 = require("../../infrastructure/persistence/repositories/repositories.module");
const repository_tokens_1 = require("../../domain/constants/repository.tokens");
const stock_repository_1 = require("../../infrastructure/persistence/repositories/stock.repository");
const item_repository_1 = require("../../infrastructure/persistence/repositories/item.repository");
let StocksModule = class StocksModule {
};
exports.StocksModule = StocksModule;
exports.StocksModule = StocksModule = __decorate([
    (0, common_1.Module)({
        imports: [repositories_module_1.RepositoriesModule],
        controllers: [stocks_controller_1.StocksController],
        providers: [
            {
                provide: create_stock_use_case_1.CreateStockUseCase,
                useFactory: (stockRepo, itemRepo) => {
                    return new create_stock_use_case_1.CreateStockUseCase(stockRepo, itemRepo);
                },
                inject: [repository_tokens_1.STOCK_REPOSITORY, repository_tokens_1.ITEM_REPOSITORY],
            },
            {
                provide: delete_stock_use_case_1.DeleteStockUseCase,
                useFactory: (stockRepo) => {
                    return new delete_stock_use_case_1.DeleteStockUseCase(stockRepo);
                },
                inject: [repository_tokens_1.STOCK_REPOSITORY],
            },
            {
                provide: get_stock_use_case_1.GetStockUseCase,
                useFactory: (stockRepo, itemRepo) => {
                    return new get_stock_use_case_1.GetStockUseCase(stockRepo, itemRepo);
                },
                inject: [repository_tokens_1.STOCK_REPOSITORY, repository_tokens_1.ITEM_REPOSITORY],
            },
            {
                provide: list_stocks_use_case_1.ListStocksUseCase,
                useFactory: (stockRepo) => {
                    return new list_stocks_use_case_1.ListStocksUseCase(stockRepo);
                },
                inject: [repository_tokens_1.STOCK_REPOSITORY],
            },
            {
                provide: update_stock_use_case_1.UpdateStockUseCase,
                useFactory: (stockRepo) => {
                    return new update_stock_use_case_1.UpdateStockUseCase(stockRepo);
                },
                inject: [repository_tokens_1.STOCK_REPOSITORY],
            },
            {
                provide: repository_tokens_1.STOCK_REPOSITORY,
                useClass: stock_repository_1.StockRepository,
            },
            {
                provide: repository_tokens_1.ITEM_REPOSITORY,
                useClass: item_repository_1.ItemRepository,
            },
        ],
        exports: [
            create_stock_use_case_1.CreateStockUseCase,
            delete_stock_use_case_1.DeleteStockUseCase,
            get_stock_use_case_1.GetStockUseCase,
            list_stocks_use_case_1.ListStocksUseCase,
            update_stock_use_case_1.UpdateStockUseCase,
        ],
    })
], StocksModule);
//# sourceMappingURL=stocks.module.js.map