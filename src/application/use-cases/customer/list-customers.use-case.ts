import { Inject, Injectable, Logger } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { CustomerFilter } from '../../../domain/filters/customer.filter';
import { CUSTOMER_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class ListCustomersUseCase {
  private readonly logger = new Logger(ListCustomersUseCase.name);

  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(
    filter: CustomerFilter,
  ): Promise<{ customers: Customer[]; total: number }> {
    this.logger.log(
      `Fetching customers with filter: ${JSON.stringify(filter)}`,
    );
    return await this.customerRepository.findWithFilters(filter);
  }

  async findAll(): Promise<Customer[]> {
    this.logger.log('Fetching all customers');
    return await this.customerRepository.findAll();
  }
}
