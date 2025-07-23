import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CsrfService } from '../service/csrf.service';
import { JwtGuard } from '../../../application/auth/guard/jwt.guard';
import { SkipCsrf } from '../decorator/skip-csrf.decorator';

@ApiTags('CSRF')
@Controller('csrf')
export class CsrfController {
  constructor(private readonly csrfService: CsrfService) {}

  @Get('token')
  @SkipCsrf()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get CSRF token' })
  @ApiResponse({
    status: 200,
    description: 'CSRF token generated successfully',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const token = this.csrfService.generateToken(req, res);

    return res.json({
      token,
      message: 'CSRF token generated successfully',
    });
  }
}
 