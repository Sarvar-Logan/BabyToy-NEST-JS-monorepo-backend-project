import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Order, OrderItem, Orders } from '../../libs/dto/order/order';
import { OrderAdminInqury, OrderInput, OrderInqury, OrderItemInput } from '../../libs/dto/order/order.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { OrderUpdateInput } from '../../libs/dto/order/order.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

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



  //USER 
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
    return await this.orderService.updateMyOrder(memberId, input);
  }


  //ADMIN
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Orders)
  public async getMemberOrdersByAdmin(@Args("input") input: OrderAdminInqury): Promise<Orders> {
    const result = await this.orderService.getMemberOrdersByAdmin(input);
    return result
  }

  //ADMIN
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Order)
  public async updateMemberOrdersByAdmin(@Args("input") input: OrderUpdateInput): Promise<Order> {
    console.log("Mutation: updateMemberOrdersByAdmin")
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.orderService.updateMemberOrdersByAdmin(input);
  }

  //ADMIN
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Order)
  public async removeMemberOrdersByAdmin(@Args("input") input: string): Promise<Order> {
    console.log("Mutation: removeMemberOrdersByAdmin");
    const inputId = shapeIntoMongoObjectId(input);
    return await this.orderService.removeMemberOrdersByAdmin(inputId);
  }
}




