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
var CreateDebtUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDebtUseCase = void 0;
const common_1 = require("@nestjs/common");
const repository_tokens_1 = require("../../../domain/constants/repository.tokens");
let CreateDebtUseCase = CreateDebtUseCase_1 = class CreateDebtUseCase {
    constructor(debtRepository, customerRepository, transactionRepository) {
        this.debtRepository = debtRepository;
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
        this.logger = new common_1.Logger(CreateDebtUseCase_1.name);
    }
    async execute(createDebtDto) {
        this.logger.log(`Creating debt for customer ID: ${createDebtDto.customerId}`);
        const customer = await this.customerRepository.findById(createDebtDto.customerId);
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${createDebtDto.customerId} not found`);
        }
        if (createDebtDto.transactionId) {
            const transaction = await this.transactionRepository.findById(createDebtDto.transactionId);
            if (!transaction) {
                throw new common_1.NotFoundException(`Transaction with ID ${createDebtDto.transactionId} not found`);
            }
        }
        if (!createDebtDto.isSettled) {
            createDebtDto.isSettled = false;
        }
        if (!createDebtDto.alertSent) {
            createDebtDto.alertSent = false;
        }
        const debt = await this.debtRepository.create(createDebtDto);
        this.logger.log(`Debt created with ID: ${debt.id}`);
        return debt;
    }
};
exports.CreateDebtUseCase = CreateDebtUseCase;
exports.CreateDebtUseCase = CreateDebtUseCase = CreateDebtUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_tokens_1.DEBT_REPOSITORY)),
    __param(1, (0, common_1.Inject)(repository_tokens_1.CUSTOMER_REPOSITORY)),
    __param(2, (0, common_1.Inject)(repository_tokens_1.TRANSACTION_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateDebtUseCase);
//# sourceMappingURL=create-debt.use-case.js.map