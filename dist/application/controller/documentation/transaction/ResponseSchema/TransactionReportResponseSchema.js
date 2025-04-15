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
exports.TransactionReportResponseSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const BaseResponseSchema_1 = require("../../common/BaseResponseSchema");
const transaction_response_dto_1 = require("../../../../dtos/transaction/transaction-response.dto");
class TransactionReportData {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'number', example: 10000 }),
    __metadata("design:type", Number)
], TransactionReportData.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [transaction_response_dto_1.TransactionResponseDto] }),
    __metadata("design:type", Array)
], TransactionReportData.prototype, "transactions", void 0);
class TransactionReportResponseSchema extends BaseResponseSchema_1.BaseResponseSchema {
    constructor(totalAmount, transactions) {
        super();
        this.message = 'Transaction report generated successfully';
        this.code = 200;
        this.data = { totalAmount, transactions };
    }
}
exports.TransactionReportResponseSchema = TransactionReportResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ type: TransactionReportData }),
    __metadata("design:type", TransactionReportData)
], TransactionReportResponseSchema.prototype, "data", void 0);
//# sourceMappingURL=TransactionReportResponseSchema.js.map