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
var GetStockUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStockUseCase = void 0;
const common_1 = require("@nestjs/common");
let GetStockUseCase = GetStockUseCase_1 = class GetStockUseCase {
    constructor(stockRepository, itemRepository) {
        this.stockRepository = stockRepository;
        this.itemRepository = itemRepository;
        this.logger = new common_1.Logger(GetStockUseCase_1.name);
    }
    async execute(id) {
        this.logger.log(`Fetching stock with ID: ${id}`);
        const stock = await this.stockRepository.findById(id);
        if (!stock) {
            this.logger.warn(`Stock with ID ${id} not found`);
            throw new common_1.NotFoundException(`Stock with ID ${id} not found`);
        }
        return stock;
    }
    async getByItemId(itemId) {
        this.logger.log(`Fetching stock for item ID: ${itemId}`);
        const item = await this.itemRepository.findById(itemId);
        if (!item) {
            this.logger.warn(`Item with ID ${itemId} not found`);
            throw new common_1.NotFoundException(`Item with ID ${itemId} not found`);
        }
        const stock = await this.stockRepository.findByItemId(itemId);
        if (!stock) {
            this.logger.warn(`Stock for item ID ${itemId} not found`);
            throw new common_1.NotFoundException(`Stock for item ID ${itemId} not found`);
        }
        return stock;
    }
    async getLowStock(threshold) {
        this.logger.log(`Fetching low stock items${threshold ? ` with threshold: ${threshold}` : ''}`);
        return this.stockRepository.findLowStock(threshold);
    }
};
exports.GetStockUseCase = GetStockUseCase;
exports.GetStockUseCase = GetStockUseCase = GetStockUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object])
], GetStockUseCase);
//# sourceMappingURL=get-stock.use-case.js.map