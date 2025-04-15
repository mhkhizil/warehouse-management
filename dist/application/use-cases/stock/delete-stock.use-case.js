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
var DeleteStockUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteStockUseCase = void 0;
const common_1 = require("@nestjs/common");
let DeleteStockUseCase = DeleteStockUseCase_1 = class DeleteStockUseCase {
    constructor(stockRepository) {
        this.stockRepository = stockRepository;
        this.logger = new common_1.Logger(DeleteStockUseCase_1.name);
    }
    async execute(id) {
        this.logger.log(`Deleting stock with ID: ${id}`);
        const stock = await this.stockRepository.findById(id);
        if (!stock) {
            this.logger.warn(`Stock with ID ${id} not found`);
            throw new common_1.NotFoundException(`Stock with ID ${id} not found`);
        }
        return await this.stockRepository.delete(id);
    }
};
exports.DeleteStockUseCase = DeleteStockUseCase;
exports.DeleteStockUseCase = DeleteStockUseCase = DeleteStockUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], DeleteStockUseCase);
//# sourceMappingURL=delete-stock.use-case.js.map