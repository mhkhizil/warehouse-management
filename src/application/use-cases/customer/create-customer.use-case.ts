import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { CreateCustomerDto } from '../../dtos/customer/create-customer.dto';

@Injectable()
export class CreateCustomerUseCase {
  private readonly logger = new Logger(CreateCustomerUseCase.name);

  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    this.logger.log(`Creating customer with name: ${createCustomerDto.name}`);

    // Check if email already exists if provided
    if (createCustomerDto.email) {
      const existingCustomerWithEmail =
        await this.customerRepository.findByEmailForValidation(
          createCustomerDto.email,
        );
      if (existingCustomerWithEmail) {
        const customerStatus = existingCustomerWithEmail.isActive
          ? 'active'
          : 'inactive';
        this.logger.warn(
          `Customer with email ${createCustomerDto.email} already exists (customer is ${customerStatus}, ID: ${existingCustomerWithEmail.id})`,
        );
        throw new BadRequestException(
          `Customer with email ${createCustomerDto.email} already exists`,
        );
      }
    }

    // Check if phone already exists if provided
    if (createCustomerDto.phone) {
      const existingCustomerWithPhone =
        await this.customerRepository.findByPhoneForValidation(
          createCustomerDto.phone,
        );
      if (existingCustomerWithPhone) {
        const customerStatus = existingCustomerWithPhone.isActive
          ? 'active'
          : 'inactive';
        this.logger.warn(
          `Customer with phone ${createCustomerDto.phone} already exists (customer is ${customerStatus}, ID: ${existingCustomerWithPhone.id})`,
        );
        throw new BadRequestException(
          `Customer with phone ${createCustomerDto.phone} already exists`,
        );
      }
    }

    // Create customer
    const newCustomer = await this.customerRepository.create(createCustomerDto);

    this.logger.log(`Customer created with ID: ${newCustomer.id}`);
    return newCustomer;
  }
}
