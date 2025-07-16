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
exports.DebtResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const customer_response_dto_1 = require("../customer/customer-response.dto");
class DebtResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.customer) {
            this.customer = new customer_response_dto_1.CustomerResponseDto(partial.customer);
        }
    }
}
exports.DebtResponseDto = DebtResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Debt ID', example: 1 }),
    __metadata("design:type", Number)
], DebtResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 1 }),
    __metadata("design:type", Number)
], DebtResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer information',
        type: customer_response_dto_1.CustomerResponseDto,
    }),
    (0, class_transformer_1.Type)(() => customer_response_dto_1.CustomerResponseDto),
    __metadata("design:type", customer_response_dto_1.CustomerResponseDto)
], DebtResponseDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Debt amount', example: 150.0 }),
    __metadata("design:type", Number)
], DebtResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Due date', example: '2023-02-01T00:00:00Z' }),
    __metadata("design:type", Date)
], DebtResponseDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether debt is settled', example: false }),
    __metadata("design:type", Boolean)
], DebtResponseDto.prototype, "isSettled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether alert has been sent', example: false }),
    __metadata("design:type", Boolean)
], DebtResponseDto.prototype, "alertSent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Remarks', example: 'Payment pending' }),
    __metadata("design:type", String)
], DebtResponseDto.prototype, "remarks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID if applicable', example: 42 }),
    __metadata("design:type", Number)
], DebtResponseDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], DebtResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2023-01-02T00:00:00Z',
    }),
    __metadata("design:type", Date)
], DebtResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=debt-response.dto.js.map