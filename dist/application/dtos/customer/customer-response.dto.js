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
exports.CustomerResponseDto = exports.CustomerDebtDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CustomerDebtDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.CustomerDebtDto = CustomerDebtDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Debt ID', example: 1 }),
    __metadata("design:type", Number)
], CustomerDebtDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Debt amount', example: 150.0 }),
    __metadata("design:type", Number)
], CustomerDebtDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Due date', example: '2023-02-01T00:00:00Z' }),
    __metadata("design:type", Date)
], CustomerDebtDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether debt is settled', example: false }),
    __metadata("design:type", Boolean)
], CustomerDebtDto.prototype, "isSettled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether alert has been sent', example: false }),
    __metadata("design:type", Boolean)
], CustomerDebtDto.prototype, "alertSent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID if applicable', example: 42 }),
    __metadata("design:type", Number)
], CustomerDebtDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Remarks', example: 'Payment pending' }),
    __metadata("design:type", String)
], CustomerDebtDto.prototype, "remarks", void 0);
class CustomerResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.debt) {
            this.debt = partial.debt.map((d) => new CustomerDebtDto(d));
        }
    }
}
exports.CustomerResponseDto = CustomerResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer ID', example: 1 }),
    __metadata("design:type", Number)
], CustomerResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer name', example: 'John Smith' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', example: '+1234567890' }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address',
        example: 'john.smith@example.com',
    }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Address',
        example: '123 Main St, Anytown, AT 12345',
    }),
    __metadata("design:type", String)
], CustomerResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Customer debts',
        type: [CustomerDebtDto],
        required: false,
    }),
    (0, class_transformer_1.Type)(() => CustomerDebtDto),
    __metadata("design:type", Array)
], CustomerResponseDto.prototype, "debt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2023-01-02T00:00:00Z',
    }),
    __metadata("design:type", Date)
], CustomerResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=customer-response.dto.js.map