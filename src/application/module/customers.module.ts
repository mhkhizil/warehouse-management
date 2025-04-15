import { Module } from '@nestjs/common';
import { CustomersController } from '../controller/customers.controller';
import { CreateCustomerUseCase } from '../use-cases/customer/create-customer.use-case';
import { DeleteCustomerUseCase } from '../use-cases/customer/delete-customer.use-case';
import { GetCustomerUseCase } from '../use-cases/customer/get-customer.use-case';
import { ListCustomersUseCase } from '../use-cases/customer/list-customers.use-case';
import { UpdateCustomerUseCase } from '../use-cases/customer/update-customer.use-case';
import { RepositoriesModule } from '../../infrastructure/persistence/repositories/repositories.module';
import { CUSTOMER_REPOSITORY } from '../../domain/constants/repository.tokens';
import { CustomerRepository } from '../../infrastructure/persistence/repositories/customer.repository';

@Module({
  imports: [RepositoriesModule],
  controllers: [CustomersController],
  providers: [
    {
      provide: CreateCustomerUseCase,
      useFactory: (customerRepo) => {
        return new CreateCustomerUseCase(customerRepo);
      },
      inject: [CUSTOMER_REPOSITORY],
    },
    {
      provide: DeleteCustomerUseCase,
      useFactory: (customerRepo) => {
        return new DeleteCustomerUseCase(customerRepo);
      },
      inject: [CUSTOMER_REPOSITORY],
    },
    {
      provide: GetCustomerUseCase,
      useFactory: (customerRepo) => {
        return new GetCustomerUseCase(customerRepo);
      },
      inject: [CUSTOMER_REPOSITORY],
    },
    {
      provide: ListCustomersUseCase,
      useFactory: (customerRepo) => {
        return new ListCustomersUseCase(customerRepo);
      },
      inject: [CUSTOMER_REPOSITORY],
    },
    {
      provide: UpdateCustomerUseCase,
      useFactory: (customerRepo) => {
        return new UpdateCustomerUseCase(customerRepo);
      },
      inject: [CUSTOMER_REPOSITORY],
    },
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerRepository,
    },
  ],
  exports: [
    CreateCustomerUseCase,
    DeleteCustomerUseCase,
    GetCustomerUseCase,
    ListCustomersUseCase,
    UpdateCustomerUseCase,
  ],
})
export class CustomersModule {}
