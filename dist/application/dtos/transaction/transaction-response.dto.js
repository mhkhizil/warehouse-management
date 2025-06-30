"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const customer_response_dto_1 = require("../customer/customer-response.dto");
const debt_response_dto_1 = require("../debt/debt-response.dto");
const supplier_response_dto_1 = require("../supplier/supplier-response.dto");
const supplier_debt_response_dto_1 = require("../supplier-debt/supplier-debt-response.dto");
const transaction_item_response_dto_1 = require("./transaction-item-response.dto");
class TransactionResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.customer) {
            this.customer = new customer_response_dto_1.CustomerResponseDto(partial.customer);
        }
        if (partial.supplier) {
            this.supplier = new supplier_response_dto_1.SupplierResponseDto(partial.supplier);
        }
        if (partial.debt) {
            this.debt = partial.debt.map((debt) => new debt_response_dto_1.DebtResponseDto(debt));
        }
        if (partial.supplierDebt) {
            this.supplierDebt = partial.supplierDebt.map((supplierDebt) => new supplier_debt_response_dto_1.SupplierDebtResponseDto(supplierDebt));
        }
        if (partial.transactionItems) {
            this.transactionItems = partial.transactionItems.map((item) => new transaction_item_response_dto_1.TransactionItemResponseDto(item));
        }
    }
}
exports.TransactionResponseDto = TransactionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID', example: 1 }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction type',
        enum: client_1.TransactionType,
        example: client_1.TransactionType.SELL,
    }),
    __metadata("design:type", String)
], TransactionResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 1, required: false }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer information',
        type: customer_response_dto_1.CustomerResponseDto,
        required: false,
    }),
    (0, class_transformer_1.Type)(() => customer_response_dto_1.CustomerResponseDto),
    __metadata("design:type", customer_response_dto_1.CustomerResponseDto)
], TransactionResponseDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supplier ID', example: 1, required: false }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Supplier information',
        type: supplier_response_dto_1.SupplierResponseDto,
        required: false,
    }),
    (0, class_transformer_1.Type)(() => supplier_response_dto_1.SupplierResponseDto),
    __metadata("design:type", supplier_response_dto_1.SupplierResponseDto)
], TransactionResponseDto.prototype, "supplier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction items',
        type: [transaction_item_response_dto_1.TransactionItemResponseDto],
    }),
    (0, class_transformer_1.Type)(() => transaction_item_response_dto_1.TransactionItemResponseDto),
    __metadata("design:type", Array)
], TransactionResponseDto.prototype, "transactionItems", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount', example: 999.95 }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction date',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], TransactionResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Associated debt records',
        type: [debt_response_dto_1.DebtResponseDto],
        required: false,
    }),
    (0, class_transformer_1.Type)(() => debt_response_dto_1.DebtResponseDto),
    __metadata("design:type", Array)
], TransactionResponseDto.prototype, "debt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Associated supplier debt records',
        type: [supplier_debt_response_dto_1.SupplierDebtResponseDto],
        required: false,
    }),
    (0, class_transformer_1.Type)(() => supplier_debt_response_dto_1.SupplierDebtResponseDto),
    __metadata("design:type", Array)
], TransactionResponseDto.prototype, "supplierDebt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], TransactionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2023-01-02T00:00:00Z',
    }),
    __metadata("design:type", Date)
], TransactionResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=transaction-response.dto.js.map