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
var ListDebtsUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDebtsUseCase = void 0;
const common_1 = require("@nestjs/common");
const repository_tokens_1 = require("../../../domain/constants/repository.tokens");
let ListDebtsUseCase = ListDebtsUseCase_1 = class ListDebtsUseCase {
    constructor(debtRepository) {
        this.debtRepository = debtRepository;
        this.logger = new common_1.Logger(ListDebtsUseCase_1.name);
    }
    async execute(filter) {
        this.logger.log(`Fetching debts with filter: ${JSON.stringify(filter)}`);
        return await this.debtRepository.findWithFilters(filter);
    }
    async findAll() {
        this.logger.log('Fetching all debts');
        return await this.debtRepository.findAll();
    }
    async findOverdueDebts() {
        this.logger.log('Fetching overdue debts');
        return await this.debtRepository.findOverdueDebts();
    }
};
exports.ListDebtsUseCase = ListDebtsUseCase;
exports.ListDebtsUseCase = ListDebtsUseCase = ListDebtsUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_tokens_1.DEBT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ListDebtsUseCase);
//# sourceMappingURL=list-debts.use-case.js.map