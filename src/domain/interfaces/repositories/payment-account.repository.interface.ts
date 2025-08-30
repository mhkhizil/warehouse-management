import { CreatePaymentAccountDto } from '../../../application/dtos/payment-account/create-payment-account.dto';
import { UpdatePaymentAccountDto } from '../../../application/dtos/payment-account/update-payment-account.dto';

export interface PaymentAccountFilter {
  isActive?: boolean;
  accountType?: string;
  bankName?: string;
  search?: string; // Search in accountName, accountType, bankName
}

export interface IPaymentAccountRepository {
  create(data: CreatePaymentAccountDto): Promise<any>;
  findById(id: number): Promise<any>;
  findAll(filter?: PaymentAccountFilter): Promise<any[]>;
  findActive(): Promise<any[]>;
  update(id: number, data: UpdatePaymentAccountDto): Promise<any>;
  delete(id: number): Promise<void>;
  count(filter?: PaymentAccountFilter): Promise<number>;
  findWithTransactionCount(): Promise<any[]>;
}
