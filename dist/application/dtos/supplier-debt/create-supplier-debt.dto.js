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
exports.CreateSupplierDebtDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSupplierDebtDto {
}
exports.CreateSupplierDebtDto = CreateSupplierDebtDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Supplier ID',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSupplierDebtDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Debt amount',
        example: 500.0,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSupplierDebtDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Due date for the debt',
        example: '2023-12-31T00:00:00Z',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSupplierDebtDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Is the debt settled',
        example: false,
        default: false,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateSupplierDebtDto.prototype, "isSettled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Related transaction ID',
        example: 123,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSupplierDebtDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional remarks about the debt',
        example: 'For emergency purchase of spare parts',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSupplierDebtDto.prototype, "remarks", void 0);
//# sourceMappingURL=create-supplier-debt.dto.js.map