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
exports.SupplierDebtFilterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SupplierDebtFilterDto {
    constructor() {
        this.take = 10;
        this.skip = 0;
    }
}
exports.SupplierDebtFilterDto = SupplierDebtFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by supplier ID',
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SupplierDebtFilterDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by settlement status',
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    __metadata("design:type", Boolean)
], SupplierDebtFilterDto.prototype, "isSettled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter debts due before this date',
        required: false,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SupplierDebtFilterDto.prototype, "dueBefore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter debts due after this date',
        required: false,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SupplierDebtFilterDto.prototype, "dueAfter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of records to fetch',
        required: false,
        default: 10,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SupplierDebtFilterDto.prototype, "take", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of records to skip',
        required: false,
        default: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SupplierDebtFilterDto.prototype, "skip", void 0);
//# sourceMappingURL=supplier-debt-filter.dto.js.map