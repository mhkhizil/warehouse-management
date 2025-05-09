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
exports.SupplierResponseSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class SupplierResponseSchema {
}
exports.SupplierResponseSchema = SupplierResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Unique identifier' }),
    __metadata("design:type", Number)
], SupplierResponseSchema.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AutoParts Inc.', description: 'Supplier name' }),
    __metadata("design:type", String)
], SupplierResponseSchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+1 123-456-7890', description: 'Phone number', required: false }),
    __metadata("design:type", String)
], SupplierResponseSchema.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'contact@autoparts.com', description: 'Email address', required: false }),
    __metadata("design:type", String)
], SupplierResponseSchema.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Parts Avenue, Autoville, CA 92000', description: 'Physical address', required: false }),
    __metadata("design:type", String)
], SupplierResponseSchema.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Smith', description: 'Primary contact person', required: false }),
    __metadata("design:type", String)
], SupplierResponseSchema.prototype, "contactPerson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the supplier is active' }),
    __metadata("design:type", Boolean)
], SupplierResponseSchema.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Offers discounts for bulk orders', description: 'Additional notes', required: false }),
    __metadata("design:type", String)
], SupplierResponseSchema.prototype, "remarks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00Z', description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], SupplierResponseSchema.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-15T00:00:00Z', description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], SupplierResponseSchema.prototype, "updatedAt", void 0);
//# sourceMappingURL=SupplierResponseSchema.js.map