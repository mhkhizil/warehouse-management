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
exports.SupplierDebtsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const admin_guard_1 = require("../auth/guard/admin.guard");
const create_supplier_debt_dto_1 = require("../dtos/supplier-debt/create-supplier-debt.dto");
const update_supplier_debt_dto_1 = require("../dtos/supplier-debt/update-supplier-debt.dto");
const supplier_debt_filter_dto_1 = require("../dtos/supplier-debt-filter.dto");
const create_supplier_debt_use_case_1 = require("../use-cases/supplier-debt/create-supplier-debt.use-case");
const get_supplier_debt_use_case_1 = require("../use-cases/supplier-debt/get-supplier-debt.use-case");
const update_supplier_debt_use_case_1 = require("../use-cases/supplier-debt/update-supplier-debt.use-case");
const list_supplier_debts_use_case_1 = require("../use-cases/supplier-debt/list-supplier-debts.use-case");
const delete_supplier_debt_use_case_1 = require("../use-cases/supplier-debt/delete-supplier-debt.use-case");
const mark_supplier_debt_settled_use_case_1 = require("../use-cases/supplier-debt/mark-supplier-debt-settled.use-case");
const mark_supplier_debt_alert_sent_use_case_1 = require("../use-cases/supplier-debt/mark-supplier-debt-alert-sent.use-case");
const find_overdue_supplier_debts_use_case_1 = require("../use-cases/supplier-debt/find-overdue-supplier-debts.use-case");
const ApiResponseSchema_1 = require("../../core/common/schema/ApiResponseSchema");
const SupplierDebtResponseSchema_1 = require("./documentation/supplier-debt/ResponseSchema/SupplierDebtResponseSchema");
const PaginatedSupplierDebtResponseSchema_1 = require("./documentation/supplier-debt/ResponseSchema/PaginatedSupplierDebtResponseSchema");
const SupplierDebtListResponseSchema_1 = require("./documentation/supplier-debt/ResponseSchema/SupplierDebtListResponseSchema");
let SupplierDebtsController = class SupplierDebtsController {
    constructor(createSupplierDebtUseCase, getSupplierDebtUseCase, updateSupplierDebtUseCase, listSupplierDebtsUseCase, deleteSupplierDebtUseCase, markSupplierDebtSettledUseCase, markSupplierDebtAlertSentUseCase, findOverdueSupplierDebtsUseCase) {
        this.createSupplierDebtUseCase = createSupplierDebtUseCase;
        this.getSupplierDebtUseCase = getSupplierDebtUseCase;
        this.updateSupplierDebtUseCase = updateSupplierDebtUseCase;
        this.listSupplierDebtsUseCase = listSupplierDebtsUseCase;
        this.deleteSupplierDebtUseCase = deleteSupplierDebtUseCase;
        this.markSupplierDebtSettledUseCase = markSupplierDebtSettledUseCase;
        this.markSupplierDebtAlertSentUseCase = markSupplierDebtAlertSentUseCase;
        this.findOverdueSupplierDebtsUseCase = findOverdueSupplierDebtsUseCase;
    }
    async create(createSupplierDebtDto) {
        const debt = await this.createSupplierDebtUseCase.execute(createSupplierDebtDto);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(debt);
    }
    async findAll(filter) {
        const result = await this.listSupplierDebtsUseCase.execute(filter);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(result);
    }
    async findAllDebts() {
        const debts = await this.listSupplierDebtsUseCase.findAll();
        return ApiResponseSchema_1.CoreApiResonseSchema.success(debts);
    }
    async findOverdueDebts() {
        const debts = await this.findOverdueSupplierDebtsUseCase.execute();
        return ApiResponseSchema_1.CoreApiResonseSchema.success(debts);
    }
    async findBySupplier(supplierId) {
        const debts = await this.getSupplierDebtUseCase.findBySupplierId(supplierId);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(debts);
    }
    async findByTransaction(transactionId) {
        const debt = await this.getSupplierDebtUseCase.findByTransactionId(transactionId);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(debt);
    }
    async findOne(id) {
        const debt = await this.getSupplierDebtUseCase.execute(id);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(debt);
    }
    async update(id, updateSupplierDebtDto) {
        const debt = await this.updateSupplierDebtUseCase.execute(id, updateSupplierDebtDto);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(debt);
    }
    async settleDebt(id) {
        const debt = await this.markSupplierDebtSettledUseCase.execute(id);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(debt);
    }
    async markAlertSent(id) {
        const debt = await this.markSupplierDebtAlertSentUseCase.execute(id);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(debt);
    }
    async remove(id) {
        const result = await this.deleteSupplierDebtUseCase.execute(id);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(result);
    }
};
exports.SupplierDebtsController = SupplierDebtsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new supplier debt record' }),
    (0, swagger_1.ApiBody)({ type: create_supplier_debt_dto_1.CreateSupplierDebtDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Supplier debt created successfully',
        type: SupplierDebtResponseSchema_1.SupplierDebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad request - validation error or invalid amount',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized to create debt records',
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_supplier_debt_dto_1.CreateSupplierDebtDto]),
    __metadata("design:returntype", Promise)
], SupplierDebtsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all supplier debts with optional filtering' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier debts retrieved successfully',
        type: PaginatedSupplierDebtResponseSchema_1.PaginatedSupplierDebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supplier_debt_filter_dto_1.SupplierDebtFilterDto]),
    __metadata("design:returntype", Promise)
], SupplierDebtsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all supplier debts without pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'All supplier debts retrieved successfully',
        type: SupplierDebtListResponseSchema_1.SupplierDebtListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupplierDebtsController.prototype, "findAllDebts", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overdue supplier debts' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Overdue supplier debts retrieved successfully',
        type: SupplierDebtListResponseSchema_1.SupplierDebtListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupplierDebtsController.prototype, "findOverdueDebts", null);
