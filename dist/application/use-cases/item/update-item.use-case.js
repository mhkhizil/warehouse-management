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
var UpdateItemUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateItemUseCase = void 0;
const common_1 = require("@nestjs/common");
let UpdateItemUseCase = UpdateItemUseCase_1 = class UpdateItemUseCase {
    constructor(itemRepository, stockRepository) {
        this.itemRepository = itemRepository;
        this.stockRepository = stockRepository;
        this.logger = new common_1.Logger(UpdateItemUseCase_1.name);
    }
    async execute(id, updateItemDto) {
        this.logger.log(`Updating item with ID: ${id}`);
        const item = await this.itemRepository.findById(id);
        if (!item) {
            this.logger.warn(`Item with ID ${id} not found`);
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        if (updateItemDto.name && updateItemDto.name !== item.name) {
            const existingItemWithName = await this.itemRepository.findByName(updateItemDto.name);
            if (existingItemWithName && existingItemWithName.id !== id) {
                this.logger.warn(`Item with name ${updateItemDto.name} already exists`);
                throw new common_1.BadRequestException(`Item with name ${updateItemDto.name} already exists`);
            }
        }
        if (updateItemDto.parentItemId &&
            updateItemDto.parentItemId !== item.parentItemId) {
            if (updateItemDto.parentItemId === id) {
                this.logger.warn('Item cannot be its own parent');
                throw new common_1.BadRequestException('Item cannot be its own parent');
            }
            const parentItem = await this.itemRepository.findById(updateItemDto.parentItemId);
            if (!parentItem) {
                this.logger.warn(`Parent item with ID ${updateItemDto.parentItemId} not found`);
                throw new common_1.BadRequestException(`Parent item with ID ${updateItemDto.parentItemId} not found`);
            }
        }
        const { stockQuantity, ...itemUpdateData } = updateItemDto;
        const updatedItem = await this.itemRepository.update(id, itemUpdateData);
        if (stockQuantity !== undefined) {
            const itemWithStock = item;
            const stock = itemWithStock.stock?.[0];
            if (stock) {
                await this.stockRepository.update(stock.id, {
                    quantity: stockQuantity,
                    lastRefilled: new Date(),
                });
            }
            else {
                await this.stockRepository.create({
                    itemId: id,
                    quantity: stockQuantity,
                    lastRefilled: new Date(),
                });
            }
        }
        this.logger.log(`Item with ID ${id} updated successfully`);
        return updatedItem;
    }
};
exports.UpdateItemUseCase = UpdateItemUseCase;
exports.UpdateItemUseCase = UpdateItemUseCase = UpdateItemUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object])
], UpdateItemUseCase);
//# sourceMappingURL=update-item.use-case.js.map