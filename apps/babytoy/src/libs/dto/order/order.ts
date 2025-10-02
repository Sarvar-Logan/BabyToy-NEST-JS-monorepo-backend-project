import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, isNotEmpty, Length, Min } from "class-validator";
import type { ObjectId } from "mongoose";
import { OrderStatus } from "../../enums/order.enum";
import { Product } from "../product/product";
import { Member, Members, TotalCounter } from "../member/member";

@ObjectType()
export class OrderItem {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => Number)
  itemQuantity: number;


  @Field(() => Number)
  itemPrice: number;


  @Field(() => String)
  productId: ObjectId;


  @Field(() => String, { nullable: true })
  orderId?: ObjectId;


  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;

  // @Field(() => Product, { nullable: true })
  // productData?: Product;   // ⚡ endi array emas, obyekt

}



@ObjectType()
export class Order {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => Number)
  orderTotal: number;


  @Field(() => Number)
  orderDelivery: number;


  @Field(() => String)
  orderStatus: OrderStatus;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;


  //from aggregation\
  @Field(() => [Product], { nullable: true })
  productData?: Product[];

  @Field(() => Member, { nullable: true })
  memberData?: Member;
 
  @Field(() => [OrderItem], { nullable: true })
  orderItems?: OrderItem[];
}


@ObjectType()
export class Orders {
  @Field(() => [Order])
  list: Order[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}


@ObjectType()
export class Products {
  @Field(() => [Product])
  list: Product[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}