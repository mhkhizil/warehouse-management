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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import {
  PaginatedResponseDto,
  PaginationQueryDto,
} from '../dtos/common/pagination.dto';
import { CreateDebtUseCase } from '../use-cases/debt/create-debt.use-case';
import { DeleteDebtUseCase } from '../use-cases/debt/delete-debt.use-case';
import { GetDebtUseCase } from '../use-cases/debt/get-debt.use-case';
import { ListDebtsUseCase } from '../use-cases/debt/list-debts.use-case';
import { UpdateDebtUseCase } from '../use-cases/debt/update-debt.use-case';
import { MarkDebtSettledUseCase } from '../use-cases/debt/mark-debt-settled.use-case';
import { MarkDebtAlertSentUseCase } from '../use-cases/debt/mark-debt-alert-sent.use-case';
import { FindOverdueDebtsUseCase } from '../use-cases/debt/find-overdue-debts.use-case';
import { CreateDebtDto } from '../dtos/debt/create-debt.dto';
import { UpdateDebtDto } from '../dtos/debt/update-debt.dto';
import { DebtResponseDto } from '../dtos/debt/debt-response.dto';
import { DebtFilter } from '../../domain/filters/debt.filter';
import { DebtResponseSchema } from './documentation/debt/ResponseSchema/DebtResponseSchema';
import { PaginatedDebtResponseSchema } from './documentation/debt/ResponseSchema/PaginatedDebtResponseSchema';
import { DebtListResponseSchema } from './documentation/debt/ResponseSchema/DebtListResponseSchema';
import { CoreApiResonseSchema } from '../../core/common/schema/ApiResponseSchema';

