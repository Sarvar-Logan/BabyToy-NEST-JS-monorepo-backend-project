import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import orderSchema from '../../schemas/Order.model';
import { OrderItem } from '../../libs/dto/order/order';
import orderItemSchema from '../../schemas/OrderItem.model';
import OrderSchema from '../../schemas/Order.model';
import OrderItemSchema from '../../schemas/OrderItem.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Order", schema: OrderSchema }, { name: "OrderItem", schema: OrderItemSchema }]),
    AuthModule,
    MemberModule
  ],
  providers: [OrderResolver, OrderService]
})
export class OrderModule { }
