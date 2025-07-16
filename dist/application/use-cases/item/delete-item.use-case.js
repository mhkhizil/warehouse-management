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
var DeleteItemUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteItemUseCase = void 0;
const common_1 = require("@nestjs/common");
let DeleteItemUseCase = DeleteItemUseCase_1 = class DeleteItemUseCase {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
        this.logger = new common_1.Logger(DeleteItemUseCase_1.name);
    }
    async execute(id) {
        this.logger.log(`Deleting item with ID: ${id}`);
        const item = await this.itemRepository.findById(id);
        if (!item) {
            this.logger.warn(`Item with ID ${id} not found`);
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        const subItems = await this.itemRepository.findSubItems(id);
        if (subItems.length > 0) {
            this.logger.warn(`Item with ID ${id} has ${subItems.length} sub-items and cannot be deleted`);
            throw new common_1.BadRequestException(`This item has ${subItems.length} sub-items and cannot be deleted. Please delete or reassign the sub-items first.`);
        }
        return await this.itemRepository.delete(id);
    }
};
exports.DeleteItemUseCase = DeleteItemUseCase;
exports.DeleteItemUseCase = DeleteItemUseCase = DeleteItemUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], DeleteItemUseCase);
//# sourceMappingURL=delete-item.use-case.js.map