import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { UpdateCustomerDto } from '../../dtos/customer/update-customer.dto';

@Injectable()
export class UpdateCustomerUseCase {
  private readonly logger = new Logger(UpdateCustomerUseCase.name);

  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    this.logger.log(`Updating customer with ID: ${id}`);

    // Check if customer exists
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      this.logger.warn(`Customer with ID ${id} not found`);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Check if updating email and it's already in use by another customer
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomerWithEmail =
        await this.customerRepository.findByEmailForValidation(
          updateCustomerDto.email,
        );
      if (existingCustomerWithEmail && existingCustomerWithEmail.id !== id) {
        const customerStatus = existingCustomerWithEmail.isActive
          ? 'active'
          : 'inactive';
        this.logger.warn(
          `Email ${updateCustomerDto.email} already in use by another customer (customer is ${customerStatus}, ID: ${existingCustomerWithEmail.id})`,
        );
        throw new BadRequestException(
          `Email ${updateCustomerDto.email} already in use by another customer`,
        );
      }
    }

    // Check if updating phone and it's already in use by another customer
    if (updateCustomerDto.phone && updateCustomerDto.phone !== customer.phone) {
      const existingCustomerWithPhone =
        await this.customerRepository.findByPhoneForValidation(
          updateCustomerDto.phone,
        );
      if (existingCustomerWithPhone && existingCustomerWithPhone.id !== id) {
        const customerStatus = existingCustomerWithPhone.isActive
          ? 'active'
          : 'inactive';
        this.logger.warn(
          `Phone ${updateCustomerDto.phone} already in use by another customer (customer is ${customerStatus}, ID: ${existingCustomerWithPhone.id})`,
        );
        throw new BadRequestException(
          `Phone ${updateCustomerDto.phone} already in use by another customer`,
        );
      }
    }

    // Update customer
    const updatedCustomer = await this.customerRepository.update(
      id,
      updateCustomerDto,
    );

    this.logger.log(`Customer with ID ${id} updated successfully`);
    return updatedCustomer;
  }

  async restore(id: number): Promise<Customer> {
    this.logger.log(`Restoring customer with ID: ${id}`);

    // Check if customer exists (including soft-deleted ones)
    const customer = await this.customerRepository.findByIdForRestore(id);
    if (!customer) {
      this.logger.warn(`Customer with ID ${id} not found`);
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Check if customer is already active
    if (customer.isActive) {
      this.logger.warn(`Customer with ID ${id} is already active`);
      throw new BadRequestException(`Customer with ID ${id} is already active`);
    }

    // Restore customer
    const restoredCustomer = await this.customerRepository.restore(id);

    this.logger.log(`Customer with ID ${id} restored successfully`);
    return restoredCustomer;
  }
}