__decorate([
    (0, common_1.Get)('supplier/:supplierId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get debts by supplier ID' }),
    (0, swagger_1.ApiParam)({ name: 'supplierId', description: 'Supplier ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier debts retrieved successfully',
        type: SupplierDebtListResponseSchema_1.SupplierDebtListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __param(0, (0, common_1.Param)('supplierId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SupplierDebtsController.prototype, "findBySupplier", null);
__decorate([
    (0, common_1.Get)('transaction/:transactionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get debt by transaction ID' }),
    (0, swagger_1.ApiParam)({
        name: 'transactionId',
        description: 'Transaction ID',
        type: 'number',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier debt retrieved successfully',
        type: SupplierDebtResponseSchema_1.SupplierDebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier debt not found for this transaction',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __param(0, (0, common_1.Param)('transactionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SupplierDebtsController.prototype, "findByTransaction", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a supplier debt by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier Debt ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier debt retrieved successfully',
        type: SupplierDebtResponseSchema_1.SupplierDebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier debt not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SupplierDebtsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update a supplier debt' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier Debt ID', type: 'number' }),
    (0, swagger_1.ApiBody)({ type: update_supplier_debt_dto_1.UpdateSupplierDebtDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier debt updated successfully',
        type: SupplierDebtResponseSchema_1.SupplierDebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier debt not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad request - validation error or invalid amount',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized to update debts',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_supplier_debt_dto_1.UpdateSupplierDebtDto]),
    __metadata("design:returntype", Promise)
], SupplierDebtsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/settle'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a supplier debt as settled' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier Debt ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier debt marked as settled successfully',
        type: SupplierDebtResponseSchema_1.SupplierDebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier debt not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized to update debts',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SupplierDebtsController.prototype, "settleDebt", null);
__decorate([
    (0, common_1.Put)(':id/alert-sent'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a supplier debt alert as sent' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier Debt ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier debt alert marked as sent successfully',
        type: SupplierDebtResponseSchema_1.SupplierDebtResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier debt not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized to update debts',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SupplierDebtsController.prototype, "markAlertSent", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a supplier debt' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier Debt ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier debt deleted successfully',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                data: { type: 'boolean', example: true },
                message: {
                    type: 'string',
                    example: 'Supplier debt deleted successfully',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier debt not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized to delete debts',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SupplierDebtsController.prototype, "remove", null);
exports.SupplierDebtsController = SupplierDebtsController = __decorate([
    (0, swagger_1.ApiTags)('supplier-debts'),
    (0, common_1.Controller)('supplier-debts'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [create_supplier_debt_use_case_1.CreateSupplierDebtUseCase,
        get_supplier_debt_use_case_1.GetSupplierDebtUseCase,
        update_supplier_debt_use_case_1.UpdateSupplierDebtUseCase,
        list_supplier_debts_use_case_1.ListSupplierDebtsUseCase,
        delete_supplier_debt_use_case_1.DeleteSupplierDebtUseCase,
        mark_supplier_debt_settled_use_case_1.MarkSupplierDebtSettledUseCase,
        mark_supplier_debt_alert_sent_use_case_1.MarkSupplierDebtAlertSentUseCase,
        find_overdue_supplier_debts_use_case_1.FindOverdueSupplierDebtsUseCase])
], SupplierDebtsController);
//# sourceMappingURL=supplier-debts.controller.js.map