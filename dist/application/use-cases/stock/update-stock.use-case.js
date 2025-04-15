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
var UpdateStockUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStockUseCase = void 0;
const common_1 = require("@nestjs/common");
let UpdateStockUseCase = UpdateStockUseCase_1 = class UpdateStockUseCase {
    constructor(stockRepository) {
        this.stockRepository = stockRepository;
        this.logger = new common_1.Logger(UpdateStockUseCase_1.name);
    }
    async execute(id, updateStockDto) {
        this.logger.log(`Updating stock with ID: ${id}`);
        const stock = await this.stockRepository.findById(id);
        if (!stock) {
            this.logger.warn(`Stock with ID ${id} not found`);
            throw new common_1.NotFoundException(`Stock with ID ${id} not found`);
        }
        if (updateStockDto.quantityChange !== undefined) {
            const newQuantity = stock.quantity + updateStockDto.quantityChange;
            if (newQuantity < 0) {
                this.logger.warn(`Cannot reduce stock quantity below zero. Current: ${stock.quantity}, Requested change: ${updateStockDto.quantityChange}`);
                throw new Error(`Cannot reduce stock quantity below zero. Current: ${stock.quantity}, Requested change: ${updateStockDto.quantityChange}`);
            }
            return this.stockRepository.updateQuantity(id, newQuantity);
        }
        if (updateStockDto.quantity !== undefined) {
            if (updateStockDto.quantity < 0) {
                this.logger.warn(`Cannot set stock quantity below zero. Requested: ${updateStockDto.quantity}`);
                throw new Error(`Cannot set stock quantity below zero. Requested: ${updateStockDto.quantity}`);
            }
        }
        const updatedStock = await this.stockRepository.update(id, {
            ...updateStockDto,
            lastRefilled: updateStockDto.quantity !== undefined ? new Date() : stock.lastRefilled,
        });
        this.logger.log(`Stock with ID ${id} updated successfully`);
        return updatedStock;
    }
};
exports.UpdateStockUseCase = UpdateStockUseCase;
exports.UpdateStockUseCase = UpdateStockUseCase = UpdateStockUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], UpdateStockUseCase);
//# sourceMappingURL=update-stock.use-case.js.map