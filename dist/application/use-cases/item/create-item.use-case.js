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
var CreateItemUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateItemUseCase = void 0;
const common_1 = require("@nestjs/common");
let CreateItemUseCase = CreateItemUseCase_1 = class CreateItemUseCase {
    constructor(itemRepository, stockRepository) {
        this.itemRepository = itemRepository;
        this.stockRepository = stockRepository;
        this.logger = new common_1.Logger(CreateItemUseCase_1.name);
    }
    async execute(createItemDto) {
        this.logger.log(`Creating item with name: ${createItemDto.name}`);
        const existingItem = await this.itemRepository.findByName(createItemDto.name);
        if (existingItem) {
            this.logger.warn(`Item with name ${createItemDto.name} already exists`);
            throw new common_1.BadRequestException(`Item with name ${createItemDto.name} already exists`);
        }
        if (createItemDto.parentItemId) {
            const parentItem = await this.itemRepository.findById(createItemDto.parentItemId);
            if (!parentItem) {
                this.logger.warn(`Parent item with ID ${createItemDto.parentItemId} not found`);
                throw new common_1.BadRequestException(`Parent item with ID ${createItemDto.parentItemId} not found`);
            }
        }
        const { initialQuantity, refillAlert, ...itemData } = createItemDto;
        const newItem = await this.itemRepository.create(itemData);
        if (initialQuantity !== undefined) {
            await this.stockRepository.create({
                itemId: newItem.id,
                quantity: initialQuantity,
                refillAlert: refillAlert || false,
                lastRefilled: new Date(),
            });
        }
        this.logger.log(`Item created with ID: ${newItem.id}`);
        return newItem;
    }
};
exports.CreateItemUseCase = CreateItemUseCase;
exports.CreateItemUseCase = CreateItemUseCase = CreateItemUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object])
], CreateItemUseCase);
//# sourceMappingURL=create-item.use-case.js.map