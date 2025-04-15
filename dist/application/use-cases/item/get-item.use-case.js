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
var GetItemUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetItemUseCase = void 0;
const common_1 = require("@nestjs/common");
let GetItemUseCase = GetItemUseCase_1 = class GetItemUseCase {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
        this.logger = new common_1.Logger(GetItemUseCase_1.name);
    }
    async execute(id) {
        this.logger.log(`Fetching item with ID: ${id}`);
        const item = await this.itemRepository.findById(id);
        if (!item) {
            this.logger.warn(`Item with ID ${id} not found`);
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        return item;
    }
    async findByName(name) {
        this.logger.log(`Fetching item with name: ${name}`);
        const item = await this.itemRepository.findByName(name);
        if (!item) {
            this.logger.warn(`Item with name ${name} not found`);
            throw new common_1.NotFoundException(`Item with name ${name} not found`);
        }
        return item;
    }
    async getSubItems(parentItemId) {
        this.logger.log(`Fetching sub-items for parent item ID: ${parentItemId}`);
        const parentItem = await this.itemRepository.findById(parentItemId);
        if (!parentItem) {
            this.logger.warn(`Parent item with ID ${parentItemId} not found`);
            throw new common_1.NotFoundException(`Parent item with ID ${parentItemId} not found`);
        }
        return this.itemRepository.findSubItems(parentItemId);
    }
};
exports.GetItemUseCase = GetItemUseCase;
exports.GetItemUseCase = GetItemUseCase = GetItemUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], GetItemUseCase);
//# sourceMappingURL=get-item.use-case.js.map