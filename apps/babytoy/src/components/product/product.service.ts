import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Product, Products } from '../../libs/dto/product/product';
import { AllProductsInquiry, OrdinaryInquiry, ProductInput, ProductsInquiry } from '../../libs/dto/product/product.input';
import { Message } from '../../libs/enums/common.enum';
import { ProductStatus } from '../../libs/enums/product.enum';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewService } from '../view/view.service';
import { MemberService } from '../member/member.service';
import { Direction, StatisticModifier, T } from '../../libs/types/common';
import { ProductUpdate } from '../../libs/dto/product/product.update';
import { measureMemory } from 'vm';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import moment from 'moment';
import { LikeService } from '../like/like.service';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel("Product") private readonly productModel: Model<Product>,
    private memberService: MemberService,
    private viewService: ViewService,
    private likeService: LikeService,

  ) { }


  // USER
  public async getProduct(targetId: ObjectId, memberId: ObjectId): Promise<Product | null> {
    const search: T = { _id: targetId, productStatus: ProductStatus.PROCESS };
    const targetProduct: Product | null = await this.productModel.findOne(search).lean().exec();
    if (!targetProduct) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    if (memberId) {
      const viewInput: ViewInput = { memberId: memberId, viewRefId: targetId, viewGroup: ViewGroup.PRODUCT };
      const newView = await this.viewService.recordView(viewInput);
      if (newView) await this.productStatsEditor({ _id: targetId, targetKey: "productViews", modifier: 1 });
      targetProduct.productViews++
      
      //owner of this product--
      /* targetProduct.memberData = await this.memberService.getMember(null, targetProduct._id)
         --- agar product kimga tegishli data kerak  bolsa bu yerda kerak emas ---
       */
      
      // meLiked++
      const likeInput = { memberId: memberId, likeRefId: targetId, likeGroup: LikeGroup.PRODUCT };
      targetProduct.meLiked = await this.likeService.checkLikeExistance(likeInput);
    }
    return targetProduct;
  }




  // USER
  public async getProducts(memberId: ObjectId, input: ProductsInquiry): Promise<Products> {
    const match: T = { productStatus: ProductStatus.PROCESS };
    const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
    this.shapeMatchQuery(match, input);
    console.log('match:', match);
    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },

              // owners of Products
              // lookupMember,
              // { $unwind: '$memberData' },
              // meLiked ++
              
              lookupAuthMemberLiked(memberId),
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    console.log('RESULT:', result);
    return result[0];
  }


  private shapeMatchQuery(match: T, input: ProductsInquiry): void {
    const {
      memberId,
      productType,
      pricesRange,
      text,
    } = input.search;
    if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
    if (productType && productType.length) match.productType = { $in: productType };
    if (pricesRange) match.propertyPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
    if (text) match.productName = { $regex: new RegExp(text, 'i') };
  }






  // LIKE LOGIC
  public async likeTargetProduct(memberId: ObjectId, likeRefId: ObjectId): Promise<Product> {
    const target: Product = await this.productModel.findOne({ _id: likeRefId, productStatus: ProductStatus.PROCESS }).exec();
    if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    const input: LikeInput = {
      memberId: memberId,
      likeRefId: likeRefId,
      likeGroup: LikeGroup.PRODUCT
    };

    const modifier: number = await this.likeService.toggleLike(input);
    const result = await this.productStatsEditor({ _id: likeRefId, targetKey: "productLikes", modifier: modifier });

    if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
    return result;

  }

  // RECENTLY VISITED PRODCUTS
  public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Products> {
    return await this.viewService.getVisitedProducts(memberId, input);
  }



  // MY FAVORITE PRODCUTS
  public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<Products> {
    return await this.likeService.getFavoriteProducts(memberId, input);
  }







  // ADMIN
  public async createProduct(input: ProductInput): Promise<Product> {
    const result = await this.productModel.create(input)
    if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED)
    console.log("RESULT:", result);
    return result
  }



  // ADMIN
  public async upadateProductByAdmin(input: ProductUpdate): Promise<Product> {
    let { deletedAt, productStatus } = input;
    const search: T = {
      _id: input._id,
      productStatus: ProductStatus.PROCESS,
    };
    if (productStatus === ProductStatus.DELETE) deletedAt = moment().toDate();
    const result = await this.productModel.findOneAndUpdate(search, input, { new: true }).exec();
    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    return result;
  }


  // ADMIN
  public async getAllProductsByAdmin(input: AllProductsInquiry): Promise<Products> {
    const { productStatus, productType } = input.search;
    const match: T = {};
    const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
    if (productStatus) match.productStatus = productStatus;
    if (productType) match.productTypeList = { $in: productType };
    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              // lookupMember,
              // { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();
    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result[0];
  }



  // ADMIN
  public async removeProductByAdmin(productId: ObjectId): Promise<Product> {
    const search: T = { _id: productId, productStatus: ProductStatus.DELETE };
    const result = await this.productModel.findOneAndDelete(search).exec();
    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
    return result;
  }




  public async productStatsEditor(input: StatisticModifier): Promise<Product | null> {
    const { _id, targetKey, modifier } = input;
    return await this.productModel.findOneAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
  }
}
