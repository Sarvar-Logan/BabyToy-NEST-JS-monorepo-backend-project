import { Controller, Get } from '@nestjs/common';
import { BabytoyBatchService } from './babytoy-batch.service';

@Controller()
export class BabytoyBatchController {
  constructor(private readonly babytoyBatchService: BabytoyBatchService) {}

  @Get()
  getHello(): string {
    return this.babytoyBatchService.getHello();
  }
}
