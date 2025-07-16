"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersModule = void 0;
const common_1 = require("@nestjs/common");
const suppliers_controller_1 = require("../controller/suppliers.controller");
const supplier_debts_controller_1 = require("../controller/supplier-debts.controller");
const create_supplier_use_case_1 = require("../use-cases/supplier/create-supplier.use-case");
const get_supplier_use_case_1 = require("../use-cases/supplier/get-supplier.use-case");
const update_supplier_use_case_1 = require("../use-cases/supplier/update-supplier.use-case");
const list_suppliers_use_case_1 = require("../use-cases/supplier/list-suppliers.use-case");
const delete_supplier_use_case_1 = require("../use-cases/supplier/delete-supplier.use-case");
const create_supplier_debt_use_case_1 = require("../use-cases/supplier-debt/create-supplier-debt.use-case");
const get_supplier_debt_use_case_1 = require("../use-cases/supplier-debt/get-supplier-debt.use-case");
const update_supplier_debt_use_case_1 = require("../use-cases/supplier-debt/update-supplier-debt.use-case");
const list_supplier_debts_use_case_1 = require("../use-cases/supplier-debt/list-supplier-debts.use-case");
const delete_supplier_debt_use_case_1 = require("../use-cases/supplier-debt/delete-supplier-debt.use-case");
const mark_supplier_debt_settled_use_case_1 = require("../use-cases/supplier-debt/mark-supplier-debt-settled.use-case");
const mark_supplier_debt_alert_sent_use_case_1 = require("../use-cases/supplier-debt/mark-supplier-debt-alert-sent.use-case");
const find_overdue_supplier_debts_use_case_1 = require("../use-cases/supplier-debt/find-overdue-supplier-debts.use-case");
const repositories_module_1 = require("../../infrastructure/persistence/repositories/repositories.module");
let SuppliersModule = class SuppliersModule {
};
exports.SuppliersModule = SuppliersModule;
exports.SuppliersModule = SuppliersModule = __decorate([
    (0, common_1.Module)({
        imports: [repositories_module_1.RepositoriesModule],
        controllers: [suppliers_controller_1.SuppliersController, supplier_debts_controller_1.SupplierDebtsController],
        providers: [
            create_supplier_use_case_1.CreateSupplierUseCase,
            get_supplier_use_case_1.GetSupplierUseCase,
            update_supplier_use_case_1.UpdateSupplierUseCase,
            list_suppliers_use_case_1.ListSuppliersUseCase,
            delete_supplier_use_case_1.DeleteSupplierUseCase,
            create_supplier_debt_use_case_1.CreateSupplierDebtUseCase,
            get_supplier_debt_use_case_1.GetSupplierDebtUseCase,
            update_supplier_debt_use_case_1.UpdateSupplierDebtUseCase,
            list_supplier_debts_use_case_1.ListSupplierDebtsUseCase,
            delete_supplier_debt_use_case_1.DeleteSupplierDebtUseCase,
            mark_supplier_debt_settled_use_case_1.MarkSupplierDebtSettledUseCase,
            mark_supplier_debt_alert_sent_use_case_1.MarkSupplierDebtAlertSentUseCase,
            find_overdue_supplier_debts_use_case_1.FindOverdueSupplierDebtsUseCase,
        ],
        exports: [],
    })
], SuppliersModule);
//# sourceMappingURL=suppliers.module.js.map