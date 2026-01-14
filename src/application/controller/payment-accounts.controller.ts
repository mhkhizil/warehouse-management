import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { CreatePaymentAccountDto } from '../dtos/payment-account/create-payment-account.dto';
import { UpdatePaymentAccountDto } from '../dtos/payment-account/update-payment-account.dto';
import { PaymentAccountResponseDto } from '../dtos/payment-account/payment-account-response.dto';
import { PaymentAccountListResponseDto } from '../dtos/payment-account/payment-account-list-response.dto';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { CreatePaymentAccountUseCase } from '../use-cases/payment-account/create-payment-account.use-case';
import { GetPaymentAccountUseCase } from '../use-cases/payment-account/get-payment-account.use-case';
import { ListPaymentAccountsUseCase } from '../use-cases/payment-account/list-payment-accounts.use-case';
import { UpdatePaymentAccountUseCase } from '../use-cases/payment-account/update-payment-account.use-case';
import { DeletePaymentAccountUseCase } from '../use-cases/payment-account/delete-payment-account.use-case';

@ApiTags('Payment Accounts')
@UseGuards(JwtGuard)
@Controller('payment-accounts')
@ApiBearerAuth()
export class PaymentAccountsController {
  constructor(
    private readonly createPaymentAccountUseCase: CreatePaymentAccountUseCase,
    private readonly getPaymentAccountUseCase: GetPaymentAccountUseCase,
    private readonly listPaymentAccountsUseCase: ListPaymentAccountsUseCase,
    private readonly updatePaymentAccountUseCase: UpdatePaymentAccountUseCase,
    private readonly deletePaymentAccountUseCase: DeletePaymentAccountUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Create new payment account',
    description:
      'Create a new payment account for online transactions. Admin access required.',
  })
  @ApiBody({ type: CreatePaymentAccountDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment account created successfully',
    type: PaymentAccountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async createPaymentAccount(
    @Body(ValidationPipe) createPaymentAccountDto: CreatePaymentAccountDto,
    @Request() req,
  ): Promise<ApiResponseDto<PaymentAccountResponseDto>> {
    const paymentAccount = await this.createPaymentAccountUseCase.execute(
      createPaymentAccountDto,
    );
    return ApiResponseDto.success(
      new PaymentAccountResponseDto(paymentAccount),
      'Payment account created successfully',
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all payment accounts',
    description: 'Retrieve all payment accounts with optional filtering',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active/inactive status',
  })
  @ApiQuery({
    name: 'accountType',
    required: false,
    type: String,
    description: 'Filter by account type',
  })
  @ApiQuery({
    name: 'bankName',
    required: false,
    type: String,
    description: 'Filter by bank name',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in account name, type, bank name, or holder name',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment accounts retrieved successfully',
    type: PaymentAccountListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getPaymentAccounts(
    @Query('isActive') isActive?: boolean,
    @Query('accountType') accountType?: string,
    @Query('bankName') bankName?: string,
    @Query('search') search?: string,
  ): Promise<ApiResponseDto<PaymentAccountListResponseDto>> {
    const filter = {
      isActive: isActive !== undefined ? isActive : undefined,
      accountType,
      bankName,
      search,
    };

    const result = await this.listPaymentAccountsUseCase.execute(filter);
    return ApiResponseDto.success(
      new PaymentAccountListResponseDto(result.accounts, result.total),
      'Payment accounts retrieved successfully',
    );
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get active payment accounts',
    description:
      'Retrieve only active payment accounts for transaction processing',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active payment accounts retrieved successfully',
    type: [PaymentAccountResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getActivePaymentAccounts(): Promise<
    ApiResponseDto<PaymentAccountResponseDto[]>
  > {
    const accounts = await this.listPaymentAccountsUseCase.getActiveAccounts();
    const responseData = accounts.map(
      (account) => new PaymentAccountResponseDto(account),
    );
    return ApiResponseDto.success(
      responseData,
      'Active payment accounts retrieved successfully',
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get payment account by ID',
    description: 'Retrieve a specific payment account by its ID',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Payment account ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment account retrieved successfully',
    type: PaymentAccountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment account not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getPaymentAccount(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<PaymentAccountResponseDto>> {
    const paymentAccount = await this.getPaymentAccountUseCase.execute(id);
    return ApiResponseDto.success(
      new PaymentAccountResponseDto(paymentAccount),
      'Payment account retrieved successfully',
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Update payment account',
    description: 'Update an existing payment account. Admin access required.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Payment account ID' })
  @ApiBody({ type: UpdatePaymentAccountDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment account updated successfully',
    type: PaymentAccountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment account not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async updatePaymentAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePaymentAccountDto: UpdatePaymentAccountDto,
    @Request() req,
  ): Promise<ApiResponseDto<PaymentAccountResponseDto>> {
    const paymentAccount = await this.updatePaymentAccountUseCase.execute(
      id,
      updatePaymentAccountDto,
    );
    return ApiResponseDto.success(
      new PaymentAccountResponseDto(paymentAccount),
      'Payment account updated successfully',
    );
  }

  @Put(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Deactivate payment account',
    description:
      'Deactivate a payment account (safer than deletion). Admin access required.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Payment account ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment account deactivated successfully',
    type: PaymentAccountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment account not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Account already inactive',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async deactivatePaymentAccount(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ApiResponseDto<PaymentAccountResponseDto>> {
    const paymentAccount =
      await this.deletePaymentAccountUseCase.deactivate(id);
    return ApiResponseDto.success(
      new PaymentAccountResponseDto(paymentAccount),
      'Payment account deactivated successfully',
    );
  }

  @Put(':id/activate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Activate payment account',
    description:
      'Activate a deactivated payment account. Admin access required.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Payment account ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment account activated successfully',
    type: PaymentAccountResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment account not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Account already active',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async activatePaymentAccount(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ApiResponseDto<PaymentAccountResponseDto>> {
    const paymentAccount = await this.deletePaymentAccountUseCase.activate(id);
    return ApiResponseDto.success(
      new PaymentAccountResponseDto(paymentAccount),
      'Payment account activated successfully',
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Delete payment account',
    description:
      'Permanently delete a payment account. Only allowed if no transactions are associated. Admin access required.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Payment account ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Payment account deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment account not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete account with associated transactions',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async deletePaymentAccount(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<void> {
    await this.deletePaymentAccountUseCase.execute(id);
  }
}
