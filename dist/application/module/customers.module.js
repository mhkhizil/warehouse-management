"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersModule = void 0;
const common_1 = require("@nestjs/common");
const customers_controller_1 = require("../controller/customers.controller");
const create_customer_use_case_1 = require("../use-cases/customer/create-customer.use-case");
const delete_customer_use_case_1 = require("../use-cases/customer/delete-customer.use-case");
const get_customer_use_case_1 = require("../use-cases/customer/get-customer.use-case");
const list_customers_use_case_1 = require("../use-cases/customer/list-customers.use-case");
const update_customer_use_case_1 = require("../use-cases/customer/update-customer.use-case");
const repositories_module_1 = require("../../infrastructure/persistence/repositories/repositories.module");
const repository_tokens_1 = require("../../domain/constants/repository.tokens");
const customer_repository_1 = require("../../infrastructure/persistence/repositories/customer.repository");
let CustomersModule = class CustomersModule {
};
exports.CustomersModule = CustomersModule;
exports.CustomersModule = CustomersModule = __decorate([
    (0, common_1.Module)({
        imports: [repositories_module_1.RepositoriesModule],
        controllers: [customers_controller_1.CustomersController],
        providers: [
            {
                provide: create_customer_use_case_1.CreateCustomerUseCase,
                useFactory: (customerRepo) => {
                    return new create_customer_use_case_1.CreateCustomerUseCase(customerRepo);
                },
                inject: [repository_tokens_1.CUSTOMER_REPOSITORY],
            },
            {
                provide: delete_customer_use_case_1.DeleteCustomerUseCase,
                useFactory: (customerRepo) => {
                    return new delete_customer_use_case_1.DeleteCustomerUseCase(customerRepo);
                },
                inject: [repository_tokens_1.CUSTOMER_REPOSITORY],
            },
            {
                provide: get_customer_use_case_1.GetCustomerUseCase,
                useFactory: (customerRepo) => {
                    return new get_customer_use_case_1.GetCustomerUseCase(customerRepo);
                },
                inject: [repository_tokens_1.CUSTOMER_REPOSITORY],
            },
            {
                provide: list_customers_use_case_1.ListCustomersUseCase,
                useFactory: (customerRepo) => {
                    return new list_customers_use_case_1.ListCustomersUseCase(customerRepo);
                },
                inject: [repository_tokens_1.CUSTOMER_REPOSITORY],
            },
            {
                provide: update_customer_use_case_1.UpdateCustomerUseCase,
                useFactory: (customerRepo) => {
                    return new update_customer_use_case_1.UpdateCustomerUseCase(customerRepo);
                },
                inject: [repository_tokens_1.CUSTOMER_REPOSITORY],
            },
            {
                provide: repository_tokens_1.CUSTOMER_REPOSITORY,
                useClass: customer_repository_1.CustomerRepository,
            },
        ],
        exports: [
            create_customer_use_case_1.CreateCustomerUseCase,
            delete_customer_use_case_1.DeleteCustomerUseCase,
            get_customer_use_case_1.GetCustomerUseCase,
            list_customers_use_case_1.ListCustomersUseCase,
            update_customer_use_case_1.UpdateCustomerUseCase,
        ],
    })
], CustomersModule);
//# sourceMappingURL=customers.module.js.map