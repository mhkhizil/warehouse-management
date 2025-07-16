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
exports.SuppliersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const admin_guard_1 = require("../auth/guard/admin.guard");
const create_supplier_dto_1 = require("../dtos/supplier/create-supplier.dto");
const update_supplier_dto_1 = require("../dtos/supplier/update-supplier.dto");
const supplier_filter_dto_1 = require("../dtos/supplier-filter.dto");
const create_supplier_use_case_1 = require("../use-cases/supplier/create-supplier.use-case");
const get_supplier_use_case_1 = require("../use-cases/supplier/get-supplier.use-case");
const update_supplier_use_case_1 = require("../use-cases/supplier/update-supplier.use-case");
const list_suppliers_use_case_1 = require("../use-cases/supplier/list-suppliers.use-case");
const delete_supplier_use_case_1 = require("../use-cases/supplier/delete-supplier.use-case");
const ApiResponseSchema_1 = require("../../core/common/schema/ApiResponseSchema");
const SupplierResponseSchema_1 = require("./documentation/supplier/ResponseSchema/SupplierResponseSchema");
const PaginatedSupplierResponseSchema_1 = require("./documentation/supplier/ResponseSchema/PaginatedSupplierResponseSchema");
const SupplierListResponseSchema_1 = require("./documentation/supplier/ResponseSchema/SupplierListResponseSchema");
let SuppliersController = class SuppliersController {
    constructor(createSupplierUseCase, getSupplierUseCase, updateSupplierUseCase, listSuppliersUseCase, deleteSupplierUseCase) {
        this.createSupplierUseCase = createSupplierUseCase;
        this.getSupplierUseCase = getSupplierUseCase;
        this.updateSupplierUseCase = updateSupplierUseCase;
        this.listSuppliersUseCase = listSuppliersUseCase;
        this.deleteSupplierUseCase = deleteSupplierUseCase;
    }
    async create(createSupplierDto) {
        const supplier = await this.createSupplierUseCase.execute(createSupplierDto);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(supplier);
    }
    async findAll(filter) {
        const result = await this.listSuppliersUseCase.execute(filter);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(result);
    }
    async findAllSuppliers() {
        const suppliers = await this.listSuppliersUseCase.findAll();
        return ApiResponseSchema_1.CoreApiResonseSchema.success(suppliers);
    }
    async findWithDebts() {
        const suppliers = await this.getSupplierUseCase.findWithDebts();
        return ApiResponseSchema_1.CoreApiResonseSchema.success(suppliers);
    }
    async findByEmail(email) {
        const supplier = await this.getSupplierUseCase.findByEmail(email);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(supplier);
    }
    async findByPhone(phone) {
        const supplier = await this.getSupplierUseCase.findByPhone(phone);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(supplier);
    }
    async findOne(id) {
        const supplier = await this.getSupplierUseCase.execute(id);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(supplier);
    }
    async update(id, updateSupplierDto) {
        const supplier = await this.updateSupplierUseCase.execute(id, updateSupplierDto);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(supplier);
    }
    async remove(id) {
        const result = await this.deleteSupplierUseCase.execute(id);
        return ApiResponseSchema_1.CoreApiResonseSchema.success(result);
    }
};
exports.SuppliersController = SuppliersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new supplier' }),
    (0, swagger_1.ApiBody)({ type: create_supplier_dto_1.CreateSupplierDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Supplier created successfully',
        type: SupplierResponseSchema_1.SupplierResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad request - validation error or duplicate email/phone',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized to create suppliers',
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_supplier_dto_1.CreateSupplierDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all suppliers with optional filtering' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Suppliers retrieved successfully',
        type: PaginatedSupplierResponseSchema_1.PaginatedSupplierResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __param(0, (0, common_1.Query)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supplier_filter_dto_1.SupplierFilterDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all suppliers without pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'All suppliers retrieved successfully',
        type: SupplierListResponseSchema_1.SupplierListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findAllSuppliers", null);
__decorate([
    (0, common_1.Get)('with-debts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get suppliers with outstanding debts' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Suppliers with debts retrieved successfully',
        type: SupplierListResponseSchema_1.SupplierListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findWithDebts", null);
__decorate([
    (0, common_1.Get)('email/:email'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a supplier by email' }),
    (0, swagger_1.ApiParam)({ name: 'email', description: 'Supplier email', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier retrieved successfully',
        type: SupplierResponseSchema_1.SupplierResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Get)('phone/:phone'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a supplier by phone' }),
    (0, swagger_1.ApiParam)({ name: 'phone', description: 'Supplier phone', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier retrieved successfully',
        type: SupplierResponseSchema_1.SupplierResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findByPhone", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a supplier by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier retrieved successfully',
        type: SupplierResponseSchema_1.SupplierResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update a supplier' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier ID', type: 'number' }),
    (0, swagger_1.ApiBody)({ type: update_supplier_dto_1.UpdateSupplierDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier updated successfully',
        type: SupplierResponseSchema_1.SupplierResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Supplier not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Bad request - validation error or duplicate email/phone',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'User not authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'User not authorized to update suppliers',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_supplier_dto_1.UpdateSupplierDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a supplier (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Supplier ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Supplier deleted successfully',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                data: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Supplier deleted successfully' },
            },
        },
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
        description: 'User not authorized to delete suppliers',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "remove", null);
exports.SuppliersController = SuppliersController = __decorate([
    (0, swagger_1.ApiTags)('suppliers'),
    (0, common_1.Controller)('suppliers'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [create_supplier_use_case_1.CreateSupplierUseCase,
        get_supplier_use_case_1.GetSupplierUseCase,
        update_supplier_use_case_1.UpdateSupplierUseCase,
        list_suppliers_use_case_1.ListSuppliersUseCase,
        delete_supplier_use_case_1.DeleteSupplierUseCase])
], SuppliersController);
//# sourceMappingURL=suppliers.controller.js.map