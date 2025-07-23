import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipCsrf } from '../decorator/skip-csrf.decorator';

@ApiTags('Webhook Example')
@Controller('webhook')
export class WebhookExampleController {
  @Post('payment')
  @SkipCsrf()
  @ApiOperation({ summary: 'Payment webhook - CSRF protection skipped' })
  async paymentWebhook(@Body() paymentData: any) {
    // This endpoint doesn't require CSRF tokens because it's a webhook
    // from external payment providers
    console.log('Payment webhook received:', paymentData);
    return { status: 'success', message: 'Payment webhook processed' };
  }

  @Post('notification')
  @SkipCsrf()
  @ApiOperation({ summary: 'Notification webhook - CSRF protection skipped' })
  async notificationWebhook(@Body() notificationData: any) {
    // This endpoint doesn't require CSRF tokens because it's a webhook
    // from external notification services
    console.log('Notification webhook received:', notificationData);
    return { status: 'success', message: 'Notification webhook processed' };
  }

  @Get('status')
  @ApiOperation({ summary: 'Get webhook status - GET request, no CSRF needed' })
  async getWebhookStatus() {
    // This is a GET request, so CSRF protection is automatically skipped
    return { status: 'active', endpoints: ['payment', 'notification'] };
  }
}
