import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Product, Products } from '../../libs/dto/product/product';
import { AllProductsInquiry, ProductInput, ProductsInquiry } from '../../libs/dto/product/proudct.input';
import { Message } from '../../libs/enums/common.enum';
import { ProductStatus } from '../../libs/enums/product.enum';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewService } from '../view/view.service';
import { MemberService } from '../member/member.service';
import { Direction, StatisticModifier, T } from '../../libs/types/common';
import { ProductUpdate } from '../../libs/dto/product/product.update';
import { measureMemory } from 'vm';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import moment from 'moment';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel("Product") private readonly productModel: Model<Product>,
    private memberService: MemberService,
    private viewService: ViewService,
  ) { }

  public async createProduct(input: ProductInput): Promise<Product> {
    const result = await this.productModel.create(input)
    if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED)
    console.log("RESULT:", result);
    return result
  }



  public async getProduct(targetId: ObjectId, memberId: ObjectId): Promise<Product | null> {
    const search: T = { _id: targetId, productStatus: ProductStatus.PROCESS };

    const targetProduct: Product | null = await this.productModel.findOne(search).lean().exec();
    if (!targetProduct) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    if (memberId) {
      const viewInput: ViewInput = { memberId: memberId, viewRefId: targetId, viewGroup: ViewGroup.PRODUCT };
      const newView = await this.viewService.recordView(viewInput);

      if (newView) await this.propertyStatsEditor({ _id: targetId, targetKey: "productViews", modifier: 1 });
      targetProduct.productViews++
      // meLiked
    }
    // targetProduct.memberData = await this.memberService.getMember(null, targetProduct._id)
    return targetProduct;
  }



  public async upadateProductByAdmin(input: ProductUpdate): Promise<Product> {
    let {deletedAt, productStatus} = input;
       const search: T = {
        _id: input._id,
        productStatus: ProductStatus.PROCESS,
    };
 
    if(productStatus === ProductStatus.DELETE) deletedAt = moment().toDate();
 
    const result = await this.productModel.findOneAndUpdate(search,  input, { new: true }).exec();
    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    return result;
  }



  public async propertyStatsEditor(input: StatisticModifier): Promise<Product | null> {
    const { _id, targetKey, modifier } = input;
    return await this.productModel.findOneAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
  }





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
              // meLiked

              // lookupMember,
              // { $unwind: '$memberData' },
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
    if (productType) match.productType = { $in: productType };
    if (pricesRange) match.propertyPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
    if (text) match.productName = { $regex: new RegExp(text, 'i') };
  }




    public async getAllProductsByAdmin(input: AllProductsInquiry): Promise<Products> {
    const { productStatus, productTypeList } = input.search;
    const match: T = {};
    const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

    if (productStatus) match.productStatus = productStatus;
    if (productTypeList) match.productTypeList = { $in: productTypeList };

    const result = await this.productModel
    .aggregate([
        { $match: match },
        { $sort: sort },
        {
            $facet: {
                list: [
                    { $skip: (input.page - 1 ) * input.limit },
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




  public async removeProductByAdmin(productId: ObjectId): Promise<Product> {
    const search: T = { _id: productId, productStatus: ProductStatus.DELETE };
    const result = await this.productModel.findOneAndDelete(search).exec();
    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
    return result;
 }
}
