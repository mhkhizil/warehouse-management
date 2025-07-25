import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { CreateSupplierDto } from '../dtos/supplier/create-supplier.dto';
import { UpdateSupplierDto } from '../dtos/supplier/update-supplier.dto';
import { SupplierFilterDto } from '../dtos/supplier-filter.dto';
import { CreateSupplierUseCase } from '../use-cases/supplier/create-supplier.use-case';
import { GetSupplierUseCase } from '../use-cases/supplier/get-supplier.use-case';
import { UpdateSupplierUseCase } from '../use-cases/supplier/update-supplier.use-case';
import { ListSuppliersUseCase } from '../use-cases/supplier/list-suppliers.use-case';
import { DeleteSupplierUseCase } from '../use-cases/supplier/delete-supplier.use-case';
import { CoreApiResonseSchema } from '../../core/common/schema/ApiResponseSchema';
import { SupplierResponseSchema } from './documentation/supplier/ResponseSchema/SupplierResponseSchema';
import { PaginatedSupplierResponseSchema } from './documentation/supplier/ResponseSchema/PaginatedSupplierResponseSchema';
import { SupplierListResponseSchema } from './documentation/supplier/ResponseSchema/SupplierListResponseSchema';

@ApiTags('suppliers')
@Controller('suppliers')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class SuppliersController {
  constructor(
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly getSupplierUseCase: GetSupplierUseCase,
    private readonly updateSupplierUseCase: UpdateSupplierUseCase,
    private readonly listSuppliersUseCase: ListSuppliersUseCase,
    private readonly deleteSupplierUseCase: DeleteSupplierUseCase,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiBody({ type: CreateSupplierDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Supplier created successfully',
    type: SupplierResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - validation error or duplicate email/phone',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized to create suppliers',
  })
  async create(@Body(ValidationPipe) createSupplierDto: CreateSupplierDto) {
    const supplier =
      await this.createSupplierUseCase.execute(createSupplierDto);
    return CoreApiResonseSchema.success(supplier);
  }

  @Get()
  @ApiOperation({ summary: 'List all suppliers with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Suppliers retrieved successfully',
    type: PaginatedSupplierResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findAll(@Query(ValidationPipe) filter: SupplierFilterDto) {
    const result = await this.listSuppliersUseCase.execute(filter);
    return CoreApiResonseSchema.success(result);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all suppliers without pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All suppliers retrieved successfully',
    type: SupplierListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findAllSuppliers() {
    const suppliers = await this.listSuppliersUseCase.findAll();
    return CoreApiResonseSchema.success(suppliers);
  }

  @Get('with-debts')
  @ApiOperation({ summary: 'Get suppliers with outstanding debts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Suppliers with debts retrieved successfully',
    type: SupplierListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findWithDebts() {
    const suppliers = await this.getSupplierUseCase.findWithDebts();
    return CoreApiResonseSchema.success(suppliers);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get a supplier by email' })
  @ApiParam({ name: 'email', description: 'Supplier email', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier retrieved successfully',
    type: SupplierResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findByEmail(@Param('email') email: string) {
    const supplier = await this.getSupplierUseCase.findByEmail(email);
    return CoreApiResonseSchema.success(supplier);
  }

  @Get('phone/:phone')
  @ApiOperation({ summary: 'Get a supplier by phone' })
  @ApiParam({ name: 'phone', description: 'Supplier phone', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier retrieved successfully',
    type: SupplierResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findByPhone(@Param('phone') phone: string) {
    const supplier = await this.getSupplierUseCase.findByPhone(phone);
    return CoreApiResonseSchema.success(supplier);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a supplier by ID' })
  @ApiParam({ name: 'id', description: 'Supplier ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier retrieved successfully',
    type: SupplierResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const supplier = await this.getSupplierUseCase.execute(id);
    return CoreApiResonseSchema.success(supplier);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a supplier' })
  @ApiParam({ name: 'id', description: 'Supplier ID', type: 'number' })
  @ApiBody({ type: UpdateSupplierDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier updated successfully',
    type: SupplierResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - validation error or duplicate email/phone',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized to update suppliers',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateSupplierDto: UpdateSupplierDto,
  ) {
    const supplier = await this.updateSupplierUseCase.execute(
      id,
      updateSupplierDto,
    );
    return CoreApiResonseSchema.success(supplier);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a supplier (soft delete)' })
  @ApiParam({ name: 'id', description: 'Supplier ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier deleted successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Supplier deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized to delete suppliers',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deleteSupplierUseCase.execute(id);
    return CoreApiResonseSchema.success(result);
  }
}
