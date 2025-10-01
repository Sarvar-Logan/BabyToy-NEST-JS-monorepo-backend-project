import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import type { ObjectId } from "mongoose";
import { ProductStatus, ProductType } from "../../enums/product.enum";
import { OrderStatus } from "../../enums/order.enum";


@InputType()
export class OrderUpdateInput{
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsNotEmpty()
  @Field(() => OrderStatus)
  orderStatus: OrderStatus;
}