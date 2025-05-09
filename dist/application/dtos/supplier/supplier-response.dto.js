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
exports.SupplierResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SupplierResponseDto {
    constructor(partial) {
        Object.assign(this, partial);
    }
}
exports.SupplierResponseDto = SupplierResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Unique identifier' }),
    __metadata("design:type", Number)
], SupplierResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AutoParts Inc.', description: 'Supplier name' }),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+1 123-456-7890',
        description: 'Phone number',
        required: false,
    }),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'contact@autoparts.com',
        description: 'Email address',
        required: false,
    }),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123 Parts Avenue, Autoville, CA 92000',
        description: 'Physical address',
        required: false,
    }),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Smith',
        description: 'Primary contact person',
        required: false,
    }),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "contactPerson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the supplier is active' }),
    __metadata("design:type", Boolean)
], SupplierResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Offers discounts for bulk orders',
        description: 'Additional notes',
        required: false,
    }),
    __metadata("design:type", String)
], SupplierResponseDto.prototype, "remarks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-01-01T00:00:00Z',
        description: 'Creation timestamp',
    }),
    __metadata("design:type", Date)
], SupplierResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-01-15T00:00:00Z',
        description: 'Last update timestamp',
    }),
    __metadata("design:type", Date)
], SupplierResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=supplier-response.dto.js.map