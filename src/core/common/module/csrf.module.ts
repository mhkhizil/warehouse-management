import { Module, Global } from '@nestjs/common';
import { CsrfService } from '../service/csrf.service';
import { CsrfGuard } from '../guard/csrf.guard';
import { CsrfMiddleware } from '../middleware/csrf.middleware';
import { CsrfController } from '../controller/csrf.controller';

@Global()
@Module({
  controllers: [CsrfController],
  providers: [CsrfService, CsrfGuard, CsrfMiddleware],
  exports: [CsrfService, CsrfGuard, CsrfMiddleware],
})
export class CsrfModule {}
