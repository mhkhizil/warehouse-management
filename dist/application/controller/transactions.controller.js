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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const swagger_1 = require("@nestjs/swagger");
const api_response_dto_1 = require("../dtos/common/api-response.dto");
const pagination_dto_1 = require("../dtos/common/pagination.dto");
const create_transaction_use_case_1 = require("../use-cases/transaction/create-transaction.use-case");
const delete_transaction_use_case_1 = require("../use-cases/transaction/delete-transaction.use-case");
const get_transaction_use_case_1 = require("../use-cases/transaction/get-transaction.use-case");
const list_transactions_use_case_1 = require("../use-cases/transaction/list-transactions.use-case");
const update_transaction_use_case_1 = require("../use-cases/transaction/update-transaction.use-case");
const get_transaction_report_use_case_1 = require("../use-cases/transaction/get-transaction-report.use-case");
const create_transaction_dto_1 = require("../dtos/transaction/create-transaction.dto");
const update_transaction_dto_1 = require("../dtos/transaction/update-transaction.dto");
const transaction_response_dto_1 = require("../dtos/transaction/transaction-response.dto");
const transaction_filter_1 = require("../../domain/filters/transaction.filter");
const client_1 = require("@prisma/client");
const TransactionResponseSchema_1 = require("./documentation/transaction/ResponseSchema/TransactionResponseSchema");
const PaginatedTransactionResponseSchema_1 = require("./documentation/transaction/ResponseSchema/PaginatedTransactionResponseSchema");
const TransactionListResponseSchema_1 = require("./documentation/transaction/ResponseSchema/TransactionListResponseSchema");
const TransactionReportResponseSchema_1 = require("./documentation/transaction/ResponseSchema/TransactionReportResponseSchema");
const ApiResponseSchema_1 = require("../../core/common/schema/ApiResponseSchema");
const buy_from_supplier_use_case_1 = require("../use-cases/transaction/buy-from-supplier.use-case");
const admin_guard_1 = require("../auth/guard/admin.guard");
const BuyFromSupplierRequestSchema_1 = require("./documentation/transaction/RequestSchema/BuyFromSupplierRequestSchema");
let TransactionsController = class TransactionsController {
    constructor(createTransactionUseCase, deleteTransactionUseCase, getTransactionUseCase, listTransactionsUseCase, updateTransactionUseCase, getTransactionReportUseCase, buyFromSupplierUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
        this.deleteTransactionUseCase = deleteTransactionUseCase;
        this.getTransactionUseCase = getTransactionUseCase;
        this.listTransactionsUseCase = listTransactionsUseCase;
        this.updateTransactionUseCase = updateTransactionUseCase;
        this.getTransactionReportUseCase = getTransactionReportUseCase;
        this.buyFromSupplierUseCase = buyFromSupplierUseCase;
    }
    async createTransaction(createTransactionDto) {
        const transaction = await this.createTransactionUseCase.execute(createTransactionDto);
        return api_response_dto_1.ApiResponseDto.success(new transaction_response_dto_1.TransactionResponseDto(transaction), 'Transaction created successfully');
    }
    async getTransactions(paginationQuery, type, itemId, customerId, stockId, startDate, endDate, minAmount, maxAmount) {
        const filter = new transaction_filter_1.TransactionFilter({
            skip: paginationQuery.skip,
            take: paginationQuery.take,
            type: type ? type : undefined,
            itemId: itemId ? parseInt(itemId, 10) : undefined,
            customerId: customerId ? parseInt(customerId, 10) : undefined,
            stockId: stockId ? parseInt(stockId, 10) : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            minAmount: minAmount ? parseFloat(minAmount) : undefined,
            maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
        });
        const { transactions, total } = await this.listTransactionsUseCase.execute(filter);
        const paginatedResponse = new pagination_dto_1.PaginatedResponseDto(transactions.map((transaction) => new transaction_response_dto_1.TransactionResponseDto(transaction)), total, filter.skip, filter.take);
        return api_response_dto_1.ApiResponseDto.success(paginatedResponse, 'Transactions retrieved successfully');
    }
    async getAllTransactions() {
        const transactions = await this.listTransactionsUseCase.findAll();
        return api_response_dto_1.ApiResponseDto.success(transactions.map((transaction) => new transaction_response_dto_1.TransactionResponseDto(transaction)), 'All transactions retrieved successfully');
    }
    async getSalesReport(startDate, endDate) {
        const report = await this.getTransactionReportUseCase.getSalesReport(new Date(startDate || new Date().setMonth(new Date().getMonth() - 1)), new Date(endDate || new Date()));
        return api_response_dto_1.ApiResponseDto.success({
            totalSales: report.totalSales,
            transactions: report.transactions.map((transaction) => new transaction_response_dto_1.TransactionResponseDto(transaction)),
        }, 'Sales report generated successfully');
    }
    async getPurchasesReport(startDate, endDate) {
        const report = await this.getTransactionReportUseCase.getPurchaseReport(new Date(startDate || new Date().setMonth(new Date().getMonth() - 1)), new Date(endDate || new Date()));
        return api_response_dto_1.ApiResponseDto.success({
            totalPurchases: report.totalPurchases,
            transactions: report.transactions.map((transaction) => new transaction_response_dto_1.TransactionResponseDto(transaction)),
        }, 'Purchases report generated successfully');
    }
    async getTransactionsByCustomer(customerId) {
        const transactions = await this.getTransactionUseCase.findByCustomerId(customerId);
        return api_response_dto_1.ApiResponseDto.success(transactions.map((transaction) => new transaction_response_dto_1.TransactionResponseDto(transaction)), 'Transactions retrieved successfully');
    }
    async getTransactionsByItem(itemId) {
        const transactions = await this.getTransactionUseCase.findByItemId(itemId);
        return api_response_dto_1.ApiResponseDto.success(transactions.map((transaction) => new transaction_response_dto_1.TransactionResponseDto(transaction)), 'Transactions retrieved successfully');
    }
    async getTransactionById(id) {
        const transaction = await this.getTransactionUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(new transaction_response_dto_1.TransactionResponseDto(transaction), 'Transaction retrieved successfully');
    }
    async updateTransaction(id, updateTransactionDto) {
        const transaction = await this.updateTransactionUseCase.execute(id, updateTransactionDto);
        return api_response_dto_1.ApiResponseDto.success(new transaction_response_dto_1.TransactionResponseDto(transaction), 'Transaction updated successfully');
    }
    async deleteTransaction(id) {
        const deleted = await this.deleteTransactionUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(deleted, 'Transaction deleted successfully');
    }
    async buyFromSupplier(buyFromSupplierDto) {
        const transaction = await this.buyFromSupplierUseCase.execute(buyFromSupplierDto);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(transaction);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new transaction' }),
    (0, swagger_1.ApiBody)({
        type: create_transaction_dto_1.CreateTransactionDto,
        description: 'Transaction data to create',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Transaction created successfully',
        type: TransactionResponseSchema_1.TransactionResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "createTransaction", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get transactions with optional filtering' }),
    (0, swagger_1.ApiQuery)({ type: pagination_dto_1.PaginationQueryDto, required: false }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: client_1.TransactionType,
        description: 'Filter by transaction type',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'itemId',
        required: false,
        description: 'Filter by item ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'customerId',
        required: false,
        description: 'Filter by customer ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'stockId',
        required: false,
        description: 'Filter by stock ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Filter by start date',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'Filter by end date',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minAmount',
        required: false,
        description: 'Filter by minimum amount',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'maxAmount',
        required: false,
        description: 'Filter by maximum amount',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Transactions retrieved successfully',
        type: PaginatedTransactionResponseSchema_1.PaginatedTransactionResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('itemId')),
    __param(3, (0, common_1.Query)('customerId')),
    __param(4, (0, common_1.Query)('stockId')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __param(7, (0, common_1.Query)('minAmount')),
    __param(8, (0, common_1.Query)('maxAmount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all transactions without pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'All transactions retrieved successfully',
        type: TransactionListResponseSchema_1.TransactionListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getAllTransactions", null);
__decorate([
    (0, common_1.Get)('reports/sales'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get sales report for a date range' }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date for report period',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date for report period',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Sales report generated successfully',
        type: TransactionReportResponseSchema_1.TransactionReportResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getSalesReport", null);
__decorate([
    (0, common_1.Get)('reports/purchases'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get purchases report for a date range' }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date for report period',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date for report period',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Purchases report generated successfully',
        type: TransactionReportResponseSchema_1.TransactionReportResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getPurchasesReport", null);
__decorate([
    (0, common_1.Get)('customer/:customerId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get transactions by customer ID' }),
    (0, swagger_1.ApiParam)({ name: 'customerId', type: 'number', description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Transactions retrieved successfully',
        type: TransactionListResponseSchema_1.TransactionListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('customerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactionsByCustomer", null);
__decorate([
    (0, common_1.Get)('item/:itemId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get transactions by item ID' }),
    (0, swagger_1.ApiParam)({ name: 'itemId', type: 'number', description: 'Item ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Transactions retrieved successfully',
        type: TransactionListResponseSchema_1.TransactionListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('itemId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactionsByItem", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Transaction ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Transaction retrieved successfully',
        type: TransactionResponseSchema_1.TransactionResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Transaction not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactionById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update a transaction' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Transaction ID' }),
    (0, swagger_1.ApiBody)({
        type: update_transaction_dto_1.UpdateTransactionDto,
        description: 'Transaction data to update',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Transaction updated successfully',
        type: TransactionResponseSchema_1.TransactionResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Transaction not found',
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
    __metadata("design:paramtypes", [Number, update_transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "updateTransaction", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a transaction' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Transaction ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Transaction deleted successfully',
        type: TransactionResponseSchema_1.TransactionResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Transaction not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "deleteTransaction", null);
__decorate([
    (0, common_1.Post)('buy-from-supplier'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Buy items from a supplier and update stock' }),
    (0, swagger_1.ApiBody)({
        type: BuyFromSupplierRequestSchema_1.BuyFromSupplierRequestSchema,
        description: 'Data for buying items from a supplier',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Items purchased successfully and stock updated',
        type: TransactionResponseSchema_1.TransactionResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data or validation error',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier or item not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized to purchase from suppliers',
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "buyFromSupplier", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('Transactions'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('transactions'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [create_transaction_use_case_1.CreateTransactionUseCase,
        delete_transaction_use_case_1.DeleteTransactionUseCase,
        get_transaction_use_case_1.GetTransactionUseCase,
        list_transactions_use_case_1.ListTransactionsUseCase,
        update_transaction_use_case_1.UpdateTransactionUseCase,
        get_transaction_report_use_case_1.GetTransactionReportUseCase,
        buy_from_supplier_use_case_1.BuyFromSupplierUseCase])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map