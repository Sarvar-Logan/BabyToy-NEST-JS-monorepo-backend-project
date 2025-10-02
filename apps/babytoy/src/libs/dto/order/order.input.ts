import { Field, InputType, Int } from "@nestjs/graphql";
import { ArrayMinSize, IsNotEmpty, isNotEmpty, Length, Min, ValidateNested } from "class-validator";
import type { ObjectId } from "mongoose";
import { OrderStatus } from "../../enums/order.enum";
import { Type } from "class-transformer";

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
export class OrderInput {
  @Type(() => OrderItemInput)   // array ichidagi elementlarni OrderItemInput ga map qiladi
  @ArrayMinSize(1)
  @Field(() => [OrderItemInput])
  orderInput: OrderItemInput[]
}




@InputType()
export class OrderInqury {
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