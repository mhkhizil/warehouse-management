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
exports.SupplierDebtResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const supplier_response_dto_1 = require("../supplier/supplier-response.dto");
class SupplierDebtResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
        if (partial.supplier) {
            this.supplier = new supplier_response_dto_1.SupplierResponseDto(partial.supplier);
        }
    }
}
exports.SupplierDebtResponseDto = SupplierDebtResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supplier Debt ID', example: 1 }),
    __metadata("design:type", Number)
], SupplierDebtResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supplier ID', example: 1 }),
    __metadata("design:type", Number)
], SupplierDebtResponseDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Supplier information',
        type: supplier_response_dto_1.SupplierResponseDto,
        required: false,
    }),
    (0, class_transformer_1.Type)(() => supplier_response_dto_1.SupplierResponseDto),
    __metadata("design:type", supplier_response_dto_1.SupplierResponseDto)
], SupplierDebtResponseDto.prototype, "supplier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Debt amount', example: 1500.0 }),
    __metadata("design:type", Number)
], SupplierDebtResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Due date',
        example: '2023-12-31T00:00:00Z',
    }),
    __metadata("design:type", Date)
], SupplierDebtResponseDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the debt is settled', example: false }),
    __metadata("design:type", Boolean)
], SupplierDebtResponseDto.prototype, "isSettled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether alert has been sent', example: false }),
    __metadata("design:type", Boolean)
], SupplierDebtResponseDto.prototype, "alertSent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Transaction ID', example: 123, required: false }),
    __metadata("design:type", Number)
], SupplierDebtResponseDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional remarks',
        example: 'Payment for bulk order',
        required: false,
    }),
    __metadata("design:type", String)
], SupplierDebtResponseDto.prototype, "remarks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], SupplierDebtResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2023-01-15T00:00:00Z',
    }),
    __metadata("design:type", Date)
], SupplierDebtResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=supplier-debt-response.dto.js.map