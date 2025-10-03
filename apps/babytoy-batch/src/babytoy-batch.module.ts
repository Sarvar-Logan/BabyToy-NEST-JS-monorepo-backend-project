import { Module } from '@nestjs/common';
import { BabytoyBatchController } from './babytoy-batch.controller';
import { BabytoyBatchService } from './babytoy-batch.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from 'apps/babytoy/src/schemas/Member.model';
import ProductSchema from 'apps/babytoy/src/schemas/Product.model';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    DatabaseModule, 
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{name: "Product", schema: ProductSchema}]),
    MongooseModule.forFeature([{name: "Member", schema: MemberSchema}]),
  ],
  controllers: [BabytoyBatchController],
  providers: [BabytoyBatchService],
})
export class BabytoyBatchModule {}
