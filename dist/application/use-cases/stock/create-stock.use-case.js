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
var CreateStockUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStockUseCase = void 0;
const common_1 = require("@nestjs/common");
let CreateStockUseCase = CreateStockUseCase_1 = class CreateStockUseCase {
    constructor(stockRepository, itemRepository) {
        this.stockRepository = stockRepository;
        this.itemRepository = itemRepository;
        this.logger = new common_1.Logger(CreateStockUseCase_1.name);
    }
    async execute(createStockDto) {
        this.logger.log(`Creating stock for item ID: ${createStockDto.itemId}`);
        const item = await this.itemRepository.findById(createStockDto.itemId);
        if (!item) {
            this.logger.warn(`Item with ID ${createStockDto.itemId} not found`);
            throw new common_1.NotFoundException(`Item with ID ${createStockDto.itemId} not found`);
        }
        const existingStock = await this.stockRepository.findByItemId(createStockDto.itemId);
        if (existingStock) {
            this.logger.warn(`Stock already exists for item ID ${createStockDto.itemId}`);
            throw new common_1.BadRequestException(`Stock already exists for item ID ${createStockDto.itemId}`);
        }
        const newStock = await this.stockRepository.create({
            ...createStockDto,
            lastRefilled: createStockDto.lastRefilled || new Date(),
        });
        this.logger.log(`Stock created with ID: ${newStock.id} for item ID: ${createStockDto.itemId}`);
        return newStock;
    }
};
exports.CreateStockUseCase = CreateStockUseCase;
exports.CreateStockUseCase = CreateStockUseCase = CreateStockUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object])
], CreateStockUseCase);
//# sourceMappingURL=create-stock.use-case.js.map