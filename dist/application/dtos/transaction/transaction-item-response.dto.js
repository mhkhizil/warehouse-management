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
exports.TransactionItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const item_response_dto_1 = require("../item/item-response.dto");
const stock_response_dto_1 = require("../stock/stock-response.dto");
class TransactionItemResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.item) {
            this.item = new item_response_dto_1.ItemResponseDto(partial.item);
        }
        if (partial.stock) {
            this.stock = new stock_response_dto_1.StockResponseDto(partial.stock);
        }
    }
}
exports.TransactionItemResponseDto = TransactionItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction Item ID', example: 1 }),
    __metadata("design:type", Number)
], TransactionItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID', example: 1 }),
    __metadata("design:type", Number)
], TransactionItemResponseDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item ID', example: 1 }),
    __metadata("design:type", Number)
], TransactionItemResponseDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Item information',
        type: item_response_dto_1.ItemResponseDto,
    }),
    (0, class_transformer_1.Type)(() => item_response_dto_1.ItemResponseDto),
    __metadata("design:type", item_response_dto_1.ItemResponseDto)
], TransactionItemResponseDto.prototype, "item", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stock ID', example: 1, required: false }),
    __metadata("design:type", Number)
], TransactionItemResponseDto.prototype, "stockId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock information',
        type: stock_response_dto_1.StockResponseDto,
        required: false,
    }),
    (0, class_transformer_1.Type)(() => stock_response_dto_1.StockResponseDto),
    __metadata("design:type", stock_response_dto_1.StockResponseDto)
], TransactionItemResponseDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity', example: 5 }),
    __metadata("design:type", Number)
], TransactionItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit price', example: 199.99 }),
    __metadata("design:type", Number)
], TransactionItemResponseDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total amount', example: 999.95 }),
    __metadata("design:type", Number)
], TransactionItemResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], TransactionItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2023-01-02T00:00:00Z',
    }),
    __metadata("design:type", Date)
], TransactionItemResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=transaction-item-response.dto.js.map