import {  Field, InputType, Int} from "@nestjs/graphql";
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import type { ObjectId } from "mongoose";
import { ProductStatus, ProductType } from "../../enums/product.enum";
import { availableProductsSorts } from "../../config";
import { Direction } from "../../types/common";




@InputType()
export class ProductInput{
@IsNotEmpty()
@Field(() => ProductType)
productType: ProductType;




@IsNotEmpty()
@Length(3, 20)
@Field(() => String)
productName: string;

@IsNotEmpty()
@Field(() => Number)
productPrice: number;


@IsNotEmpty()
@Field(() => Number)
productLeftCount: number;


@IsOptional()
@Field(() =>[String], {nullable: true})
productImages?: string[];


@IsNotEmpty()
@Length(5,500)
@Field(() => String)
productDesc: string;


@IsOptional()
@Field(() => ProductStatus, {nullable: true})
productStatus?: ProductStatus;


}



@InputType()
export class PricesRange{
   @Field(() => Int)
   start: number;

   @Field(() => Int)
   end: number;
}




@InputType()
class PISearch {
  @IsOptional()
  @Field(() => String, { nullable: true })
  memberId?: ObjectId;

  @IsOptional()
  @Field(() => [ProductType], { nullable: true })
  productType?: ProductType[];

  @IsOptional()
  @Field(() => [Int], { nullable: true })
  bedsList?: Number[];

  @IsOptional()
  @Field(() => PricesRange, { nullable: true })
  pricesRange?: PricesRange;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}


@InputType()
export class ProductsInquiry{

   @IsNotEmpty()
   @Min(1)
   @Field(() => Int)
   page: number;

   @IsNotEmpty()
   @Min(1)
   @Field(() => Int)
   limit: number;

   @IsOptional()
   @IsIn(availableProductsSorts)
   @Field(() => String, {nullable: true})
   sort?: string;

   @IsOptional()
   @Field(() => Direction, {nullable: true})
   direction?: Direction;

   @IsNotEmpty()
   @Field(() => PISearch)
   search: PISearch;

}



@InputType()
export class ALPISearch {
    @IsOptional()
    @Field(() => ProductStatus, { nullable: true })
    productStatus?: ProductStatus;

    @IsOptional()
    @Field(() => [ProductType], { nullable: true })
    productTypeList?: ProductType[];
}


@InputType()
export class AllProductsInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableProductsSorts)
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => ALPISearch)
    search: ALPISearch;
}