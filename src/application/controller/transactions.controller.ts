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
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from '../dtos/common/pagination.dto';
import { CreateTransactionUseCase } from '../use-cases/transaction/create-transaction.use-case';
import { DeleteTransactionUseCase } from '../use-cases/transaction/delete-transaction.use-case';
import { GetTransactionUseCase } from '../use-cases/transaction/get-transaction.use-case';
import { ListTransactionsUseCase } from '../use-cases/transaction/list-transactions.use-case';
import { UpdateTransactionUseCase } from '../use-cases/transaction/update-transaction.use-case';
import { GetTransactionReportUseCase } from '../use-cases/transaction/get-transaction-report.use-case';
import { CreateTransactionDto } from '../dtos/transaction/create-transaction.dto';
import { UpdateTransactionDto } from '../dtos/transaction/update-transaction.dto';
import { TransactionResponseDto } from '../dtos/transaction/transaction-response.dto';
import { TransactionFilter } from '../../domain/filters/transaction.filter';
import { TransactionType } from '@prisma/client';
import { TransactionResponseSchema } from './documentation/transaction/ResponseSchema/TransactionResponseSchema';
import { PaginatedTransactionResponseSchema } from './documentation/transaction/ResponseSchema/PaginatedTransactionResponseSchema';
import { TransactionListResponseSchema } from './documentation/transaction/ResponseSchema/TransactionListResponseSchema';
import { TransactionReportResponseSchema } from './documentation/transaction/ResponseSchema/TransactionReportResponseSchema';
import { CoreApiResonseSchema } from '../../core/common/schema/ApiResponseSchema';

