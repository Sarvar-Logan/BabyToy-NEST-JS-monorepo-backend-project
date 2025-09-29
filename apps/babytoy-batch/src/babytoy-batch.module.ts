import { Module } from '@nestjs/common';
import { BabytoyBatchController } from './babytoy-batch.controller';
import { BabytoyBatchService } from './babytoy-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [BabytoyBatchController],
  providers: [BabytoyBatchService],
})
export class BabytoyBatchModule {}
