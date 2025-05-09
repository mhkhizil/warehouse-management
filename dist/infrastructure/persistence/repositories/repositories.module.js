"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoriesModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const user_repository_1 = require("./user.repository");
const staff_repository_1 = require("./staff.repository");
const item_repository_1 = require("./item.repository");
const stock_repository_1 = require("./stock.repository");
const customer_repository_1 = require("./customer.repository");
const transaction_repository_1 = require("./transaction.repository");
const debt_repository_1 = require("./debt.repository");
const supplier_repository_1 = require("./supplier.repository");
const supplier_debt_repository_1 = require("./supplier-debt.repository");
const repository_tokens_1 = require("../../../domain/constants/repository.tokens");
const repositories = [
    { provide: repository_tokens_1.USER_REPOSITORY, useClass: user_repository_1.UserRepository },
    { provide: repository_tokens_1.STAFF_REPOSITORY, useClass: staff_repository_1.StaffRepository },
    { provide: repository_tokens_1.ITEM_REPOSITORY, useClass: item_repository_1.ItemRepository },
    { provide: repository_tokens_1.STOCK_REPOSITORY, useClass: stock_repository_1.StockRepository },
    { provide: repository_tokens_1.CUSTOMER_REPOSITORY, useClass: customer_repository_1.CustomerRepository },
    { provide: repository_tokens_1.TRANSACTION_REPOSITORY, useClass: transaction_repository_1.TransactionRepository },
    { provide: repository_tokens_1.DEBT_REPOSITORY, useClass: debt_repository_1.DebtRepository },
    { provide: repository_tokens_1.SUPPLIER_REPOSITORY, useClass: supplier_repository_1.SupplierRepository },
    { provide: repository_tokens_1.SUPPLIER_DEBT_REPOSITORY, useClass: supplier_debt_repository_1.SupplierDebtRepository },
];
let RepositoriesModule = class RepositoriesModule {
};
exports.RepositoriesModule = RepositoriesModule;
exports.RepositoriesModule = RepositoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [...repositories],
        exports: [...repositories],
    })
], RepositoriesModule);
//# sourceMappingURL=repositories.module.js.map