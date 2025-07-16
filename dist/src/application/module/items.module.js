"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsModule = void 0;
const common_1 = require("@nestjs/common");
const items_controller_1 = require("../controller/items.controller");
const create_item_use_case_1 = require("../use-cases/item/create-item.use-case");
const delete_item_use_case_1 = require("../use-cases/item/delete-item.use-case");
const get_item_use_case_1 = require("../use-cases/item/get-item.use-case");
const list_items_use_case_1 = require("../use-cases/item/list-items.use-case");
const update_item_use_case_1 = require("../use-cases/item/update-item.use-case");
const repositories_module_1 = require("../../infrastructure/persistence/repositories/repositories.module");
const repository_tokens_1 = require("../../domain/constants/repository.tokens");
const item_repository_1 = require("../../infrastructure/persistence/repositories/item.repository");
const stock_repository_1 = require("../../infrastructure/persistence/repositories/stock.repository");
let ItemsModule = class ItemsModule {
};
exports.ItemsModule = ItemsModule;
exports.ItemsModule = ItemsModule = __decorate([
    (0, common_1.Module)({
        imports: [repositories_module_1.RepositoriesModule],
        controllers: [items_controller_1.ItemsController],
        providers: [
            {
                provide: create_item_use_case_1.CreateItemUseCase,
                useFactory: (itemRepo, stockRepo) => {
                    return new create_item_use_case_1.CreateItemUseCase(itemRepo, stockRepo);
                },
                inject: [repository_tokens_1.ITEM_REPOSITORY, repository_tokens_1.STOCK_REPOSITORY],
            },
            {
                provide: delete_item_use_case_1.DeleteItemUseCase,
                useFactory: (itemRepo) => {
                    return new delete_item_use_case_1.DeleteItemUseCase(itemRepo);
                },
                inject: [repository_tokens_1.ITEM_REPOSITORY],
            },
            {
                provide: get_item_use_case_1.GetItemUseCase,
                useFactory: (itemRepo) => {
                    return new get_item_use_case_1.GetItemUseCase(itemRepo);
                },
                inject: [repository_tokens_1.ITEM_REPOSITORY],
            },
            {
                provide: list_items_use_case_1.ListItemsUseCase,
                useFactory: (itemRepo) => {
                    return new list_items_use_case_1.ListItemsUseCase(itemRepo);
                },
                inject: [repository_tokens_1.ITEM_REPOSITORY],
            },
            {
                provide: update_item_use_case_1.UpdateItemUseCase,
                useFactory: (itemRepo, stockRepo) => {
                    return new update_item_use_case_1.UpdateItemUseCase(itemRepo, stockRepo);
                },
                inject: [repository_tokens_1.ITEM_REPOSITORY, repository_tokens_1.STOCK_REPOSITORY],
            },
            {
                provide: repository_tokens_1.ITEM_REPOSITORY,
                useClass: item_repository_1.ItemRepository,
            },
            {
                provide: repository_tokens_1.STOCK_REPOSITORY,
                useClass: stock_repository_1.StockRepository,
            },
        ],
        exports: [
            create_item_use_case_1.CreateItemUseCase,
            delete_item_use_case_1.DeleteItemUseCase,
            get_item_use_case_1.GetItemUseCase,
            list_items_use_case_1.ListItemsUseCase,
            update_item_use_case_1.UpdateItemUseCase,
        ],
    })
], ItemsModule);
//# sourceMappingURL=items.module.js.map