@ApiTags('Transactions')
@UseGuards(JwtGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
    private readonly listTransactionsUseCase: ListTransactionsUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly getTransactionReportUseCase: GetTransactionReportUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto, description: 'Transaction data to create' })
  @ApiResponse({ 
    status: HttpStatus.CREATED,
    description: 'Transaction created successfully',
    type: TransactionResponseSchema 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<ApiResponseDto<TransactionResponseDto>> {
    const transaction =
      await this.createTransactionUseCase.execute(createTransactionDto);
    return ApiResponseDto.success(
      new TransactionResponseDto(transaction),
      'Transaction created successfully'
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get transactions with optional filtering' })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  @ApiQuery({ name: 'type', required: false, enum: TransactionType, description: 'Filter by transaction type' })
  @ApiQuery({ name: 'itemId', required: false, description: 'Filter by item ID' })
  @ApiQuery({ name: 'customerId', required: false, description: 'Filter by customer ID' })
  @ApiQuery({ name: 'stockId', required: false, description: 'Filter by stock ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date' })
  @ApiQuery({ name: 'minAmount', required: false, description: 'Filter by minimum amount' })
  @ApiQuery({ name: 'maxAmount', required: false, description: 'Filter by maximum amount' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transactions retrieved successfully',
    type: PaginatedTransactionResponseSchema
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getTransactions(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('type') type?: string,
    @Query('itemId') itemId?: string,
    @Query('customerId') customerId?: string,
    @Query('stockId') stockId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('minAmount') minAmount?: string,
    @Query('maxAmount') maxAmount?: string,
  ): Promise<ApiResponseDto<PaginatedResponseDto<TransactionResponseDto>>> {
    const filter = new TransactionFilter({
      skip: paginationQuery.skip,
      take: paginationQuery.take,
      type: type ? (type as TransactionType) : undefined,
      itemId: itemId ? parseInt(itemId, 10) : undefined,
      customerId: customerId ? parseInt(customerId, 10) : undefined,
      stockId: stockId ? parseInt(stockId, 10) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      minAmount: minAmount ? parseFloat(minAmount) : undefined,
      maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
    });

    const { transactions, total } =
      await this.listTransactionsUseCase.execute(filter);

    const paginatedResponse = new PaginatedResponseDto<TransactionResponseDto>(
      transactions.map(
        (transaction) => new TransactionResponseDto(transaction),
      ),
      total,
      filter.skip,
      filter.take,
    );

    return ApiResponseDto.success(
      paginatedResponse,
      'Transactions retrieved successfully'
    );
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all transactions without pagination' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'All transactions retrieved successfully',
    type: TransactionListResponseSchema 
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getAllTransactions(): Promise<
    ApiResponseDto<TransactionResponseDto[]>
  > {
    const transactions = await this.listTransactionsUseCase.findAll();
    return ApiResponseDto.success(
      transactions.map(
        (transaction) => new TransactionResponseDto(transaction),
      ),
      'All transactions retrieved successfully'
    );
  }

  @Get('reports/sales')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get sales report for a date range' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for report period' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for report period' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Sales report generated successfully',
    type: TransactionReportResponseSchema 
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getSalesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ApiResponseDto<any>> {
    const report = await this.getTransactionReportUseCase.getSalesReport(
      new Date(startDate || new Date().setMonth(new Date().getMonth() - 1)),
      new Date(endDate || new Date()),
    );

    return ApiResponseDto.success({
      totalSales: report.totalSales,
      transactions: report.transactions.map(
        (transaction) => new TransactionResponseDto(transaction),
      ),
    }, 'Sales report generated successfully');
  }

  @Get('reports/purchases')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get purchases report for a date range' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for report period' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for report period' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Purchases report generated successfully',
    type: TransactionReportResponseSchema 
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getPurchasesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ApiResponseDto<any>> {
    const report = await this.getTransactionReportUseCase.getPurchaseReport(
      new Date(startDate || new Date().setMonth(new Date().getMonth() - 1)),
      new Date(endDate || new Date()),
    );

    return ApiResponseDto.success({
      totalPurchases: report.totalPurchases,
      transactions: report.transactions.map(
        (transaction) => new TransactionResponseDto(transaction),
      ),
    }, 'Purchases report generated successfully');
  }

  @Get('customer/:customerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get transactions by customer ID' })
  @ApiParam({ name: 'customerId', type: 'number', description: 'Customer ID' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Transactions retrieved successfully',
    type: TransactionListResponseSchema 
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getTransactionsByCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<ApiResponseDto<TransactionResponseDto[]>> {
    const transactions =
      await this.getTransactionUseCase.findByCustomerId(customerId);
    return ApiResponseDto.success(
      transactions.map(
        (transaction) => new TransactionResponseDto(transaction),
      ),
      'Transactions retrieved successfully'
    );
  }

  @Get('item/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get transactions by item ID' })
  @ApiParam({ name: 'itemId', type: 'number', description: 'Item ID' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Transactions retrieved successfully',
    type: TransactionListResponseSchema 
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getTransactionsByItem(
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<ApiResponseDto<TransactionResponseDto[]>> {
    const transactions = await this.getTransactionUseCase.findByItemId(itemId);
    return ApiResponseDto.success(
      transactions.map(
        (transaction) => new TransactionResponseDto(transaction),
      ),
      'Transactions retrieved successfully'
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Transaction ID' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Transaction retrieved successfully',
    type: TransactionResponseSchema 
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getTransactionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<TransactionResponseDto>> {
    const transaction = await this.getTransactionUseCase.execute(id);
    return ApiResponseDto.success(
      new TransactionResponseDto(transaction),
      'Transaction retrieved successfully'
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiParam({ name: 'id', type: 'number', description: 'Transaction ID' })
  @ApiBody({ type: UpdateTransactionDto, description: 'Transaction data to update' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Transaction updated successfully',
    type: TransactionResponseSchema 
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<ApiResponseDto<TransactionResponseDto>> {
    const transaction = await this.updateTransactionUseCase.execute(
      id,
      updateTransactionDto,
    );
    return ApiResponseDto.success(
      new TransactionResponseDto(transaction),
      'Transaction updated successfully'
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiParam({ name: 'id', type: 'number', description: 'Transaction ID' })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Transaction deleted successfully',
    type: TransactionResponseSchema 
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async deleteTransaction(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<boolean>> {
    const deleted = await this.deleteTransactionUseCase.execute(id);
    return ApiResponseDto.success(deleted, 'Transaction deleted successfully');
  }
}
