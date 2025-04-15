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
const item_response_dto_1 = require("../item/item-response.dto");
const stock_response_dto_1 = require("../stock/stock-response.dto");
class TransactionResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.item) {
            this.item = new item_response_dto_1.ItemResponseDto(partial.item);
        }
        if (partial.stock) {
            this.stock = new stock_response_dto_1.StockResponseDto(partial.stock);
        }
        if (partial.customer) {
            this.customer = new customer_response_dto_1.CustomerResponseDto(partial.customer);
        }
        if (partial.debt && Array.isArray(partial.debt)) {
            this.debt = partial.debt.map((debt) => new debt_response_dto_1.DebtResponseDto(debt));
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
    (0, swagger_1.ApiProperty)({ description: 'Item ID', example: 1 }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Item information',
        type: item_response_dto_1.ItemResponseDto,
    }),
    (0, class_transformer_1.Type)(() => item_response_dto_1.ItemResponseDto),
    __metadata("design:type", item_response_dto_1.ItemResponseDto)
], TransactionResponseDto.prototype, "item", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stock ID', example: 1, required: false }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "stockId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock information',
        type: stock_response_dto_1.StockResponseDto,
        required: false,
    }),
    (0, class_transformer_1.Type)(() => stock_response_dto_1.StockResponseDto),
    __metadata("design:type", stock_response_dto_1.StockResponseDto)
], TransactionResponseDto.prototype, "stock", void 0);
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
    (0, swagger_1.ApiProperty)({ description: 'Quantity', example: 5 }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit price', example: 199.99 }),
    __metadata("design:type", Number)
], TransactionResponseDto.prototype, "unitPrice", void 0);
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