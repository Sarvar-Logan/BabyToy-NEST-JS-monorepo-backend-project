import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product, Products } from '../../libs/dto/product/product';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AllProductsInquiry, ProductInput, ProductsInquiry } from '../../libs/dto/product/proudct.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import type { ObjectId } from 'mongoose';
import { ProductUpdate } from '../../libs/dto/product/product.update';

@Resolver()
export class ProductResolver {

  constructor(private productService: ProductService) { }

  // ADMIN
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Product)
  public async createProduct(@Args("input") input: ProductInput): Promise<Product> {
    const result = await this.productService.createProduct(input)
    return result
  }
 
 
   // ADMIN
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Product)
  public async updateProduct(@Args("input") input: ProductUpdate): Promise<Product> {
    input._id = shapeIntoMongoObjectId(input._id);
    const result = await this.productService.upadateProductByAdmin(input)
    return result
  }
 
  @UseGuards(WithoutGuard)
  @Query(() => Product)
  public async getProduct(@Args("productId") input: string, @AuthMember('_id') memberId: ObjectId): Promise<Product | null> {
    const targetId = shapeIntoMongoObjectId(input);
    const result = await this.productService.getProduct(targetId, memberId)
    return result
  }



  @UseGuards(WithoutGuard)
  @Query(() => Products)
  public async getProducts(
    @Args('input') input : ProductsInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Products>{
    console.log('Query: getProducts');
    return await this.productService.getProducts(memberId, input);
  }




  /* ADMIN */
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query((returns) => Products)
  public async getAllProductsByAdmin(
      @Args('input') input: AllProductsInquiry,
      @AuthMember('_id') memberId: ObjectId,
  ): Promise<Products> {
      console.log('Query: getAllProductsByAdmin');
      return await this.productService.getAllProductsByAdmin(input);
  }



  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation((returns) => Product)
  public async removeProductByAdmin(@Args('productId') input: string): Promise<Product> {
      console.log('Mutation: removeProductByAdmin');
      const propertyId = shapeIntoMongoObjectId(input);
    return await this.productService.removeProductByAdmin(propertyId);
  }
}