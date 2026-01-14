import { ApiProperty } from '@nestjs/swagger';
import { PaymentAccountResponseDto } from './payment-account-response.dto';

export class PaymentAccountListResponseDto {
  @ApiProperty({
    description: 'List of payment accounts',
    type: [PaymentAccountResponseDto],
  })
  data: PaymentAccountResponseDto[];

  @ApiProperty({
    description: 'Total number of payment accounts',
    example: 5,
  })
  total: number;

  @ApiProperty({
    description: 'Number of active payment accounts',
    example: 4,
  })
  activeCount: number;

  @ApiProperty({
    description: 'Number of inactive payment accounts',
    example: 1,
  })
  inactiveCount: number;

  constructor(paymentAccounts: any[], total: number) {
    this.data = paymentAccounts.map(
      (account) => new PaymentAccountResponseDto(account),
    );
    this.total = total;
    this.activeCount = paymentAccounts.filter(
      (account) => account.isActive,
    ).length;
    this.inactiveCount = paymentAccounts.filter(
      (account) => !account.isActive,
    ).length;
  }
}
