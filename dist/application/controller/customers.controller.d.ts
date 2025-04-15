import { CreateCustomerUseCase } from '../use-cases/customer/create-customer.use-case';
import { DeleteCustomerUseCase } from '../use-cases/customer/delete-customer.use-case';
import { GetCustomerUseCase } from '../use-cases/customer/get-customer.use-case';
import { ListCustomersUseCase } from '../use-cases/customer/list-customers.use-case';
import { UpdateCustomerUseCase } from '../use-cases/customer/update-customer.use-case';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { CreateCustomerDto } from '../dtos/customer/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/customer/update-customer.dto';
import { CustomerResponseDto } from '../dtos/customer/customer-response.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../dtos/common/pagination.dto';
export declare class CustomersController {
    private readonly createCustomerUseCase;
    private readonly deleteCustomerUseCase;
    private readonly getCustomerUseCase;
    private readonly listCustomersUseCase;
    private readonly updateCustomerUseCase;
    constructor(createCustomerUseCase: CreateCustomerUseCase, deleteCustomerUseCase: DeleteCustomerUseCase, getCustomerUseCase: GetCustomerUseCase, listCustomersUseCase: ListCustomersUseCase, updateCustomerUseCase: UpdateCustomerUseCase);
    createCustomer(createCustomerDto: CreateCustomerDto): Promise<ApiResponseDto<CustomerResponseDto>>;
    getCustomers(paginationQuery: PaginationQueryDto, name?: string, phone?: string, email?: string, hasDebt?: string): Promise<ApiResponseDto<PaginatedResponseDto<CustomerResponseDto>>>;
    getAllCustomers(): Promise<ApiResponseDto<CustomerResponseDto[]>>;
    getCustomersWithDebts(): Promise<ApiResponseDto<CustomerResponseDto[]>>;
    getCustomerById(id: number): Promise<ApiResponseDto<CustomerResponseDto>>;
    getCustomerByEmail(email: string): Promise<ApiResponseDto<CustomerResponseDto>>;
    getCustomerByPhone(phone: string): Promise<ApiResponseDto<CustomerResponseDto>>;
    updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto): Promise<ApiResponseDto<CustomerResponseDto>>;
    deleteCustomer(id: number): Promise<ApiResponseDto<boolean>>;
}
