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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const create_customer_use_case_1 = require("../use-cases/customer/create-customer.use-case");
const delete_customer_use_case_1 = require("../use-cases/customer/delete-customer.use-case");
const get_customer_use_case_1 = require("../use-cases/customer/get-customer.use-case");
const list_customers_use_case_1 = require("../use-cases/customer/list-customers.use-case");
const update_customer_use_case_1 = require("../use-cases/customer/update-customer.use-case");
const api_response_dto_1 = require("../dtos/common/api-response.dto");
const create_customer_dto_1 = require("../dtos/customer/create-customer.dto");
const update_customer_dto_1 = require("../dtos/customer/update-customer.dto");
const customer_response_dto_1 = require("../dtos/customer/customer-response.dto");
const pagination_dto_1 = require("../dtos/common/pagination.dto");
const customer_filter_1 = require("../../domain/filters/customer.filter");
const CustomerResponseSchema_1 = require("./documentation/customer/ResponseSchema/CustomerResponseSchema");
const PaginatedCustomerResponseSchema_1 = require("./documentation/customer/ResponseSchema/PaginatedCustomerResponseSchema");
const CustomerListResponseSchema_1 = require("./documentation/customer/ResponseSchema/CustomerListResponseSchema");
let CustomersController = class CustomersController {
    constructor(createCustomerUseCase, deleteCustomerUseCase, getCustomerUseCase, listCustomersUseCase, updateCustomerUseCase) {
        this.createCustomerUseCase = createCustomerUseCase;
        this.deleteCustomerUseCase = deleteCustomerUseCase;
        this.getCustomerUseCase = getCustomerUseCase;
        this.listCustomersUseCase = listCustomersUseCase;
        this.updateCustomerUseCase = updateCustomerUseCase;
    }
    async createCustomer(createCustomerDto) {
        const customer = await this.createCustomerUseCase.execute(createCustomerDto);
        return api_response_dto_1.ApiResponseDto.success(new customer_response_dto_1.CustomerResponseDto(customer), 'Customer created successfully');
    }
    async getCustomers(paginationQuery, name, phone, email, hasDebt) {
        const filter = new customer_filter_1.CustomerFilter({
            skip: paginationQuery.skip,
            take: paginationQuery.take,
            name,
            phone,
            email,
            hasDebts: hasDebt === 'true' ? true : hasDebt === 'false' ? false : undefined,
        });
        const { customers, total } = await this.listCustomersUseCase.execute(filter);
        const customerDtos = customers.map((customer) => new customer_response_dto_1.CustomerResponseDto(customer));
        const paginatedResponse = new pagination_dto_1.PaginatedResponseDto(customerDtos, total, paginationQuery.skip, paginationQuery.take);
        return api_response_dto_1.ApiResponseDto.success(paginatedResponse, 'Customers retrieved successfully');
    }
    async getAllCustomers() {
        const customers = await this.listCustomersUseCase.findAll();
        const customerDtos = customers.map((customer) => new customer_response_dto_1.CustomerResponseDto(customer));
        return api_response_dto_1.ApiResponseDto.success(customerDtos, 'All customers retrieved successfully');
    }
    async getCustomersWithDebts() {
        const customers = await this.getCustomerUseCase.findWithDebts();
        const customerDtos = customers.map((customer) => new customer_response_dto_1.CustomerResponseDto(customer));
        return api_response_dto_1.ApiResponseDto.success(customerDtos, 'Customers with debts retrieved successfully');
    }
    async getCustomerById(id) {
        const customer = await this.getCustomerUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(new customer_response_dto_1.CustomerResponseDto(customer), 'Customer retrieved successfully');
    }
    async getCustomerByEmail(email) {
        const customer = await this.getCustomerUseCase.findByEmail(email);
        return api_response_dto_1.ApiResponseDto.success(new customer_response_dto_1.CustomerResponseDto(customer), 'Customer retrieved successfully');
    }
    async getCustomerByPhone(phone) {
        const customer = await this.getCustomerUseCase.findByPhone(phone);
        return api_response_dto_1.ApiResponseDto.success(new customer_response_dto_1.CustomerResponseDto(customer), 'Customer retrieved successfully');
    }
    async updateCustomer(id, updateCustomerDto) {
        const customer = await this.updateCustomerUseCase.execute(id, updateCustomerDto);
        return api_response_dto_1.ApiResponseDto.success(new customer_response_dto_1.CustomerResponseDto(customer), 'Customer updated successfully');
    }
    async deleteCustomer(id) {
        const deleted = await this.deleteCustomerUseCase.execute(id);
        return api_response_dto_1.ApiResponseDto.success(deleted, 'Customer deleted successfully');
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new customer' }),
    (0, swagger_1.ApiBody)({ type: create_customer_dto_1.CreateCustomerDto, description: 'Customer data to create' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Customer created successfully',
        type: CustomerResponseSchema_1.CustomerResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data or customer with this email/phone already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "createCustomer", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a list of customers with optional filtering' }),
    (0, swagger_1.ApiQuery)({ type: pagination_dto_1.PaginationQueryDto, required: false }),
    (0, swagger_1.ApiQuery)({
        name: 'name',
        required: false,
        description: 'Filter by customer name',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'phone',
        required: false,
        description: 'Filter by phone number',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'email',
        required: false,
        description: 'Filter by email address',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'hasDebt',
        required: false,
        enum: ['true', 'false'],
        description: 'Filter by whether customer has debt',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Customers retrieved successfully',
        type: PaginatedCustomerResponseSchema_1.PaginatedCustomerResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('name')),
    __param(2, (0, common_1.Query)('phone')),
    __param(3, (0, common_1.Query)('email')),
    __param(4, (0, common_1.Query)('hasDebt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQueryDto, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomers", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all customers without pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'All customers retrieved successfully',
        type: CustomerListResponseSchema_1.CustomerListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getAllCustomers", null);
__decorate([
    (0, common_1.Get)('with-debts'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get customers with outstanding debts' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Customers with debts retrieved successfully',
        type: CustomerListResponseSchema_1.CustomerListResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomersWithDebts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a customer by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Customer retrieved successfully',
        type: CustomerResponseSchema_1.CustomerResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Customer not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomerById", null);
__decorate([
    (0, common_1.Get)('email/:email'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a customer by email' }),
    (0, swagger_1.ApiParam)({ name: 'email', type: 'string', description: 'Customer email' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Customer retrieved successfully',
        type: CustomerResponseSchema_1.CustomerResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Customer not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomerByEmail", null);
__decorate([
    (0, common_1.Get)('phone/:phone'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a customer by phone number' }),
    (0, swagger_1.ApiParam)({
        name: 'phone',
        type: 'string',
        description: 'Customer phone number',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Customer retrieved successfully',
        type: CustomerResponseSchema_1.CustomerResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Customer not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomerByPhone", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a customer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Customer ID' }),
    (0, swagger_1.ApiBody)({ type: update_customer_dto_1.UpdateCustomerDto, description: 'Customer data to update' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Customer updated successfully',
        type: CustomerResponseSchema_1.CustomerResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Customer not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data or email/phone already in use by another customer',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateCustomer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a customer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Customer ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Customer deleted successfully',
        type: CustomerResponseSchema_1.CustomerResponseSchema,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Customer not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized access',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "deleteCustomer", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.Controller)('customers'),
    (0, swagger_1.ApiTags)('customers'),
    __metadata("design:paramtypes", [create_customer_use_case_1.CreateCustomerUseCase,
        delete_customer_use_case_1.DeleteCustomerUseCase,
        get_customer_use_case_1.GetCustomerUseCase,
        list_customers_use_case_1.ListCustomersUseCase,
        update_customer_use_case_1.UpdateCustomerUseCase])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map