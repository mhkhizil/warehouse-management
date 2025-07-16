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
exports.SupplierDebtListResponseSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class SupplierDebtListResponseSchema {
}
exports.SupplierDebtListResponseSchema = SupplierDebtListResponseSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        example: true,
        description: 'Indicates if the request was successful',
    }),
    __metadata("design:type", Boolean)
], SupplierDebtListResponseSchema.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response data',
        type: 'array',
        items: { $ref: '#/components/schemas/SupplierDebtResponseSchema' },
        example: [
            {
                id: 1,
                supplierId: 2,
                amount: 500.0,
                dueDate: '2023-12-31T00:00:00Z',
                isSettled: false,
                alertSent: false,
                remarks: 'For emergency purchase of spare parts',
                transactionId: 123,
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-15T00:00:00Z',
                supplier: {
                    id: 2,
                    name: 'AutoParts Inc.',
                },
            },
        ],
    }),
    __metadata("design:type", Array)
], SupplierDebtListResponseSchema.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'Supplier debts retrieved successfully',
        description: 'Response message',
    }),
    __metadata("design:type", String)
], SupplierDebtListResponseSchema.prototype, "message", void 0);
//# sourceMappingURL=SupplierDebtListResponseSchema.js.map