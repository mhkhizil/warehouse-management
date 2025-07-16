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
exports.ItemResponseDto = exports.StockInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class StockInfoDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.StockInfoDto = StockInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stock ID', example: 1 }),
    __metadata("design:type", Number)
], StockInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item ID', example: 1 }),
    __metadata("design:type", Number)
], StockInfoDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current quantity', example: 25 }),
    __metadata("design:type", Number)
], StockInfoDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last refill date',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], StockInfoDto.prototype, "lastRefilled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Refill alert status', example: true }),
    __metadata("design:type", Boolean)
], StockInfoDto.prototype, "refillAlert", void 0);
class ItemResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.stock) {
            this.stock = partial.stock.map((s) => new StockInfoDto(s));
        }
        if (partial.subItems) {
            this.subItems = partial.subItems.map((i) => new ItemResponseDto(i));
        }
    }
}
exports.ItemResponseDto = ItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item ID', example: 1 }),
    __metadata("design:type", Number)
], ItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item name', example: 'Car Bumper Model X123' }),
    __metadata("design:type", String)
], ItemResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item brand', example: 'Toyota' }),
    __metadata("design:type", String)
], ItemResponseDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item type', example: 'Exterior' }),
    __metadata("design:type", String)
], ItemResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item price', example: 199.99 }),
    __metadata("design:type", Number)
], ItemResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the item can be sold', example: true }),
    __metadata("design:type", Boolean)
], ItemResponseDto.prototype, "isSellable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional remarks',
        example: 'Compatible with 2020-2023 models',
    }),
    __metadata("design:type", String)
], ItemResponseDto.prototype, "remarks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Parent item ID if applicable', example: null }),
    __metadata("design:type", Number)
], ItemResponseDto.prototype, "parentItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], ItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2023-01-02T00:00:00Z',
    }),
    __metadata("design:type", Date)
], ItemResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock information',
        type: [StockInfoDto],
        required: false,
    }),
    (0, class_transformer_1.Type)(() => StockInfoDto),
    __metadata("design:type", Array)
], ItemResponseDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sub-items',
        type: [ItemResponseDto],
        required: false,
    }),
    (0, class_transformer_1.Type)(() => ItemResponseDto),
    __metadata("design:type", Array)
], ItemResponseDto.prototype, "subItems", void 0);
//# sourceMappingURL=item-response.dto.js.map