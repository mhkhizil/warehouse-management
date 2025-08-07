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
import { CreateSupplierDebtDto } from '../dtos/supplier-debt/create-supplier-debt.dto';
import { UpdateSupplierDebtDto } from '../dtos/supplier-debt/update-supplier-debt.dto';
import { SupplierDebtFilterDto } from '../dtos/supplier-debt-filter.dto';
import { CreateSupplierDebtUseCase } from '../use-cases/supplier-debt/create-supplier-debt.use-case';
import { GetSupplierDebtUseCase } from '../use-cases/supplier-debt/get-supplier-debt.use-case';
import { UpdateSupplierDebtUseCase } from '../use-cases/supplier-debt/update-supplier-debt.use-case';
import { ListSupplierDebtsUseCase } from '../use-cases/supplier-debt/list-supplier-debts.use-case';
import { DeleteSupplierDebtUseCase } from '../use-cases/supplier-debt/delete-supplier-debt.use-case';
import { MarkSupplierDebtSettledUseCase } from '../use-cases/supplier-debt/mark-supplier-debt-settled.use-case';
import { MarkSupplierDebtAlertSentUseCase } from '../use-cases/supplier-debt/mark-supplier-debt-alert-sent.use-case';
import { FindOverdueSupplierDebtsUseCase } from '../use-cases/supplier-debt/find-overdue-supplier-debts.use-case';
import { CoreApiResonseSchema } from '../../core/common/schema/ApiResponseSchema';
import { SupplierDebtResponseSchema } from './documentation/supplier-debt/ResponseSchema/SupplierDebtResponseSchema';
import { PaginatedSupplierDebtResponseSchema } from './documentation/supplier-debt/ResponseSchema/PaginatedSupplierDebtResponseSchema';
import { SupplierDebtListResponseSchema } from './documentation/supplier-debt/ResponseSchema/SupplierDebtListResponseSchema';

@ApiTags('supplier-debts')
@Controller('supplier-debts')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class SupplierDebtsController {
  constructor(
    private readonly createSupplierDebtUseCase: CreateSupplierDebtUseCase,
    private readonly getSupplierDebtUseCase: GetSupplierDebtUseCase,
    private readonly updateSupplierDebtUseCase: UpdateSupplierDebtUseCase,
    private readonly listSupplierDebtsUseCase: ListSupplierDebtsUseCase,
    private readonly deleteSupplierDebtUseCase: DeleteSupplierDebtUseCase,
    private readonly markSupplierDebtSettledUseCase: MarkSupplierDebtSettledUseCase,
    private readonly markSupplierDebtAlertSentUseCase: MarkSupplierDebtAlertSentUseCase,
    private readonly findOverdueSupplierDebtsUseCase: FindOverdueSupplierDebtsUseCase,
  ) {}

  @Post()
  @UseGuards( JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new supplier debt record' })
  @ApiBody({ type: CreateSupplierDebtDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Supplier debt created successfully',
    type: SupplierDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - validation error or invalid amount',
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
    description: 'User not authorized to create debt records',
  })
  async create(
    @Body(ValidationPipe) createSupplierDebtDto: CreateSupplierDebtDto,
  ) {
    const debt = await this.createSupplierDebtUseCase.execute(
      createSupplierDebtDto,
    );
    return CoreApiResonseSchema.success(debt);
  }

  @Get()
  @UseGuards( JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all supplier debts with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier debts retrieved successfully',
    type: PaginatedSupplierDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findAll(@Query(ValidationPipe) filter: SupplierDebtFilterDto) {
    const result = await this.listSupplierDebtsUseCase.execute(filter);
    return CoreApiResonseSchema.success(result);
  }

  @Get('all')
  @UseGuards( JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all supplier debts without pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All supplier debts retrieved successfully',
    type: SupplierDebtListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findAllDebts() {
    const debts = await this.listSupplierDebtsUseCase.findAll();
    return CoreApiResonseSchema.success(debts);
  }

  @Get('overdue')
  @UseGuards( JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get overdue supplier debts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Overdue supplier debts retrieved successfully',
    type: SupplierDebtListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findOverdueDebts() {
    const debts = await this.findOverdueSupplierDebtsUseCase.execute();
    return CoreApiResonseSchema.success(debts);
  }

  @Get('supplier/:supplierId')
  @UseGuards( JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get debts by supplier ID' })
  @ApiParam({ name: 'supplierId', description: 'Supplier ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier debts retrieved successfully',
    type: SupplierDebtListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findBySupplier(@Param('supplierId', ParseIntPipe) supplierId: number) {
    const debts =
      await this.getSupplierDebtUseCase.findBySupplierId(supplierId);
    return CoreApiResonseSchema.success(debts);
  }

  @Get('transaction/:transactionId')
  @UseGuards( JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get debt by transaction ID' })
  @ApiParam({
    name: 'transactionId',
    description: 'Transaction ID',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier debt retrieved successfully',
    type: SupplierDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier debt not found for this transaction',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findByTransaction(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ) {
    const debt =
      await this.getSupplierDebtUseCase.findByTransactionId(transactionId);
    return CoreApiResonseSchema.success(debt);
  }

  @Get(':id')
  @UseGuards( JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a supplier debt by ID' })
  @ApiParam({ name: 'id', description: 'Supplier Debt ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier debt retrieved successfully',
    type: SupplierDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier debt not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const debt = await this.getSupplierDebtUseCase.execute(id);
    return CoreApiResonseSchema.success(debt);
  }

  @Put(':id')
  @UseGuards( JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a supplier debt' })
  @ApiParam({ name: 'id', description: 'Supplier Debt ID', type: 'number' })
  @ApiBody({ type: UpdateSupplierDebtDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier debt updated successfully',
    type: SupplierDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier debt not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - validation error or invalid amount',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized to update debts',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateSupplierDebtDto: UpdateSupplierDebtDto,
  ) {
    const debt = await this.updateSupplierDebtUseCase.execute(
      id,
      updateSupplierDebtDto,
    );
    return CoreApiResonseSchema.success(debt);
  }

  @Put(':id/settle')
  @UseGuards( JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a supplier debt as settled' })
  @ApiParam({ name: 'id', description: 'Supplier Debt ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier debt marked as settled successfully',
    type: SupplierDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier debt not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized to update debts',
  })
  async settleDebt(@Param('id', ParseIntPipe) id: number) {
    const debt = await this.markSupplierDebtSettledUseCase.execute(id);
    return CoreApiResonseSchema.success(debt);
  }

  @Put(':id/alert-sent')
  @UseGuards( JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a supplier debt alert as sent' })
  @ApiParam({ name: 'id', description: 'Supplier Debt ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Supplier debt alert marked as sent successfully',
    type: SupplierDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier debt not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized to update debts',
  })
  async markAlertSent(@Param('id', ParseIntPipe) id: number) {
    const debt = await this.markSupplierDebtAlertSentUseCase.execute(id);
    return CoreApiResonseSchema.success(debt);
  }

  @Delete(':id')
  @UseGuards( JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a supplier debt' })
  @ApiParam({ name: 'id', description: 'Supplier Debt ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
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
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier debt not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized to delete debts',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.deleteSupplierDebtUseCase.execute(id);
    return CoreApiResonseSchema.success(result);
  }
}
