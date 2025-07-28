import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateCustomerUseCase } from '../use-cases/customer/create-customer.use-case';
import { DeleteCustomerUseCase } from '../use-cases/customer/delete-customer.use-case';
import { GetCustomerUseCase } from '../use-cases/customer/get-customer.use-case';
import { ListCustomersUseCase } from '../use-cases/customer/list-customers.use-case';
import { UpdateCustomerUseCase } from '../use-cases/customer/update-customer.use-case';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { CreateCustomerDto } from '../dtos/customer/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/customer/update-customer.dto';
import { CustomerResponseDto } from '../dtos/customer/customer-response.dto';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from '../dtos/common/pagination.dto';
import { CustomerFilter } from '../../domain/filters/customer.filter';
import { CustomerResponseSchema } from './documentation/customer/ResponseSchema/CustomerResponseSchema';
import { PaginatedCustomerResponseSchema } from './documentation/customer/ResponseSchema/PaginatedCustomerResponseSchema';
import { CustomerListResponseSchema } from './documentation/customer/ResponseSchema/CustomerListResponseSchema';
import { CoreApiResonseSchema } from '../../core/common/schema/ApiResponseSchema';

@Controller('customers')
@ApiTags('customers')
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBody({ type: CreateCustomerDto, description: 'Customer data to create' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Customer created successfully',
    type: CustomerResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid input data or customer with this email/phone already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<ApiResponseDto<CustomerResponseDto>> {
    const customer =
      await this.createCustomerUseCase.execute(createCustomerDto);
    return ApiResponseDto.success(
      new CustomerResponseDto(customer),
      'Customer created successfully',
    );
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of customers with optional filtering' })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by customer name',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    description: 'Filter by phone number',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filter by email address',
  })
  @ApiQuery({
    name: 'address',
    required: false,
    description: 'Filter by customer address',
  })
  @ApiQuery({
    name: 'hasDebt',
    required: false,
    enum: ['true', 'false'],
    description: 'Filter by whether customer has debt',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    enum: ['true', 'false'],
    description: 'Filter by whether customer is active (not deleted)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'phone', 'email', 'address', 'createdAt', 'updatedAt'],
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction (asc or desc)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customers retrieved successfully',
    type: PaginatedCustomerResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getCustomers(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('hasDebt') hasDebt?: string,
    @Query('isActive') isActive?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ): Promise<ApiResponseDto<PaginatedResponseDto<CustomerResponseDto>>> {
    const filter = new CustomerFilter({
      skip: Number(paginationQuery.skip) || 0,
      take: Number(paginationQuery.take) || 10,
      name,
      phone,
      email,
      address,
      hasDebts:
        hasDebt === 'true' ? true : hasDebt === 'false' ? false : undefined,
      isActive:
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    });

    const { customers, total } =
      await this.listCustomersUseCase.execute(filter);

    const customerDtos = customers.map(
      (customer) => new CustomerResponseDto(customer),
    );
    const paginatedResponse = new PaginatedResponseDto<CustomerResponseDto>(
      customerDtos,
      total,
      Number(paginationQuery.skip) || 0,
      Number(paginationQuery.take) || 10,
    );

    return ApiResponseDto.success(
      paginatedResponse,
      'Customers retrieved successfully',
    );
  }

  @Get('all')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all customers without pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All customers retrieved successfully',
    type: CustomerListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getAllCustomers(): Promise<ApiResponseDto<CustomerResponseDto[]>> {
    const customers = await this.listCustomersUseCase.findAll();
    const customerDtos = customers.map(
      (customer) => new CustomerResponseDto(customer),
    );
    return ApiResponseDto.success(
      customerDtos,
      'All customers retrieved successfully',
    );
  }

  @Get('with-debts')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get customers with outstanding debts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customers with debts retrieved successfully',
    type: CustomerListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getCustomersWithDebts(): Promise<
    ApiResponseDto<CustomerResponseDto[]>
  > {
    const customers = await this.getCustomerUseCase.findWithDebts();
    const customerDtos = customers.map(
      (customer) => new CustomerResponseDto(customer),
    );
    return ApiResponseDto.success(
      customerDtos,
      'Customers with debts retrieved successfully',
    );
  }

  @Get('deleted')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get soft-deleted customers with optional filtering and sorting',
  })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by customer name',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    description: 'Filter by phone number',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filter by email address',
  })
  @ApiQuery({
    name: 'address',
    required: false,
    description: 'Filter by customer address',
  })
  @ApiQuery({
    name: 'hasDebt',
    required: false,
    enum: ['true', 'false'],
    description: 'Filter by whether customer has debt',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'phone', 'email', 'address', 'createdAt', 'updatedAt'],
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction (asc or desc)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Soft-deleted customers retrieved successfully',
    type: PaginatedCustomerResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getDeletedCustomers(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('name') name?: string,
    @Query('phone') phone?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('hasDebt') hasDebt?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ): Promise<ApiResponseDto<PaginatedResponseDto<CustomerResponseDto>>> {
    const filter = new CustomerFilter({
      skip: Number(paginationQuery.skip) || 0,
      take: Number(paginationQuery.take) || 10,
      name,
      phone,
      email,
      address,
      hasDebts:
        hasDebt === 'true' ? true : hasDebt === 'false' ? false : undefined,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    });

    const { customers, total } =
      await this.listCustomersUseCase.findDeletedWithFilters(filter);

    const customerDtos = customers.map(
      (customer) => new CustomerResponseDto(customer),
    );
    const paginatedResponse = new PaginatedResponseDto<CustomerResponseDto>(
      customerDtos,
      total,
      Number(paginationQuery.skip) || 0,
      Number(paginationQuery.take) || 10,
    );

    return ApiResponseDto.success(
      paginatedResponse,
      'Soft-deleted customers retrieved successfully',
    );
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Customer ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer retrieved successfully',
    type: CustomerResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getCustomerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<CustomerResponseDto>> {
    const customer = await this.getCustomerUseCase.execute(id);
    return ApiResponseDto.success(
      new CustomerResponseDto(customer),
      'Customer retrieved successfully',
    );
  }

  @Get('email/:email')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a customer by email' })
  @ApiParam({ name: 'email', type: 'string', description: 'Customer email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer retrieved successfully',
    type: CustomerResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getCustomerByEmail(
    @Param('email') email: string,
  ): Promise<ApiResponseDto<CustomerResponseDto>> {
    const customer = await this.getCustomerUseCase.findByEmail(email);
    return ApiResponseDto.success(
      new CustomerResponseDto(customer),
      'Customer retrieved successfully',
    );
  }

  @Get('phone/:phone')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a customer by phone number' })
  @ApiParam({
    name: 'phone',
    type: 'string',
    description: 'Customer phone number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer retrieved successfully',
    type: CustomerResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getCustomerByPhone(
    @Param('phone') phone: string,
  ): Promise<ApiResponseDto<CustomerResponseDto>> {
    const customer = await this.getCustomerUseCase.findByPhone(phone);
    return ApiResponseDto.success(
      new CustomerResponseDto(customer),
      'Customer retrieved successfully',
    );
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', type: 'number', description: 'Customer ID' })
  @ApiBody({ type: UpdateCustomerDto, description: 'Customer data to update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer updated successfully',
    type: CustomerResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Invalid input data or email/phone already in use by another customer',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<ApiResponseDto<CustomerResponseDto>> {
    const customer = await this.updateCustomerUseCase.execute(
      id,
      updateCustomerDto,
    );
    return ApiResponseDto.success(
      new CustomerResponseDto(customer),
      'Customer updated successfully',
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a customer (soft delete - sets isActive to false)',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Customer ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer deleted successfully',
    type: CustomerResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async deleteCustomer(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<boolean>> {
    const deleted = await this.deleteCustomerUseCase.execute(id);
    return ApiResponseDto.success(deleted, 'Customer deleted successfully');
  }

  @Put(':id/restore')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore a soft-deleted customer' })
  @ApiParam({ name: 'id', type: 'number', description: 'Customer ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer restored successfully',
    type: CustomerResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async restoreCustomer(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<CustomerResponseDto>> {
    const customer = await this.updateCustomerUseCase.restore(id);
    return ApiResponseDto.success(
      new CustomerResponseDto(customer),
      'Customer restored successfully',
    );
  }
}
