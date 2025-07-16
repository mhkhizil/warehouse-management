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
exports.MarkSupplierDebtAlertSentUseCase = void 0;
const common_1 = require("@nestjs/common");
const repository_tokens_1 = require("../../../domain/constants/repository.tokens");
let MarkSupplierDebtAlertSentUseCase = class MarkSupplierDebtAlertSentUseCase {
    constructor(supplierDebtRepository) {
        this.supplierDebtRepository = supplierDebtRepository;
    }
    async execute(id) {
        const debt = await this.supplierDebtRepository.findById(id);
        if (!debt) {
            throw new common_1.NotFoundException(`Supplier debt with ID ${id} not found`);
        }
        return this.supplierDebtRepository.update(id, { alertSent: true });
    }
};
exports.MarkSupplierDebtAlertSentUseCase = MarkSupplierDebtAlertSentUseCase;
exports.MarkSupplierDebtAlertSentUseCase = MarkSupplierDebtAlertSentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_tokens_1.SUPPLIER_DEBT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], MarkSupplierDebtAlertSentUseCase);
//# sourceMappingURL=mark-supplier-debt-alert-sent.use-case.js.map