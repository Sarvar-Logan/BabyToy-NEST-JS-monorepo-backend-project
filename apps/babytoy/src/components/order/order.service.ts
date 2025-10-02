import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema } from 'mongoose';
import { Order, OrderItem } from '../../libs/dto/order/order';
import { MemberService } from '../member/member.service';
import { OrderInput, OrderItemInput } from '../../libs/dto/order/order.input';
import { Message } from '../../libs/enums/common.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class OrderService {

  constructor(
    @InjectModel("Order") private readonly orderModel: Model<Order>,
    @InjectModel("OrderItem") private readonly orderItemModel: Model<OrderItem>,
    private memberService: MemberService
  ) { }


  public async createOrder(input: OrderInput, memberId: ObjectId): Promise<Order> {
    const amount = input.orderInput.reduce((acc, item) => {
      return acc + item.itemPrice * item.itemQuantity;
    }, 0);
    const delivery = amount < 100 ? 5 : 0;
    const order = { orderTotal: amount + delivery, orderDelivery: delivery, memberId: memberId }
    const newOrder = await this.orderModel.create(order);
    if(!newOrder) throw  new InternalServerErrorException(Message.CREATE_FAILED)
      const orderId = newOrder._id;
    this.recordOrderItem(orderId, input);
    return newOrder;
  }


   private async recordOrderItem(orderId: ObjectId, input: OrderInput): Promise<void> {
    const promisedList = input.orderInput.map( async (item: OrderItemInput) => {
      item.orderId = orderId;
      item.productId = shapeIntoMongoObjectId(item.productId);
      await this.orderItemModel.create(item);
      return "INSERTED"
    });
    const orderItemsState = await Promise.all(promisedList)
    console.log("orderItemsState:", orderItemsState);

  }
}

