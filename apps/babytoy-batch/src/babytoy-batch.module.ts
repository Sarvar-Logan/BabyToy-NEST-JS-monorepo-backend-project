import { Module } from '@nestjs/common';
import { BabytoyBatchController } from './babytoy-batch.controller';
import { BabytoyBatchService } from './babytoy-batch.service';

@Module({
  imports: [],
  controllers: [BabytoyBatchController],
  providers: [BabytoyBatchService],
})
export class BabytoyBatchModule {}
