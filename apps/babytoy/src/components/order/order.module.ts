import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import orderSchema from '../../schemas/Order.model';
import { OrderItem } from '../../libs/dto/order/order';
import orderItemSchema from '../../schemas/OrderItem.model';
import OrderSchema from '../../schemas/Order.model';
import OrderItemSchema from '../../schemas/OrderItem.model';

@Module({
  imports: [
    MongooseModule.forFeature([{name: "Order", schema: OrderSchema}]), 
    MongooseModule.forFeature([{name: "OrderItem", schema: OrderItemSchema}])
],
  providers: [OrderResolver, OrderService]
})
export class OrderModule {}