@ApiTags('Debts')
@UseGuards(JwtGuard)
@Controller('debts')
export class DebtsController {
  constructor(
    private readonly createDebtUseCase: CreateDebtUseCase,
    private readonly deleteDebtUseCase: DeleteDebtUseCase,
    private readonly getDebtUseCase: GetDebtUseCase,
    private readonly listDebtsUseCase: ListDebtsUseCase,
    private readonly updateDebtUseCase: UpdateDebtUseCase,
    private readonly markDebtSettledUseCase: MarkDebtSettledUseCase,
    private readonly markDebtAlertSentUseCase: MarkDebtAlertSentUseCase,
    private readonly findOverdueDebtsUseCase: FindOverdueDebtsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new debt' })
  @ApiBody({ type: CreateDebtDto, description: 'Debt data to create' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Debt created successfully',
    type: DebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer or Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async createDebt(
    @Body() createDebtDto: CreateDebtDto,
  ): Promise<ApiResponseDto<DebtResponseDto>> {
    const debt = await this.createDebtUseCase.execute(createDebtDto);
    return ApiResponseDto.success(
      new DebtResponseDto(debt),
      'Debt created successfully',
    );
  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get debts with optional filtering' })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Filter by customer ID',
  })
  @ApiQuery({
    name: 'isSettled',
    required: false,
    description: 'Filter by settlement status',
  })
  @ApiQuery({
    name: 'alertSent',
    required: false,
    description: 'Filter by alert status',
  })
  @ApiQuery({
    name: 'dueBefore',
    required: false,
    description: 'Filter by due date before',
  })
  @ApiQuery({
    name: 'dueAfter',
    required: false,
    description: 'Filter by due date after',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debts retrieved successfully',
    type: PaginatedDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getDebts(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('customerId') customerId?: string,
    @Query('isSettled') isSettled?: string,
    @Query('alertSent') alertSent?: string,
    @Query('dueBefore') dueBefore?: string,
    @Query('dueAfter') dueAfter?: string,
  ): Promise<ApiResponseDto<PaginatedResponseDto<DebtResponseDto>>> {
    const filter = new DebtFilter({
      skip: paginationQuery.skip,
      take: paginationQuery.take,
      customerId: customerId ? parseInt(customerId, 10) : undefined,
      isSettled: isSettled ? isSettled === 'true' : undefined,
      alertSent: alertSent ? alertSent === 'true' : undefined,
      dueBefore: dueBefore ? new Date(dueBefore) : undefined,
      dueAfter: dueAfter ? new Date(dueAfter) : undefined,
    });

    const { debts, total } = await this.listDebtsUseCase.execute(filter);

    const paginatedResponse = new PaginatedResponseDto<DebtResponseDto>(
      debts.map((debt) => new DebtResponseDto(debt)),
      total,
      filter.skip,
      filter.take,
    );

    return ApiResponseDto.success(
      paginatedResponse,
      'Debts retrieved successfully',
    );
  }

  @Get('all')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all debts without pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All debts retrieved successfully',
    type: DebtListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getAllDebts(): Promise<ApiResponseDto<DebtResponseDto[]>> {
    const debts = await this.listDebtsUseCase.findAll();
    return ApiResponseDto.success(
      debts.map((debt) => new DebtResponseDto(debt)),
      'All debts retrieved successfully',
    );
  }

  @Get('overdue')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get overdue debts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Overdue debts retrieved successfully',
    type: DebtListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getOverdueDebts(): Promise<ApiResponseDto<DebtResponseDto[]>> {
    const debts = await this.findOverdueDebtsUseCase.execute();
    return ApiResponseDto.success(
      debts.map((debt) => new DebtResponseDto(debt)),
      'Overdue debts retrieved successfully',
    );
  }

  @Get('customer/:customerId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get debts by customer ID' })
  @ApiParam({ name: 'customerId', type: 'number', description: 'Customer ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debts retrieved successfully',
    type: DebtListResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getDebtsByCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<ApiResponseDto<DebtResponseDto[]>> {
    const debts = await this.getDebtUseCase.findByCustomerId(customerId);
    return ApiResponseDto.success(
      debts.map((debt) => new DebtResponseDto(debt)),
      'Debts retrieved successfully',
    );
  }

  @Get('transaction/:transactionId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get debt by transaction ID' })
  @ApiParam({
    name: 'transactionId',
    type: 'number',
    description: 'Transaction ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt retrieved successfully',
    type: DebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debt not found for this transaction',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getDebtByTransaction(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<ApiResponseDto<DebtResponseDto>> {
    const debt = await this.getDebtUseCase.findByTransactionId(transactionId);
    return ApiResponseDto.success(
      new DebtResponseDto(debt),
      'Debt retrieved successfully',
    );
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get debt by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Debt ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt retrieved successfully',
    type: DebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debt not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getDebtById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<DebtResponseDto>> {
    const debt = await this.getDebtUseCase.execute(id);
    return ApiResponseDto.success(
      new DebtResponseDto(debt),
      'Debt retrieved successfully',
    );
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a debt' })
  @ApiParam({ name: 'id', type: 'number', description: 'Debt ID' })
  @ApiBody({ type: UpdateDebtDto, description: 'Debt data to update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt updated successfully',
    type: DebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debt not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async updateDebt(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDebtDto: UpdateDebtDto,
  ): Promise<ApiResponseDto<DebtResponseDto>> {
    const debt = await this.updateDebtUseCase.execute(id, updateDebtDto);
    return ApiResponseDto.success(
      new DebtResponseDto(debt),
      'Debt updated successfully',
    );
  }

  @Put(':id/settle')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a debt as settled' })
  @ApiParam({ name: 'id', type: 'number', description: 'Debt ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt marked as settled successfully',
    type: DebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debt not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async settleDebt(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<DebtResponseDto>> {
    const debt = await this.markDebtSettledUseCase.execute(id);
    return ApiResponseDto.success(
      new DebtResponseDto(debt),
      'Debt marked as settled successfully',
    );
  }

  @Put(':id/mark-alert-sent')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark alert as sent for a debt' })
  @ApiParam({ name: 'id', type: 'number', description: 'Debt ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt alert marked as sent successfully',
    type: DebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debt not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async markAlertSent(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<DebtResponseDto>> {
    const debt = await this.markDebtAlertSentUseCase.execute(id);
    return ApiResponseDto.success(
      new DebtResponseDto(debt),
      'Debt alert marked as sent successfully',
    );
  }

  // NEW ENDPOINTS FOR DEBT CATEGORIZATION

  @Get('by-type/purchase-debts')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get debts from original purchases (positive amounts only)',
  })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Filter by customer ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Purchase debts retrieved successfully',
    type: PaginatedDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getPurchaseDebts(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('customerId') customerId?: string,
  ): Promise<ApiResponseDto<PaginatedResponseDto<DebtResponseDto>>> {
    const filter = new DebtFilter({
      skip: paginationQuery.skip,
      take: paginationQuery.take,
      customerId: customerId ? parseInt(customerId, 10) : undefined,
      // Only positive amounts (customer owes money)
      minAmount: 0.01,
      // Exclude refund-related remarks
      excludeRemarks: ['Credit from', 'refund #'],
    });

    const { debts, total } = await this.listDebtsUseCase.execute(filter);

    const paginatedResponse = new PaginatedResponseDto<DebtResponseDto>(
      debts.map((debt) => new DebtResponseDto(debt)),
      total,
      filter.skip,
      filter.take,
    );

    return ApiResponseDto.success(
      paginatedResponse,
      'Purchase debts retrieved successfully',
    );
  }

  @Get('by-type/credit-balances')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get customer credit balances (negative amounts)' })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Filter by customer ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credit balances retrieved successfully',
    type: PaginatedDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getCreditBalances(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('customerId') customerId?: string,
  ): Promise<ApiResponseDto<PaginatedResponseDto<DebtResponseDto>>> {
    const filter = new DebtFilter({
      skip: paginationQuery.skip,
      take: paginationQuery.take,
      customerId: customerId ? parseInt(customerId, 10) : undefined,
      // Only negative amounts (customer has credit)
      maxAmount: -0.01,
    });

    const { debts, total } = await this.listDebtsUseCase.execute(filter);

    const paginatedResponse = new PaginatedResponseDto<DebtResponseDto>(
      debts.map((debt) => new DebtResponseDto(debt)),
      total,
      filter.skip,
      filter.take,
    );

    return ApiResponseDto.success(
      paginatedResponse,
      'Credit balances retrieved successfully',
    );
  }

  @Get('by-type/exchange-debts')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get debts from item exchanges (additional payments)',
  })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Filter by customer ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Exchange debts retrieved successfully',
    type: PaginatedDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getExchangeDebts(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('customerId') customerId?: string,
  ): Promise<ApiResponseDto<PaginatedResponseDto<DebtResponseDto>>> {
    const filter = new DebtFilter({
      skip: paginationQuery.skip,
      take: paginationQuery.take,
      customerId: customerId ? parseInt(customerId, 10) : undefined,
      // Only positive amounts from exchanges
      minAmount: 0.01,
      // Include exchange-related remarks
      includeRemarks: ['exchange payment', 'additional payment'],
    });

    const { debts, total } = await this.listDebtsUseCase.execute(filter);

    const paginatedResponse = new PaginatedResponseDto<DebtResponseDto>(
      debts.map((debt) => new DebtResponseDto(debt)),
      total,
      filter.skip,
      filter.take,
    );

    return ApiResponseDto.success(
      paginatedResponse,
      'Exchange debts retrieved successfully',
    );
  }

  @Get('by-type/refund-adjustments')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get debt adjustments from refunds (both positive and negative)',
  })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Filter by customer ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refund adjustments retrieved successfully',
    type: PaginatedDebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getRefundAdjustments(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('customerId') customerId?: string,
  ): Promise<ApiResponseDto<PaginatedResponseDto<DebtResponseDto>>> {
    const filter = new DebtFilter({
      skip: paginationQuery.skip,
      take: paginationQuery.take,
      customerId: customerId ? parseInt(customerId, 10) : undefined,
      // Include refund-related remarks
      includeRemarks: ['Credit from', 'refund #', 'exchange refund'],
    });

    const { debts, total } = await this.listDebtsUseCase.execute(filter);

    const paginatedResponse = new PaginatedResponseDto<DebtResponseDto>(
      debts.map((debt) => new DebtResponseDto(debt)),
      total,
      filter.skip,
      filter.take,
    );

    return ApiResponseDto.success(
      paginatedResponse,
      'Refund adjustments retrieved successfully',
    );
  }

  @Get('summary/by-customer/:customerId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get debt summary by customer with categorization' })
  @ApiParam({ name: 'customerId', type: 'number', description: 'Customer ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Customer debt summary retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getCustomerDebtSummary(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<ApiResponseDto<any>> {
    // Get all debts for this customer
    const allDebts = await this.getDebtUseCase.findByCustomerId(customerId);

    // Categorize debts
    const purchaseDebts = allDebts.filter(
      (debt) =>
        debt.amount > 0 &&
        (!debt.remarks ||
          (!debt.remarks.includes('Credit from') &&
            !debt.remarks.includes('refund #'))),
    );

    const creditBalances = allDebts.filter((debt) => debt.amount < 0);

    const exchangeDebts = allDebts.filter(
      (debt) =>
        debt.amount > 0 &&
        debt.remarks &&
        (debt.remarks.includes('exchange payment') ||
          debt.remarks.includes('additional payment')),
    );

    const refundAdjustments = allDebts.filter(
      (debt) =>
        debt.remarks &&
        (debt.remarks.includes('Credit from') ||
          debt.remarks.includes('refund #')),
    );

    const summary = {
      customerId,
      totalPurchaseDebt: purchaseDebts.reduce(
        (sum, debt) => sum + debt.amount,
        0,
      ),
      totalCreditBalance: Math.abs(
        creditBalances.reduce((sum, debt) => sum + debt.amount, 0),
      ),
      totalExchangeDebt: exchangeDebts.reduce(
        (sum, debt) => sum + debt.amount,
        0,
      ),
      netBalance: allDebts.reduce((sum, debt) => sum + debt.amount, 0),
      breakdown: {
        purchaseDebts: purchaseDebts.length,
        creditBalances: creditBalances.length,
        exchangeDebts: exchangeDebts.length,
        refundAdjustments: refundAdjustments.length,
      },
      details: {
        purchaseDebts: purchaseDebts.map((debt) => new DebtResponseDto(debt)),
        creditBalances: creditBalances.map((debt) => new DebtResponseDto(debt)),
        exchangeDebts: exchangeDebts.map((debt) => new DebtResponseDto(debt)),
        refundAdjustments: refundAdjustments.map(
          (debt) => new DebtResponseDto(debt),
        ),
      },
    };

    return ApiResponseDto.success(
      summary,
      'Customer debt summary retrieved successfully',
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a debt' })
  @ApiParam({ name: 'id', type: 'number', description: 'Debt ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt deleted successfully',
    type: DebtResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Debt not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async deleteDebt(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<boolean>> {
    const deleted = await this.deleteDebtUseCase.execute(id);
    return ApiResponseDto.success(deleted, 'Debt deleted successfully');
  }
}
