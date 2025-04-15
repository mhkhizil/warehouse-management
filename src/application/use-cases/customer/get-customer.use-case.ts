import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';

@Injectable()
export class GetCustomerUseCase {
  private readonly logger = new Logger(GetCustomerUseCase.name);

  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: number): Promise<Customer> {
    this.logger.log(`Fetching customer with ID: ${id}`);

    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      this.logger.warn(`Customer with ID ${id} not found`);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async findByEmail(email: string): Promise<Customer> {
    this.logger.log(`Fetching customer with email: ${email}`);

    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      this.logger.warn(`Customer with email ${email} not found`);
      throw new NotFoundException(`Customer with email ${email} not found`);
    }

    return customer;
  }

  async findByPhone(phone: string): Promise<Customer> {
    this.logger.log(`Fetching customer with phone: ${phone}`);

    const customer = await this.customerRepository.findByPhone(phone);
    if (!customer) {
      this.logger.warn(`Customer with phone ${phone} not found`);
      throw new NotFoundException(`Customer with phone ${phone} not found`);
    }

    return customer;
  }

  async findWithDebts(): Promise<Customer[]> {
    this.logger.log('Fetching customers with outstanding debts');
    return this.customerRepository.findWithDebts();
  }
}
