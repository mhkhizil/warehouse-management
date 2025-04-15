"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const repositories_module_1 = require("../../infrastructure/persistence/repositories/repositories.module");
const transactions_controller_1 = require("../controller/transactions.controller");
const create_transaction_use_case_1 = require("../use-cases/transaction/create-transaction.use-case");
const delete_transaction_use_case_1 = require("../use-cases/transaction/delete-transaction.use-case");
const get_transaction_use_case_1 = require("../use-cases/transaction/get-transaction.use-case");
const list_transactions_use_case_1 = require("../use-cases/transaction/list-transactions.use-case");
const update_transaction_use_case_1 = require("../use-cases/transaction/update-transaction.use-case");
const get_transaction_report_use_case_1 = require("../use-cases/transaction/get-transaction-report.use-case");
const repository_tokens_1 = require("../../domain/constants/repository.tokens");
const transaction_repository_1 = require("../../infrastructure/persistence/repositories/transaction.repository");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [repositories_module_1.RepositoriesModule],
        controllers: [transactions_controller_1.TransactionsController],
        providers: [
            {
                provide: create_transaction_use_case_1.CreateTransactionUseCase,
                useFactory: (transactionRepo, itemRepo, stockRepo, customerRepo, debtRepo) => {
                    return new create_transaction_use_case_1.CreateTransactionUseCase(transactionRepo, itemRepo, stockRepo, customerRepo, debtRepo);
                },
                inject: [
                    repository_tokens_1.TRANSACTION_REPOSITORY,
                    repository_tokens_1.ITEM_REPOSITORY,
                    repository_tokens_1.STOCK_REPOSITORY,
                    repository_tokens_1.CUSTOMER_REPOSITORY,
                    repository_tokens_1.DEBT_REPOSITORY,
                ],
            },
            {
                provide: delete_transaction_use_case_1.DeleteTransactionUseCase,
                useFactory: (transactionRepo) => {
                    return new delete_transaction_use_case_1.DeleteTransactionUseCase(transactionRepo);
                },
                inject: [repository_tokens_1.TRANSACTION_REPOSITORY],
            },
            {
                provide: get_transaction_use_case_1.GetTransactionUseCase,
                useFactory: (transactionRepo) => {
                    return new get_transaction_use_case_1.GetTransactionUseCase(transactionRepo);
                },
                inject: [repository_tokens_1.TRANSACTION_REPOSITORY],
            },
            {
                provide: list_transactions_use_case_1.ListTransactionsUseCase,
                useFactory: (transactionRepo) => {
                    return new list_transactions_use_case_1.ListTransactionsUseCase(transactionRepo);
                },
                inject: [repository_tokens_1.TRANSACTION_REPOSITORY],
            },
            {
                provide: update_transaction_use_case_1.UpdateTransactionUseCase,
                useFactory: (transactionRepo) => {
                    return new update_transaction_use_case_1.UpdateTransactionUseCase(transactionRepo);
                },
                inject: [repository_tokens_1.TRANSACTION_REPOSITORY],
            },
            {
                provide: get_transaction_report_use_case_1.GetTransactionReportUseCase,
                useFactory: (transactionRepo) => {
                    return new get_transaction_report_use_case_1.GetTransactionReportUseCase(transactionRepo);
                },
                inject: [repository_tokens_1.TRANSACTION_REPOSITORY],
            },
            {
                provide: repository_tokens_1.TRANSACTION_REPOSITORY,
                useClass: transaction_repository_1.TransactionRepository,
            },
        ],
        exports: [
            create_transaction_use_case_1.CreateTransactionUseCase,
            delete_transaction_use_case_1.DeleteTransactionUseCase,
            get_transaction_use_case_1.GetTransactionUseCase,
            list_transactions_use_case_1.ListTransactionsUseCase,
            update_transaction_use_case_1.UpdateTransactionUseCase,
            get_transaction_report_use_case_1.GetTransactionReportUseCase,
        ],
    })
], TransactionsModule);
//# sourceMappingURL=transactions.module.js.map