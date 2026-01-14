import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
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
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { CreateRefundDto } from '../dtos/refund/create-refund.dto';
import { UpdateRefundStatusDto } from '../dtos/refund/update-refund-status.dto';
import { RefundResponseDto } from '../dtos/refund/refund-response.dto';
import { RefundListResponseDto } from '../dtos/refund/refund-list-response.dto';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { CreateRefundUseCase } from '../use-cases/refund/create-refund.use-case';
import { ProcessRefundUseCase } from '../use-cases/refund/process-refund.use-case';
import { GetRefundUseCase } from '../use-cases/refund/get-refund.use-case';
import { ListRefundsUseCase } from '../use-cases/refund/list-refunds.use-case';
import { ValidateRefundEligibilityUseCase } from '../use-cases/refund/validate-refund-eligibility.use-case';

@ApiTags('Refunds')
@UseGuards(JwtGuard)
@Controller('refunds')
@ApiBearerAuth()
export class RefundsController {
  constructor(
    private readonly createRefundUseCase: CreateRefundUseCase,
    private readonly processRefundUseCase: ProcessRefundUseCase,
    private readonly getRefundUseCase: GetRefundUseCase,
    private readonly listRefundsUseCase: ListRefundsUseCase,
    private readonly validateRefundEligibilityUseCase: ValidateRefundEligibilityUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all refunds' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refunds retrieved successfully',
    type: RefundListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getAllRefunds(): Promise<ApiResponseDto<RefundListResponseDto>> {
    const refunds = await this.listRefundsUseCase.execute();
    const response = new RefundListResponseDto(
      refunds,
      refunds.length,
      1,
      refunds.length,
    );
    return ApiResponseDto.success(response, 'Refunds retrieved successfully');
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get refund by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Refund ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refund retrieved successfully',
    type: RefundResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Refund not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getRefundById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<RefundResponseDto>> {
    const refund = await this.getRefundUseCase.execute(id);
    return ApiResponseDto.success(
      new RefundResponseDto(refund),
      'Refund retrieved successfully',
    );
  }

  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard) // Only admins can update refund status
  @ApiOperation({ summary: 'Update refund status' })
  @ApiParam({ name: 'id', type: 'number', description: 'Refund ID' })
  @ApiBody({
    type: UpdateRefundStatusDto,
    description: 'Status update data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refund status updated successfully',
    type: RefundResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status transition',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Refund not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async updateRefundStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateStatusDto: UpdateRefundStatusDto,
  ): Promise<ApiResponseDto<RefundResponseDto>> {
    const refund = await this.processRefundUseCase.updateStatus(
      id,
      updateStatusDto.status,
      // TODO: Get user ID from JWT token
      1, // Placeholder for processedBy
    );
    return ApiResponseDto.success(
      new RefundResponseDto(refund),
      'Refund status updated successfully',
    );
  }

  @Post(':id/process')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Process refund with admin auto-approval',
    description:
      'Process a refund. Admins can process PENDING refunds directly (auto-approval). Regular users can only process APPROVED refunds.',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Refund ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refund processed successfully',
    type: RefundResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Refund is not in APPROVED status',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Refund not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Admin access required',
  })
  async processRefund(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ApiResponseDto<RefundResponseDto>> {
    // Get current user ID from JWT token for admin auto-approval
    const processedBy = req.user?.user?.id;

    const refund = await this.processRefundUseCase.execute(
      id,
      processedBy, // Pass the actual user ID for admin auto-approval
    );
    return ApiResponseDto.success(
      new RefundResponseDto(refund),
      'Refund processed successfully',
    );
  }
}

// Transaction-specific refund endpoints
@ApiTags('Transactions - Refunds')
@UseGuards(JwtGuard)
@Controller('transactions')
@ApiBearerAuth()
export class TransactionRefundsController {
  constructor(
    private readonly createRefundUseCase: CreateRefundUseCase,
    private readonly listRefundsUseCase: ListRefundsUseCase,
    private readonly validateRefundEligibilityUseCase: ValidateRefundEligibilityUseCase,
  ) {}

  @Post(':transactionId/refunds')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a refund for a transaction' })
  @ApiParam({
    name: 'transactionId',
    type: 'number',
    description: 'Transaction ID to refund',
  })
  @ApiBody({
    type: CreateRefundDto,
    description: 'Refund creation data',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Refund created successfully',
    type: RefundResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid refund data or transaction not eligible for refund',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async createRefund(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body(ValidationPipe) createRefundDto: CreateRefundDto,
  ): Promise<ApiResponseDto<RefundResponseDto>> {
    const refund = await this.createRefundUseCase.execute(
      transactionId,
      createRefundDto,
    );
    return ApiResponseDto.success(
      new RefundResponseDto(refund),
      'Refund created successfully',
    );
  }

  @Get(':transactionId/refunds')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all refunds for a transaction' })
  @ApiParam({
    name: 'transactionId',
    type: 'number',
    description: 'Transaction ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction refunds retrieved successfully',
    type: RefundListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async getTransactionRefunds(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<ApiResponseDto<RefundListResponseDto>> {
    const refunds =
      await this.listRefundsUseCase.getByTransactionId(transactionId);
    const response = new RefundListResponseDto(
      refunds,
      refunds.length,
      1,
      refunds.length,
    );
    return ApiResponseDto.success(
      response,
      'Transaction refunds retrieved successfully',
    );
  }

  @Get(':transactionId/refund-eligibility')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check refund eligibility for a transaction' })
  @ApiParam({
    name: 'transactionId',
    type: 'number',
    description: 'Transaction ID to check',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refund eligibility checked successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async checkRefundEligibility(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<ApiResponseDto<any>> {
    const eligibility =
      await this.validateRefundEligibilityUseCase.validateTransaction(
        transactionId,
      );
    return ApiResponseDto.success(
      eligibility,
      'Refund eligibility checked successfully',
    );
  }
}
