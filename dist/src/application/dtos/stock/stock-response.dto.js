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
exports.StockResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const item_response_dto_1 = require("../item/item-response.dto");
class StockResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.item) {
            this.item = new item_response_dto_1.ItemResponseDto(partial.item);
        }
    }
}
exports.StockResponseDto = StockResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stock ID', example: 1 }),
    __metadata("design:type", Number)
], StockResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Associated item ID', example: 1 }),
    __metadata("design:type", Number)
], StockResponseDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Item information',
        type: item_response_dto_1.ItemResponseDto,
    }),
    (0, class_transformer_1.Type)(() => item_response_dto_1.ItemResponseDto),
    __metadata("design:type", item_response_dto_1.ItemResponseDto)
], StockResponseDto.prototype, "item", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current quantity', example: 42 }),
    __metadata("design:type", Number)
], StockResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last refill date',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], StockResponseDto.prototype, "lastRefilled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Refill alert status', example: true }),
    __metadata("design:type", Boolean)
], StockResponseDto.prototype, "refillAlert", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], StockResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2023-01-02T00:00:00Z',
    }),
    __metadata("design:type", Date)
], StockResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=stock-response.dto.js.map