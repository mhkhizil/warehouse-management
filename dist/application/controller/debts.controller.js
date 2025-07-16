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
exports.DebtsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const swagger_1 = require("@nestjs/swagger");
const api_response_dto_1 = require("../dtos/common/api-response.dto");
const pagination_dto_1 = require("../dtos/common/pagination.dto");
const create_debt_use_case_1 = require("../use-cases/debt/create-debt.use-case");
const delete_debt_use_case_1 = require("../use-cases/debt/delete-debt.use-case");
const get_debt_use_case_1 = require("../use-cases/debt/get-debt.use-case");
const list_debts_use_case_1 = require("../use-cases/debt/list-debts.use-case");
const update_debt_use_case_1 = require("../use-cases/debt/update-debt.use-case");
const mark_debt_settled_use_case_1 = require("../use-cases/debt/mark-debt-settled.use-case");
const mark_debt_alert_sent_use_case_1 = require("../use-cases/debt/mark-debt-alert-sent.use-case");
const find_overdue_debts_use_case_1 = require("../use-cases/debt/find-overdue-debts.use-case");
const create_debt_dto_1 = require("../dtos/debt/create-debt.dto");
const update_debt_dto_1 = require("../dtos/debt/update-debt.dto");
const debt_response_dto_1 = require("../dtos/debt/debt-response.dto");
const debt_filter_1 = require("../../domain/filters/debt.filter");
const DebtResponseSchema_1 = require("./documentation/debt/ResponseSchema/DebtResponseSchema");
const PaginatedDebtResponseSchema_1 = require("./documentation/debt/ResponseSchema/PaginatedDebtResponseSchema");
const DebtListResponseSchema_1 = require("./documentation/debt/ResponseSchema/DebtListResponseSchema");
let DebtsController = class DebtsController {
    constructor(createDebtUseCase, deleteDebtUseCase, getDebtUseCase, listDebtsUseCase, updateDebtUseCase, markDebtSettledUseCase, markDebtAlertSentUseCase, findOverdueDebtsUseCase) {
        this.createDebtUseCase = createDebtUseCase;
        this.deleteDebtUseCase = deleteDebtUseCase;
        this.getDebtUseCase = getDebtUseCase;
        this.listDebtsUseCase = listDebtsUseCase;
        this.updateDebtUseCase = updateDebtUseCase;
        this.markDebtSettledUseCase = markDebtSettledUseCase;
        this.markDebtAlertSentUseCase = markDebtAlertSentUseCase;
        this.findOverdueDebtsUseCase = findOverdueDebtsUseCase;
    }
    async createDebt(createDebtDto) {
        const debt = await this.createDebtUseCase.execute(createDebtDto);
        return api_response_dto_1.ApiResponseDto.success(new debt_response_dto_1.DebtResponseDto(debt), 'Debt created successfully');
    }
    async getDebts(paginationQuery, customerId, isSettled, alertSent, dueBefore, dueAfter) {
        const filter = new debt_filter_1.DebtFilter({
            skip: paginationQuery.skip,
            take: paginationQuery.take,
            customerId: customerId ? parseInt(customerId, 10) : undefined,
            isSettled: isSettled ? isSettled === 'true' : undefined,
            alertSent: alertSent ? alertSent === 'true' : undefined,
            dueBefore: dueBefore ? new Date(dueBefore) : undefined,
            dueAfter: dueAfter ? new Date(dueAfter) : undefined,
        });
        const { debts, total } = await this.listDebtsUseCase.execute(filter);
        const paginatedResponse = new pagination_dto_1.PaginatedResponseDto(debts.map((debt) => new debt_response_dto_1.DebtResponseDto(debt)), total, filter.skip, filter.take);
        return api_response_dto_1.ApiResponseDto.success(paginatedResponse, 'Debts retrieved successfully');
    }
    async getAllDebts() {
        const debts = await this.listDebtsUseCase.findAll();
        return api_response_dto_1.ApiResponseDto.success(debts.map((debt) => new debt_response_dto_1.DebtResponseDto(debt)), 'All debts retrieved successfully');
    }
    async getOverdueDebts() {
        const debts = await this.findOverdueDebtsUseCase.execute();
        return api_response_dto_1.ApiResponseDto.success(debts.map((debt) => new debt_response_dto_1.DebtResponseDto(debt)), 'Overdue debts retrieved successfully');
    }
    async getDebtsByCustomer(customerId) {
        const debts = await this.getDebtUseCase.findByCustomerId(customerId);
        return api_response_dto_1.ApiResponseDto.success(debts.map((debt) => new debt_response_dto_1.DebtResponseDto(debt)), 'Debts retrieved successfully');
    }
    async getDebtByTransaction(transactionId) {
        const debt = await this.getDebtUseCase.findByTransactionId(transactionId);
        return api_response_dto_1.ApiResponseDto.success(new debt_response_dto_1.DebtResponseDto(debt), 'Debt retrieved successfully');
    }
    async getDebtById(id) {
        const debt = await this.getDebtUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(new debt_response_dto_1.DebtResponseDto(debt), 'Debt retrieved successfully');
    }
    async updateDebt(id, updateDebtDto) {
        const debt = await this.updateDebtUseCase.execute(id, updateDebtDto);
        return api_response_dto_1.ApiResponseDto.success(new debt_response_dto_1.DebtResponseDto(debt), 'Debt updated successfully');
    }
    async settleDebt(id) {
        const debt = await this.markDebtSettledUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(new debt_response_dto_1.DebtResponseDto(debt), 'Debt marked as settled successfully');
    }
    async markAlertSent(id) {
        const debt = await this.markDebtAlertSentUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(new debt_response_dto_1.DebtResponseDto(debt), 'Debt alert marked as sent successfully');
    }
    async deleteDebt(id) {
        const deleted = await this.deleteDebtUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(deleted, 'Debt deleted successfully');
    }
};
exports.DebtsController = DebtsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new debt' }),
    (0, swagger_1.ApiBody)({ type: create_debt_dto_1.CreateDebtDto, description: 'Debt data to create' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Debt created successfully',
        type: DebtResponseSchema_1.DebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Customer or Transaction not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_debt_dto_1.CreateDebtDto]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "createDebt", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get debts with optional filtering' }),
    (0, swagger_1.ApiQuery)({ type: pagination_dto_1.PaginationQueryDto, required: false }),
    (0, swagger_1.ApiQuery)({
        name: 'customerId',
        required: false,
        description: 'Filter by customer ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isSettled',
        required: false,
        description: 'Filter by settlement status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'alertSent',
        required: false,
        description: 'Filter by alert status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dueBefore',
        required: false,
        description: 'Filter by due date before',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dueAfter',
        required: false,
        description: 'Filter by due date after',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Debts retrieved successfully',
        type: PaginatedDebtResponseSchema_1.PaginatedDebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('customerId')),
    __param(2, (0, common_1.Query)('isSettled')),
    __param(3, (0, common_1.Query)('alertSent')),
    __param(4, (0, common_1.Query)('dueBefore')),
    __param(5, (0, common_1.Query)('dueAfter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "getDebts", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all debts without pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'All debts retrieved successfully',
        type: DebtListResponseSchema_1.DebtListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "getAllDebts", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue debts' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Overdue debts retrieved successfully',
        type: DebtListResponseSchema_1.DebtListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "getOverdueDebts", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get debts by customer ID' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', type: 'number', description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Debts retrieved successfully',
        type: DebtListResponseSchema_1.DebtListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "getDebtsByCustomer", null);
__decorate([
    (0, common_1.Get)('transaction/:transactionId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get debt by transaction ID' }),
    (0, swagger_1.ApiParam)({
        name: 'transactionId',
        type: 'number',
        description: 'Transaction ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Debt retrieved successfully',
        type: DebtResponseSchema_1.DebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Debt not found for this transaction',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('transactionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "getDebtByTransaction", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get debt by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Debt ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Debt retrieved successfully',
        type: DebtResponseSchema_1.DebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Debt not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "getDebtById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update a debt' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Debt ID' }),
    (0, swagger_1.ApiBody)({ type: update_debt_dto_1.UpdateDebtDto, description: 'Debt data to update' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Debt updated successfully',
        type: DebtResponseSchema_1.DebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Debt not found',
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
    __metadata("design:paramtypes", [Number, update_debt_dto_1.UpdateDebtDto]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "updateDebt", null);
__decorate([
    (0, common_1.Put)(':id/settle'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a debt as settled' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Debt ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Debt marked as settled successfully',
        type: DebtResponseSchema_1.DebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Debt not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "settleDebt", null);
__decorate([
    (0, common_1.Put)(':id/mark-alert-sent'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Mark alert as sent for a debt' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Debt ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Debt alert marked as sent successfully',
        type: DebtResponseSchema_1.DebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Debt not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "markAlertSent", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a debt' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Debt ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Debt deleted successfully',
        type: DebtResponseSchema_1.DebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Debt not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DebtsController.prototype, "deleteDebt", null);
exports.DebtsController = DebtsController = __decorate([
    (0, swagger_1.ApiTags)('Debts'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('debts'),
    __metadata("design:paramtypes", [create_debt_use_case_1.CreateDebtUseCase,
        delete_debt_use_case_1.DeleteDebtUseCase,
        get_debt_use_case_1.GetDebtUseCase,
        list_debts_use_case_1.ListDebtsUseCase,
        update_debt_use_case_1.UpdateDebtUseCase,
        mark_debt_settled_use_case_1.MarkDebtSettledUseCase,
        mark_debt_alert_sent_use_case_1.MarkDebtAlertSentUseCase,
        find_overdue_debts_use_case_1.FindOverdueDebtsUseCase])
], DebtsController);
//# sourceMappingURL=debts.controller.js.map