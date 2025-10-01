import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderItem } from '../../libs/dto/order/order';

@Injectable()
export class OrderService {

  constructor( 
    @InjectModel("Order") private readonly orderModel: Model<Order>,
    @InjectModel("OrderItem") private readonly orderItemModel: Model<OrderItem>
){}
}
