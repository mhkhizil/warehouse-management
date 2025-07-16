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
exports.CreateTransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_debt_dto_1 = require("../debt/create-debt.dto");
const create_supplier_debt_dto_1 = require("../supplier-debt/create-supplier-debt.dto");
const create_transaction_item_dto_1 = require("./create-transaction-item.dto");
class CreateTransactionDto {
    constructor() {
        this.createDebt = false;
        this.createSupplierDebt = false;
    }
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction type',
        enum: client_1.TransactionType,
        example: client_1.TransactionType.SELL,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(client_1.TransactionType),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer ID (required for SELL transactions)',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.type === client_1.TransactionType.SELL),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Supplier ID (required for BUY transactions)',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.type === client_1.TransactionType.BUY),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of transaction items',
        type: [create_transaction_item_dto_1.CreateTransactionItemDto],
        example: [
            {
                itemId: 1,
                quantity: 5,
                unitPrice: 199.99,
            },
            {
                itemId: 2,
                quantity: 2,
                unitPrice: 49.99,
            },
        ],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_transaction_item_dto_1.CreateTransactionItemDto),
    __metadata("design:type", Array)
], CreateTransactionDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total amount (sum of all items) - auto-calculated if not provided',
        example: 1099.93,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Transaction date',
        example: '2023-01-01T00:00:00Z',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateTransactionDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Create debt for this transaction',
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTransactionDto.prototype, "createDebt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Debt information (if createDebt is true)',
        type: create_debt_dto_1.CreateDebtDto,
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.createDebt === true),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_debt_dto_1.CreateDebtDto),
    __metadata("design:type", create_debt_dto_1.CreateDebtDto)
], CreateTransactionDto.prototype, "debt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Create supplier debt for this transaction',
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTransactionDto.prototype, "createSupplierDebt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Supplier debt information (if createSupplierDebt is true)',
        type: create_supplier_debt_dto_1.CreateSupplierDebtDto,
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.createSupplierDebt === true),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_supplier_debt_dto_1.CreateSupplierDebtDto),
    __metadata("design:type", create_supplier_debt_dto_1.CreateSupplierDebtDto)
], CreateTransactionDto.prototype, "supplierDebt", void 0);
//# sourceMappingURL=create-transaction.dto.js.map