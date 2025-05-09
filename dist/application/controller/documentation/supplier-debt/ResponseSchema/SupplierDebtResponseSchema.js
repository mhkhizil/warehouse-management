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
exports.SupplierDebtResponseSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class SupplierDebtResponseSchema {
}
exports.SupplierDebtResponseSchema = SupplierDebtResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Unique identifier' }),
    __metadata("design:type", Number)
], SupplierDebtResponseSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Supplier ID' }),
    __metadata("design:type", Number)
], SupplierDebtResponseSchema.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500.00, description: 'Debt amount' }),
    __metadata("design:type", Number)
], SupplierDebtResponseSchema.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-12-31T00:00:00Z', description: 'Due date for payment' }),
    __metadata("design:type", Date)
], SupplierDebtResponseSchema.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Whether the debt has been settled' }),
    __metadata("design:type", Boolean)
], SupplierDebtResponseSchema.prototype, "isSettled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Whether a payment reminder has been sent' }),
    __metadata("design:type", Boolean)
], SupplierDebtResponseSchema.prototype, "alertSent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 123, description: 'Associated transaction ID', required: false }),
    __metadata("design:type", Number)
], SupplierDebtResponseSchema.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'For emergency purchase of spare parts', description: 'Additional notes', required: false }),
    __metadata("design:type", String)
], SupplierDebtResponseSchema.prototype, "remarks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00Z', description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], SupplierDebtResponseSchema.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-15T00:00:00Z', description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], SupplierDebtResponseSchema.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'object',
        required: false,
        description: 'Related supplier information',
        properties: {
            id: { type: 'number', example: 2 },
            name: { type: 'string', example: 'AutoParts Inc.' }
        }
    }),
    __metadata("design:type", Object)
], SupplierDebtResponseSchema.prototype, "supplier", void 0);
//# sourceMappingURL=SupplierDebtResponseSchema.js.map