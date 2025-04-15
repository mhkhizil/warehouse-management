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
var FindOverdueDebtsUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindOverdueDebtsUseCase = void 0;
const common_1 = require("@nestjs/common");
const repository_tokens_1 = require("../../../domain/constants/repository.tokens");
let FindOverdueDebtsUseCase = FindOverdueDebtsUseCase_1 = class FindOverdueDebtsUseCase {
    constructor(debtRepository) {
        this.debtRepository = debtRepository;
        this.logger = new common_1.Logger(FindOverdueDebtsUseCase_1.name);
    }
    async execute() {
        this.logger.log('Finding overdue debts');
        const overdueDebts = await this.debtRepository.findOverdueDebts();
        this.logger.log(`Found ${overdueDebts.length} overdue debts`);
        return overdueDebts;
    }
};
exports.FindOverdueDebtsUseCase = FindOverdueDebtsUseCase;
exports.FindOverdueDebtsUseCase = FindOverdueDebtsUseCase = FindOverdueDebtsUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_tokens_1.DEBT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], FindOverdueDebtsUseCase);
//# sourceMappingURL=find-overdue-debts.use-case.js.map