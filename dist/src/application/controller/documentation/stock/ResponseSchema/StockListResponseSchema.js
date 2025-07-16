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
exports.StockListResponseSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const BaseResponseSchema_1 = require("../../common/BaseResponseSchema");
const stock_response_dto_1 = require("../../../../dtos/stock/stock-response.dto");
class StockListData {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [stock_response_dto_1.StockResponseDto] }),
    __metadata("design:type", Array)
], StockListData.prototype, "stocks", void 0);
class StockListResponseSchema extends BaseResponseSchema_1.BaseResponseSchema {
    constructor(stocks) {
        super();
        this.message = 'Stocks retrieved successfully';
        this.code = 200;
        this.data = { stocks };
    }
}
exports.StockListResponseSchema = StockListResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ type: StockListData }),
    __metadata("design:type", StockListData)
], StockListResponseSchema.prototype, "data", void 0);
//# sourceMappingURL=StockListResponseSchema.js.map