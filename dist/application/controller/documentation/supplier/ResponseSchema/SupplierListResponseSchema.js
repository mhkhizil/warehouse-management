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
exports.SupplierListResponseSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class SupplierListResponseSchema {
}
exports.SupplierListResponseSchema = SupplierListResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        example: true,
        description: 'Indicates if the request was successful',
    }),
    __metadata("design:type", Boolean)
], SupplierListResponseSchema.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response data',
        type: 'array',
        items: { $ref: '#/components/schemas/SupplierResponseSchema' },
        example: [
            {
                id: 1,
                name: 'AutoParts Inc.',
                phone: '+1 123-456-7890',
                email: 'contact@autoparts.com',
                address: '123 Parts Avenue, Autoville, CA 92000',
                contactPerson: 'John Smith',
                isActive: true,
                remarks: 'Preferred supplier for engine parts',
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-15T00:00:00Z',
            },
        ],
    }),
    __metadata("design:type", Array)
], SupplierListResponseSchema.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'Suppliers retrieved successfully',
        description: 'Response message',
    }),
    __metadata("design:type", String)
], SupplierListResponseSchema.prototype, "message", void 0);
//# sourceMappingURL=SupplierListResponseSchema.js.map