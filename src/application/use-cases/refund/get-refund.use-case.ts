import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { Refund } from '@prisma/client';
import { IRefundRepository } from '../../../domain/interfaces/repositories/refund.repository.interface';
import { REFUND_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class GetRefundUseCase {
  private readonly logger = new Logger(GetRefundUseCase.name);

  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: IRefundRepository,
  ) {}

  async execute(id: number): Promise<Refund> {
    this.logger.log(`Getting refund with ID: ${id}`);

    const refund = await this.refundRepository.findWithAllRelations(id);

    if (!refund) {
      throw new NotFoundException(`Refund with ID ${id} not found`);
    }

    return refund;
  }
}
