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
exports.PaginatedSupplierResponseSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class PaginatedSupplierResponseSchema {
}
exports.PaginatedSupplierResponseSchema = PaginatedSupplierResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        example: true,
        description: 'Indicates if the request was successful',
    }),
    __metadata("design:type", Boolean)
], PaginatedSupplierResponseSchema.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response data',
        type: 'object',
        properties: {
            suppliers: {
                type: 'array',
                items: { $ref: '#/components/schemas/SupplierResponseSchema' },
                description: 'List of suppliers',
            },
            total: {
                type: 'number',
                example: 100,
                description: 'Total number of suppliers',
            },
        },
    }),
    __metadata("design:type", Object)
], PaginatedSupplierResponseSchema.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'Suppliers retrieved successfully',
        description: 'Response message',
    }),
    __metadata("design:type", String)
], PaginatedSupplierResponseSchema.prototype, "message", void 0);
//# sourceMappingURL=PaginatedSupplierResponseSchema.js.map