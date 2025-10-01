import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, isNotEmpty, Length, Min } from "class-validator";
import type { ObjectId } from "mongoose";
import { OrderStatus } from "../../enums/order.enum";

@InputType()
export class OrderItemInput {


  @IsNotEmpty()
  @Field(() => Number)
  itemQuantity: number;


  @IsNotEmpty()
  @Field(() => Number)
  itemPrice: number;


  @IsNotEmpty()
  @Field(() => String)
  productId: ObjectId;


  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  orderId?: ObjectId;

}



@InputType()
export class OderInqury {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;


  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number


  @IsNotEmpty()
  @Field(() => OrderStatus)
  orderStatus: OrderStatus;

}