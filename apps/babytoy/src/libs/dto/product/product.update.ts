import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import type { ObjectId } from "mongoose";
import { ProductStatus, ProductType } from "../../enums/product.enum";


@InputType()
export class ProductUpdate{
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => ProductType, {nullable: true})
  propertyType?: ProductType;

  @IsOptional()
  @Field(() => ProductStatus, {nullable: true})
  propertyStatus?: ProductStatus;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, {nullable: true})
  productName?: string;
  
  @IsOptional()
  @Length(3, 100)
  @Field(() => String, {nullable: true})
  productDesc?: string;

  @IsOptional()
  @Field(() => Number, {nullable: true})
  productPrice?: number;


  @IsOptional()
  @Field(() => Number, {nullable: true})
  productLeftCount?: number;

 
  @IsOptional()
  @Field(() => [String], {nullable: true})
  productImages?: string;

  deletedAt?: Date;
}