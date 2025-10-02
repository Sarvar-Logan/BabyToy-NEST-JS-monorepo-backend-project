import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product, Products } from '../../libs/dto/product/product';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AllProductsInquiry, OrdinaryInquiry, ProductInput, ProductsInquiry } from '../../libs/dto/product/product.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import type { ObjectId } from 'mongoose';
import { ProductUpdate } from '../../libs/dto/product/product.update';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class ProductResolver {

  constructor(private readonly productService: ProductService) { }

  // USER
  @UseGuards(WithoutGuard)
  @Query(() => Products)
  public async getProducts(
    @Args('input') input: ProductsInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Products> {
    console.log('Query: getProducts');
    return await this.productService.getProducts(memberId, input);
  }

  // USER
  @UseGuards(WithoutGuard)
  @Query(() => Product)
  public async getProduct(@Args("productId") input: string, @AuthMember('_id') memberId: ObjectId): Promise<Product | null> {
    const targetId = shapeIntoMongoObjectId(input);
    const result = await this.productService.getProduct(targetId, memberId)
    return result
  }


  // RECENTLY VISITED PRODCUTS
  @UseGuards(AuthGuard)
  @Query((returns) => Products)
  public async getVisited(
    @Args('input') input: OrdinaryInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Products> {
    console.log('Query: getFavorites');
    return await this.productService.getVisited(memberId, input);
  }



  // MY FAVORITE PRODCUTS
  @UseGuards(AuthGuard)
  @Query((returns) => Products)
  public async getFavorites(
    @Args('input') input: OrdinaryInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Products> {
    console.log('Query: getFavorites');
    return await this.productService.getFavorites(memberId, input);
  }



  //LIKE LOGIC
  @UseGuards(AuthGuard)
  @Mutation(() => Product)
  public async likeTargetProduct(
    @Args("productId") input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Product> {
    console.log("Mutation: likeTargetProperty");
    const likeRefId = shapeIntoMongoObjectId(input);
    return await this.productService.likeTargetProduct(memberId, likeRefId);
  }


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


  // ADMIN
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Product)
  public async removeProductByAdmin(@Args('productId') input: string): Promise<Product> {
    console.log('Mutation: removeProductByAdmin');
    const productId = shapeIntoMongoObjectId(input);
    return await this.productService.removeProductByAdmin(productId);
  }
}