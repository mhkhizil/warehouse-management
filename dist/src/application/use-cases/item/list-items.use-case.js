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
var ListItemsUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItemsUseCase = void 0;
const common_1 = require("@nestjs/common");
let ListItemsUseCase = ListItemsUseCase_1 = class ListItemsUseCase {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
        this.logger = new common_1.Logger(ListItemsUseCase_1.name);
    }
    async execute(filter) {
        this.logger.log('Fetching items with filters');
        return await this.itemRepository.findWithFilters(filter);
    }
    async findAll() {
        this.logger.log('Fetching all items');
        return await this.itemRepository.findAll();
    }
};
exports.ListItemsUseCase = ListItemsUseCase;
exports.ListItemsUseCase = ListItemsUseCase = ListItemsUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], ListItemsUseCase);
//# sourceMappingURL=list-items.use-case.js.map