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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSupplierDebtUseCase = void 0;
const common_1 = require("@nestjs/common");
const repository_tokens_1 = require("../../../domain/constants/repository.tokens");
let CreateSupplierDebtUseCase = class CreateSupplierDebtUseCase {
    constructor(supplierDebtRepository, supplierRepository) {
        this.supplierDebtRepository = supplierDebtRepository;
        this.supplierRepository = supplierRepository;
    }
    async execute(data) {
        const supplier = await this.supplierRepository.findById(data.supplierId);
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with ID ${data.supplierId} not found`);
        }
        if (data.amount <= 0) {
            throw new common_1.BadRequestException('Debt amount must be greater than zero');
        }
        return this.supplierDebtRepository.create({
            supplierId: data.supplierId,
            amount: data.amount,
            dueDate: new Date(data.dueDate),
            isSettled: data.isSettled || false,
            transactionId: data.transactionId,
            remarks: data.remarks,
        });
    }
};
exports.CreateSupplierDebtUseCase = CreateSupplierDebtUseCase;
exports.CreateSupplierDebtUseCase = CreateSupplierDebtUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_tokens_1.SUPPLIER_DEBT_REPOSITORY)),
    __param(1, (0, common_1.Inject)(repository_tokens_1.SUPPLIER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], CreateSupplierDebtUseCase);
//# sourceMappingURL=create-supplier-debt.use-case.js.map