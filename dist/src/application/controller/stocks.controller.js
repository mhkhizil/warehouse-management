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
exports.StocksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const create_stock_use_case_1 = require("../use-cases/stock/create-stock.use-case");
const delete_stock_use_case_1 = require("../use-cases/stock/delete-stock.use-case");
const get_stock_use_case_1 = require("../use-cases/stock/get-stock.use-case");
const list_stocks_use_case_1 = require("../use-cases/stock/list-stocks.use-case");
const update_stock_use_case_1 = require("../use-cases/stock/update-stock.use-case");
const api_response_dto_1 = require("../dtos/common/api-response.dto");
const create_stock_dto_1 = require("../dtos/stock/create-stock.dto");
const update_stock_dto_1 = require("../dtos/stock/update-stock.dto");
const stock_response_dto_1 = require("../dtos/stock/stock-response.dto");
const pagination_dto_1 = require("../dtos/common/pagination.dto");
const StockResponseSchema_1 = require("./documentation/stock/ResponseSchema/StockResponseSchema");
const PaginatedStockResponseSchema_1 = require("./documentation/stock/ResponseSchema/PaginatedStockResponseSchema");
const StockListResponseSchema_1 = require("./documentation/stock/ResponseSchema/StockListResponseSchema");
let StocksController = class StocksController {
    constructor(createStockUseCase, deleteStockUseCase, getStockUseCase, listStocksUseCase, updateStockUseCase) {
        this.createStockUseCase = createStockUseCase;
        this.deleteStockUseCase = deleteStockUseCase;
        this.getStockUseCase = getStockUseCase;
        this.listStocksUseCase = listStocksUseCase;
        this.updateStockUseCase = updateStockUseCase;
    }
    async createStock(createStockDto) {
        const stock = await this.createStockUseCase.execute(createStockDto);
        return api_response_dto_1.ApiResponseDto.success(new stock_response_dto_1.StockResponseDto(stock), 'Stock created successfully');
    }
    async getStocks(paginationQuery, refillAlert, itemId, minQuantity, maxQuantity) {
        const filter = {
            skip: paginationQuery.skip,
            take: paginationQuery.take,
            refillAlert: refillAlert === 'true'
                ? true
                : refillAlert === 'false'
                    ? false
                    : undefined,
            itemId: itemId ? parseInt(itemId) : undefined,
            minQuantity: minQuantity ? parseInt(minQuantity) : undefined,
            maxQuantity: maxQuantity ? parseInt(maxQuantity) : undefined,
        };
        const { stocks, total } = await this.listStocksUseCase.execute(filter);
        const stockDtos = stocks.map((stock) => new stock_response_dto_1.StockResponseDto(stock));
        const paginatedResponse = new pagination_dto_1.PaginatedResponseDto(stockDtos, total, paginationQuery.skip, paginationQuery.take);
        return api_response_dto_1.ApiResponseDto.success(paginatedResponse, 'Stock entries retrieved successfully');
    }
    async getAllStocks() {
        const stocks = await this.listStocksUseCase.findAll();
        const stockDtos = stocks.map((stock) => new stock_response_dto_1.StockResponseDto(stock));
        return api_response_dto_1.ApiResponseDto.success(stockDtos, 'All stock entries retrieved successfully');
    }
    async getLowStock(threshold) {
        const thresholdValue = threshold ? parseInt(threshold) : undefined;
        const stocks = await this.getStockUseCase.getLowStock(thresholdValue);
        const stockDtos = stocks.map((stock) => new stock_response_dto_1.StockResponseDto(stock));
        return api_response_dto_1.ApiResponseDto.success(stockDtos, 'Low stock entries retrieved successfully');
    }
    async getStockById(id) {
        const stock = await this.getStockUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(new stock_response_dto_1.StockResponseDto(stock), 'Stock entry retrieved successfully');
    }
    async getStockByItemId(itemId) {
        const stock = await this.getStockUseCase.getByItemId(itemId);
        return api_response_dto_1.ApiResponseDto.success(new stock_response_dto_1.StockResponseDto(stock), 'Stock entry retrieved successfully');
    }
    async updateStock(id, updateStockDto) {
        const stock = await this.updateStockUseCase.execute(id, updateStockDto);
        return api_response_dto_1.ApiResponseDto.success(new stock_response_dto_1.StockResponseDto(stock), 'Stock entry updated successfully');
    }
    async deleteStock(id) {
        const deleted = await this.deleteStockUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(deleted, 'Stock entry deleted successfully');
    }
};
exports.StocksController = StocksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new stock entry' }),
    (0, swagger_1.ApiBody)({ type: create_stock_dto_1.CreateStockDto, description: 'Stock data to create' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Stock created successfully',
        type: StockResponseSchema_1.StockResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data or stock already exists for this item',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Item not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stock_dto_1.CreateStockDto]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "createStock", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a list of stock entries with optional filtering',
    }),
    (0, swagger_1.ApiQuery)({ type: pagination_dto_1.PaginationQueryDto, required: false }),
    (0, swagger_1.ApiQuery)({
        name: 'refillAlert',
        required: false,
        type: 'boolean',
        description: 'Filter by refill alert status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'itemId',
        required: false,
        type: 'number',
        description: 'Filter by item ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minQuantity',
        required: false,
        type: 'number',
        description: 'Filter by minimum quantity',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'maxQuantity',
        required: false,
        type: 'number',
        description: 'Filter by maximum quantity',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Stock entries retrieved successfully',
        type: PaginatedStockResponseSchema_1.PaginatedStockResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('refillAlert')),
    __param(2, (0, common_1.Query)('itemId')),
    __param(3, (0, common_1.Query)('minQuantity')),
    __param(4, (0, common_1.Query)('maxQuantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto, String, String, String, String]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getStocks", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all stock entries without pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'All stock entries retrieved successfully',
        type: StockListResponseSchema_1.StockListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getAllStocks", null);
__decorate([
    (0, common_1.Get)('low'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock entries with low quantity' }),
    (0, swagger_1.ApiQuery)({
        name: 'threshold',
        required: false,
        type: 'number',
        description: 'Optional threshold value (default defined by system)',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Low stock entries retrieved successfully',
        type: StockListResponseSchema_1.StockListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a stock entry by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Stock ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Stock entry retrieved successfully',
        type: StockResponseSchema_1.StockResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Stock entry not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getStockById", null);
__decorate([
    (0, common_1.Get)('item/:itemId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock by item ID' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', type: 'number', description: 'Item ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Stock entry retrieved successfully',
        type: StockResponseSchema_1.StockResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Stock entry not found for the item',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getStockByItemId", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a stock entry' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Stock ID' }),
    (0, swagger_1.ApiBody)({ type: update_stock_dto_1.UpdateStockDto, description: 'Stock data to update' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Stock entry updated successfully',
        type: StockResponseSchema_1.StockResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Stock entry not found',
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
    __metadata("design:paramtypes", [Number, update_stock_dto_1.UpdateStockDto]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a stock entry' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Stock ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Stock entry deleted successfully',
        type: StockResponseSchema_1.StockResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Stock entry not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "deleteStock", null);
exports.StocksController = StocksController = __decorate([
    (0, common_1.Controller)('stocks'),
    (0, swagger_1.ApiTags)('stocks'),
    __metadata("design:paramtypes", [create_stock_use_case_1.CreateStockUseCase,
        delete_stock_use_case_1.DeleteStockUseCase,
        get_stock_use_case_1.GetStockUseCase,
        list_stocks_use_case_1.ListStocksUseCase,
        update_stock_use_case_1.UpdateStockUseCase])
], StocksController);
//# sourceMappingURL=stocks.controller.js.map