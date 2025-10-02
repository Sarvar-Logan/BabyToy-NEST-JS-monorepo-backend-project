import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Order, OrderItem, Orders } from '../../libs/dto/order/order';
import {  OrderInput, OrderItemInput } from '../../libs/dto/order/order.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';

@Resolver()
export class OrderResolver {

  constructor(private readonly orderService: OrderService) { }


  //USER 
  @UseGuards(AuthGuard)
  @Mutation(() => Order)
  public async createOrder(@Args("input") input: OrderInput, @AuthMember("_id") memberId: ObjectId ): Promise<Order> {

    console.log("memberId:", memberId);
    console.log("Mutation: createOrder")
    return await this.orderService.createOrder(input, memberId);
  }



  // @UseGuards(AuthGuard) 
  // @Query(() => Order) 
  // public async getMyOrders(@Args("input") input: OrdersInqurey): Promise<Orders>
}
