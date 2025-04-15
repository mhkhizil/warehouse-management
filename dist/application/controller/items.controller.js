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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const create_item_use_case_1 = require("../use-cases/item/create-item.use-case");
const delete_item_use_case_1 = require("../use-cases/item/delete-item.use-case");
const get_item_use_case_1 = require("../use-cases/item/get-item.use-case");
const list_items_use_case_1 = require("../use-cases/item/list-items.use-case");
const update_item_use_case_1 = require("../use-cases/item/update-item.use-case");
const api_response_dto_1 = require("../dtos/common/api-response.dto");
const create_item_dto_1 = require("../dtos/item/create-item.dto");
const update_item_dto_1 = require("../dtos/item/update-item.dto");
const item_response_dto_1 = require("../dtos/item/item-response.dto");
const pagination_dto_1 = require("../dtos/common/pagination.dto");
const ItemResponseSchema_1 = require("./documentation/item/ResponseSchema/ItemResponseSchema");
const PaginatedItemResponseSchema_1 = require("./documentation/item/ResponseSchema/PaginatedItemResponseSchema");
const ItemListResponseSchema_1 = require("./documentation/item/ResponseSchema/ItemListResponseSchema");
let ItemsController = class ItemsController {
    constructor(createItemUseCase, deleteItemUseCase, getItemUseCase, listItemsUseCase, updateItemUseCase) {
        this.createItemUseCase = createItemUseCase;
        this.deleteItemUseCase = deleteItemUseCase;
        this.getItemUseCase = getItemUseCase;
        this.listItemsUseCase = listItemsUseCase;
        this.updateItemUseCase = updateItemUseCase;
    }
    async createItem(createItemDto) {
        const item = await this.createItemUseCase.execute(createItemDto);
        return api_response_dto_1.ApiResponseDto.success(new item_response_dto_1.ItemResponseDto(item), 'Item created successfully');
    }
    async getItems(paginationQuery, name, brand, type, isSellable) {
        const filter = {
            skip: paginationQuery.skip,
            take: paginationQuery.take,
            name,
            brand,
            type,
            isSellable: isSellable === 'true'
                ? true
                : isSellable === 'false'
                    ? false
                    : undefined,
        };
        const { items, total } = await this.listItemsUseCase.execute(filter);
        const itemDtos = items.map((item) => new item_response_dto_1.ItemResponseDto(item));
        const paginatedResponse = new pagination_dto_1.PaginatedResponseDto(itemDtos, total, paginationQuery.skip, paginationQuery.take);
        return api_response_dto_1.ApiResponseDto.success(paginatedResponse, 'Items retrieved successfully');
    }
    async getAllItems() {
        const items = await this.listItemsUseCase.findAll();
        const itemDtos = items.map((item) => new item_response_dto_1.ItemResponseDto(item));
        return api_response_dto_1.ApiResponseDto.success(itemDtos, 'All items retrieved successfully');
    }
    async getItemById(id) {
        const item = await this.getItemUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(new item_response_dto_1.ItemResponseDto(item), 'Item retrieved successfully');
    }
    async getItemByName(name) {
        const item = await this.getItemUseCase.findByName(name);
        return api_response_dto_1.ApiResponseDto.success(new item_response_dto_1.ItemResponseDto(item), 'Item retrieved successfully');
    }
    async getSubItems(parentId) {
        const subItems = await this.getItemUseCase.getSubItems(parentId);
        const subItemDtos = subItems.map((item) => new item_response_dto_1.ItemResponseDto(item));
        return api_response_dto_1.ApiResponseDto.success(subItemDtos, 'Sub-items retrieved successfully');
    }
    async updateItem(id, updateItemDto) {
        const item = await this.updateItemUseCase.execute(id, updateItemDto);
        return api_response_dto_1.ApiResponseDto.success(new item_response_dto_1.ItemResponseDto(item), 'Item updated successfully');
    }
    async deleteItem(id) {
        const deleted = await this.deleteItemUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(deleted, 'Item deleted successfully');
    }
};
exports.ItemsController = ItemsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new item' }),
    (0, swagger_1.ApiBody)({ type: create_item_dto_1.CreateItemDto, description: 'Item data to create' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Item created successfully',
        type: ItemResponseSchema_1.ItemResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data or item with this name already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_item_dto_1.CreateItemDto]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "createItem", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a list of items with optional filtering' }),
    (0, swagger_1.ApiQuery)({ type: pagination_dto_1.PaginationQueryDto, required: false }),
    (0, swagger_1.ApiQuery)({
        name: 'name',
        required: false,
        description: 'Filter by item name',
    }),
    (0, swagger_1.ApiQuery)({ name: 'brand', required: false, description: 'Filter by brand' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by type' }),
    (0, swagger_1.ApiQuery)({
        name: 'isSellable',
        required: false,
        enum: ['true', 'false'],
        description: 'Filter by whether item can be sold',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Items retrieved successfully',
        type: PaginatedItemResponseSchema_1.PaginatedItemResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('name')),
    __param(2, (0, common_1.Query)('brand')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('isSellable')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "getItems", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all items without pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'All items retrieved successfully',
        type: ItemListResponseSchema_1.ItemListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "getAllItems", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get an item by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Item ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Item retrieved successfully',
        type: ItemResponseSchema_1.ItemResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Item not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "getItemById", null);
__decorate([
    (0, common_1.Get)('name/:name'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get an item by name' }),
    (0, swagger_1.ApiParam)({ name: 'name', type: 'string', description: 'Item name' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Item retrieved successfully',
        type: ItemResponseSchema_1.ItemResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Item not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "getItemByName", null);
__decorate([
    (0, common_1.Get)(':id/sub-items'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get sub-items of an item' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Parent item ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Sub-items retrieved successfully',
        type: ItemListResponseSchema_1.ItemListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Parent item not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "getSubItems", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update an item' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Item ID' }),
    (0, swagger_1.ApiBody)({ type: update_item_dto_1.UpdateItemDto, description: 'Item data to update' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Item updated successfully',
        type: ItemResponseSchema_1.ItemResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Item not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_item_dto_1.UpdateItemDto]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an item' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Item ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Item deleted successfully',
        type: ItemResponseSchema_1.ItemResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Item not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "deleteItem", null);
exports.ItemsController = ItemsController = __decorate([
    (0, common_1.Controller)('items'),
    (0, swagger_1.ApiTags)('items'),
    __metadata("design:paramtypes", [create_item_use_case_1.CreateItemUseCase,
        delete_item_use_case_1.DeleteItemUseCase,
        get_item_use_case_1.GetItemUseCase,
        list_items_use_case_1.ListItemsUseCase,
        update_item_use_case_1.UpdateItemUseCase])
], ItemsController);
//# sourceMappingURL=items.controller.js.map