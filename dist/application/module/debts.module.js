"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebtsModule = void 0;
const common_1 = require("@nestjs/common");
const repositories_module_1 = require("../../infrastructure/persistence/repositories/repositories.module");
const debts_controller_1 = require("../controller/debts.controller");
const create_debt_use_case_1 = require("../use-cases/debt/create-debt.use-case");
const delete_debt_use_case_1 = require("../use-cases/debt/delete-debt.use-case");
const get_debt_use_case_1 = require("../use-cases/debt/get-debt.use-case");
const list_debts_use_case_1 = require("../use-cases/debt/list-debts.use-case");
const update_debt_use_case_1 = require("../use-cases/debt/update-debt.use-case");
const mark_debt_settled_use_case_1 = require("../use-cases/debt/mark-debt-settled.use-case");
const mark_debt_alert_sent_use_case_1 = require("../use-cases/debt/mark-debt-alert-sent.use-case");
const find_overdue_debts_use_case_1 = require("../use-cases/debt/find-overdue-debts.use-case");
const repository_tokens_1 = require("../../domain/constants/repository.tokens");
const debt_repository_1 = require("../../infrastructure/persistence/repositories/debt.repository");
let DebtsModule = class DebtsModule {
};
exports.DebtsModule = DebtsModule;
exports.DebtsModule = DebtsModule = __decorate([
    (0, common_1.Module)({
        imports: [repositories_module_1.RepositoriesModule],
        controllers: [debts_controller_1.DebtsController],
        providers: [
            {
                provide: create_debt_use_case_1.CreateDebtUseCase,
                useFactory: (debtRepo, customerRepo, transactionRepo) => {
                    return new create_debt_use_case_1.CreateDebtUseCase(debtRepo, customerRepo, transactionRepo);
                },
                inject: [repository_tokens_1.DEBT_REPOSITORY, repository_tokens_1.CUSTOMER_REPOSITORY, repository_tokens_1.TRANSACTION_REPOSITORY],
            },
            {
                provide: delete_debt_use_case_1.DeleteDebtUseCase,
                useFactory: (debtRepo) => {
                    return new delete_debt_use_case_1.DeleteDebtUseCase(debtRepo);
                },
                inject: [repository_tokens_1.DEBT_REPOSITORY],
            },
            {
                provide: get_debt_use_case_1.GetDebtUseCase,
                useFactory: (debtRepo) => {
                    return new get_debt_use_case_1.GetDebtUseCase(debtRepo);
                },
                inject: [repository_tokens_1.DEBT_REPOSITORY],
            },
            {
                provide: list_debts_use_case_1.ListDebtsUseCase,
                useFactory: (debtRepo) => {
                    return new list_debts_use_case_1.ListDebtsUseCase(debtRepo);
                },
                inject: [repository_tokens_1.DEBT_REPOSITORY],
            },
            {
                provide: update_debt_use_case_1.UpdateDebtUseCase,
                useFactory: (debtRepo) => {
                    return new update_debt_use_case_1.UpdateDebtUseCase(debtRepo);
                },
                inject: [repository_tokens_1.DEBT_REPOSITORY],
            },
            {
                provide: mark_debt_settled_use_case_1.MarkDebtSettledUseCase,
                useFactory: (debtRepo) => {
                    return new mark_debt_settled_use_case_1.MarkDebtSettledUseCase(debtRepo);
                },
                inject: [repository_tokens_1.DEBT_REPOSITORY],
            },
            {
                provide: mark_debt_alert_sent_use_case_1.MarkDebtAlertSentUseCase,
                useFactory: (debtRepo) => {
                    return new mark_debt_alert_sent_use_case_1.MarkDebtAlertSentUseCase(debtRepo);
                },
                inject: [repository_tokens_1.DEBT_REPOSITORY],
            },
            {
                provide: find_overdue_debts_use_case_1.FindOverdueDebtsUseCase,
                useFactory: (debtRepo) => {
                    return new find_overdue_debts_use_case_1.FindOverdueDebtsUseCase(debtRepo);
                },
                inject: [repository_tokens_1.DEBT_REPOSITORY],
            },
            {
                provide: repository_tokens_1.DEBT_REPOSITORY,
                useClass: debt_repository_1.DebtRepository,
            },
        ],
        exports: [
            create_debt_use_case_1.CreateDebtUseCase,
            delete_debt_use_case_1.DeleteDebtUseCase,
            get_debt_use_case_1.GetDebtUseCase,
            list_debts_use_case_1.ListDebtsUseCase,
            update_debt_use_case_1.UpdateDebtUseCase,
            mark_debt_settled_use_case_1.MarkDebtSettledUseCase,
            mark_debt_alert_sent_use_case_1.MarkDebtAlertSentUseCase,
            find_overdue_debts_use_case_1.FindOverdueDebtsUseCase,
        ],
    })
], DebtsModule);
//# sourceMappingURL=debts.module.js.map