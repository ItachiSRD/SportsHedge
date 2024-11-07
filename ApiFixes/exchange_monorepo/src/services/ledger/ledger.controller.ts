import { Controller, Get } from '@nestjs/common';
import { LedgerService } from './ledger.service';

@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get()
  async test() {
    const bookId = '7';
    const output = await this.ledgerService.getBookBalances(bookId, []);
    // const output = await this.ledgerService.postOperation('MohanJodaro', [
    //   {
    //     from: '1',
    //     to: '7',
    //     amount: 799,
    //     instrument: 'KOHLI',
    //   },
    // ]);
    return output;
  }
}
