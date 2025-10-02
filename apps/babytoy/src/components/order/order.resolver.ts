import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Order, OrderItem, Orders } from '../../libs/dto/order/order';
import { OrderInput, OrderInqury, OrderItemInput } from '../../libs/dto/order/order.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { OrderUpdateInput } from '../../libs/dto/order/order.update';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class OrderResolver {

  constructor(private readonly orderService: OrderService) { }


  //USER 
  @UseGuards(AuthGuard)
  @Mutation(() => Order)
  public async createOrder(@Args("input") input: OrderInput, @AuthMember("_id") memberId: ObjectId): Promise<Order> {
    console.log("Mutation: createOrder")
    return await this.orderService.createOrder(input, memberId);
  }



  @UseGuards(AuthGuard)
  @Query(() => Orders)
  public async getMyOrders(@Args("input") input: OrderInqury, @AuthMember('_id') memberId: ObjectId): Promise<Orders> {
      const result = await this.orderService.getMyOrders(memberId, input);
      return result
  }



   //USER 
  @UseGuards(AuthGuard)
  @Mutation(() => Order)
  public async updateMyOrder(@Args("input") input: OrderUpdateInput, @AuthMember("_id") memberId: ObjectId): Promise<Order> {
    console.log("Mutation: updateMyOrder")
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.orderService.updateMyOrder( memberId, input);
  }
}
