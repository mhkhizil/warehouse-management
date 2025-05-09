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
exports.BuyFromSupplierRequestSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class BuyFromSupplierRequestSchema {
}
exports.BuyFromSupplierRequestSchema = BuyFromSupplierRequestSchema;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID of the supplier',
    }),
    __metadata("design:type", Number)
], BuyFromSupplierRequestSchema.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2,
        description: 'ID of the item being purchased',
    }),
    __metadata("design:type", Number)
], BuyFromSupplierRequestSchema.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Quantity of items to purchase',
    }),
    __metadata("design:type", Number)
], BuyFromSupplierRequestSchema.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25.5,
        description: 'Price per unit',
    }),
    __metadata("design:type", Number)
], BuyFromSupplierRequestSchema.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether to create a debt record for this purchase',
        required: false,
    }),
    __metadata("design:type", Boolean)
], BuyFromSupplierRequestSchema.prototype, "createDebt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-04-30T00:00:00Z',
        description: 'Due date for debt payment (required if createDebt is true)',
        required: false,
    }),
    __metadata("design:type", String)
], BuyFromSupplierRequestSchema.prototype, "debtDueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Payment for bulk order of auto parts',
        description: 'Additional remarks for the debt record',
        required: false,
    }),
    __metadata("design:type", String)
], BuyFromSupplierRequestSchema.prototype, "debtRemarks", void 0);
//# sourceMappingURL=BuyFromSupplierRequestSchema.js.map