import { Field, Int, ObjectType } from "@nestjs/graphql";
import type { ObjectId } from "mongoose";
import { ProductStatus, ProductType } from "../../enums/product.enum";
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";


@ObjectType()
export class Product {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => ProductType)
  productType: ProductType;

  @Field(() => ProductStatus)
  productStatus: ProductStatus;

  @Field(() => String)
  productName: string;


  @Field(() => Number)
  productPrice: number;

  @Field(() => Int)
  productViews: number;

  @Field(() => Int)
  productLikes: number;

  @Field(() => Int)
  productComments: number;

  @Field(() => Int)
  productRank: number;

  @Field(() => [String], { nullable: true })
  productImages?: string[];

  @Field(() => String, { nullable: true })
  productDesc?: string;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => Date)
  createdAt?: Date;

  @Field(() => Date)
  updatedAt?: Date;


  // from aggregation
  @Field(() => Member, { nullable: true })
  memberData?: Member;

  @Field(() => [MeLiked], { nullable: true })
  meLiked?: MeLiked[];

  //  @Field(() => [MeFollowed], {nullable: true})
  //  meFollowed?: MeFollowed[];
}


/* PROPERTIES */
@ObjectType()
export class Products {
  @Field(() => [Product])
  list: Product[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}