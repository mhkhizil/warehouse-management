import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentAccountResponseDto {
  @ApiProperty({
    description: 'Payment account ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the payment account',
    example: 'Main Business Account',
  })
  accountName: string;

  @ApiProperty({
    description: 'Type of payment account',
    example: 'Bank Account',
  })
  accountType: string;

  @ApiPropertyOptional({
    description: 'Account number or identifier',
    example: '****7890',
  })
  accountNumber?: string;

  @ApiPropertyOptional({
    description: 'Bank or financial institution name',
    example: 'ABC Bank',
  })
  bankName?: string;

  @ApiPropertyOptional({
    description: 'Account holder name',
    example: 'John Doe Business',
  })
  accountHolder?: string;

  @ApiPropertyOptional({
    description: 'Additional description about the account',
    example: 'Primary account for online transactions',
  })
  description?: string;

  @ApiProperty({
    description: 'Whether the account is active for transactions',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Account balance (if tracked)',
    example: 10000.5,
  })
  balance?: number;

  @ApiProperty({
    description: 'Number of transactions using this account',
    example: 25,
  })
  transactionCount?: number;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Account last update date',
    example: '2024-01-20T15:45:00Z',
  })
  updatedAt: Date;

  constructor(paymentAccount: any) {
    this.id = paymentAccount.id;
    this.accountName = paymentAccount.accountName;
    this.accountType = paymentAccount.accountType;
    this.accountNumber = paymentAccount.accountNumber
      ? this.maskAccountNumber(paymentAccount.accountNumber)
      : undefined;
    this.bankName = paymentAccount.bankName;
    this.accountHolder = paymentAccount.accountHolder;
    this.description = paymentAccount.description;
    this.isActive = paymentAccount.isActive;
    this.balance = paymentAccount.balance;
    this.transactionCount =
      paymentAccount._count?.transactions ||
      paymentAccount.transactions?.length ||
      0;
    this.createdAt = paymentAccount.createdAt;
    this.updatedAt = paymentAccount.updatedAt;
  }

  /**
   * Mask account number for security (show only last 4 digits)
   */
  private maskAccountNumber(accountNumber: string): string {
    if (!accountNumber || accountNumber.length <= 4) {
      return accountNumber;
    }
    return '****' + accountNumber.slice(-4);
  }
}
