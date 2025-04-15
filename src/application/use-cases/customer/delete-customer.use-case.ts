import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { Inject } from '@nestjs/common';
import { CUSTOMER_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class DeleteCustomerUseCase {
  private readonly logger = new Logger(DeleteCustomerUseCase.name);

  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    this.logger.log(`Deleting customer with ID: ${id}`);

    // Check if customer exists
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      this.logger.warn(`Customer with ID ${id} not found`);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Delete customer
    return await this.customerRepository.delete(id);
  }
}
