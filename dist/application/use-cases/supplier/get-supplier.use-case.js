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
exports.GetSupplierUseCase = void 0;
const common_1 = require("@nestjs/common");
const repository_tokens_1 = require("../../../domain/constants/repository.tokens");
let GetSupplierUseCase = class GetSupplierUseCase {
    constructor(supplierRepository) {
        this.supplierRepository = supplierRepository;
    }
    async execute(id) {
        const supplier = await this.supplierRepository.findById(id);
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with ID ${id} not found`);
        }
        return supplier;
    }
    async findByEmail(email) {
        const supplier = await this.supplierRepository.findByEmail(email);
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with email ${email} not found`);
        }
        return supplier;
    }
    async findByPhone(phone) {
        const supplier = await this.supplierRepository.findByPhone(phone);
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with phone ${phone} not found`);
        }
        return supplier;
    }
    async findWithDebts() {
        return this.supplierRepository.findWithDebts();
    }
};
exports.GetSupplierUseCase = GetSupplierUseCase;
exports.GetSupplierUseCase = GetSupplierUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_tokens_1.SUPPLIER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], GetSupplierUseCase);
//# sourceMappingURL=get-supplier.use-case.js.map