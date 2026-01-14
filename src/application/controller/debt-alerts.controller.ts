import { Controller, Post, Get, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';
import { DebtAlertService } from '../../core/common/pusher/DebtAlertService';
import { CoreApiResonseSchema } from '../../core/common/schema/ApiResponseSchema';

@ApiTags('debt-alerts')
@Controller('debt-alerts')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class DebtAlertsController {
  constructor(private readonly debtAlertService: DebtAlertService) {}

  @Post('trigger')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Manually trigger debt alerts (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt alerts triggered successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'string', example: 'Debt alerts triggered successfully' },
        message: {
          type: 'string',
          example: 'Debt alerts triggered successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized to trigger alerts',
  })
  async triggerDebtAlerts() {
    await this.debtAlertService.triggerDebtAlerts();
    return CoreApiResonseSchema.success(
      'Debt alerts triggered successfully',
      'Debt alerts triggered successfully',
    );
  }

  @Post('reset-flags')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Reset alert flags for testing (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alert flags reset successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'string', example: 'Alert flags reset successfully' },
        message: { type: 'string', example: 'Alert flags reset successfully' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User not authorized to reset flags',
  })
  async resetAlertFlags() {
    await this.debtAlertService.resetAlertFlags();
    return CoreApiResonseSchema.success(
      'Alert flags reset successfully',
      'Alert flags reset successfully',
    );
  }

  @Get('status')
  @ApiOperation({ summary: 'Get debt alert system status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Debt alert system status retrieved successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            systemActive: { type: 'boolean', example: true },
            lastCheck: { type: 'string', example: '2025-01-30T10:00:00.000Z' },
            nextCheck: { type: 'string', example: '2025-01-30T11:00:00.000Z' },
            pusherConfigured: { type: 'boolean', example: true },
          },
        },
        message: {
          type: 'string',
          example: 'Debt alert system status retrieved successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async getAlertSystemStatus() {
    const now = new Date();
    const nextCheck = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    const status = {
      systemActive: true,
      lastCheck: now.toISOString(),
      nextCheck: nextCheck.toISOString(),
      pusherConfigured: !!process.env.PUSHER_APP_ID,
    };

    return CoreApiResonseSchema.success(
      status,
      'Debt alert system status retrieved successfully',
    );
  }
}
