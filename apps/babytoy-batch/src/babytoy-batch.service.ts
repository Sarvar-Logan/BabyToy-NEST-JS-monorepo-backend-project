import { Injectable } from '@nestjs/common';

@Injectable()
export class BabytoyBatchService {
  getHello(): string {
    return 'WELCOME TO BABYTOY BATCH SERVER';
  }
}
