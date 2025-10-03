import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/babytoy/src/libs/dto/member/member';
import { Product } from 'apps/babytoy/src/libs/dto/product/product';
import { MemberStatus, MemberType } from 'apps/babytoy/src/libs/enums/member.enum';
import { ProductStatus } from 'apps/babytoy/src/libs/enums/product.enum';
import { Model } from 'mongoose';

@Injectable()
export class BabytoyBatchService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('Member') private readonly memberModel: Model<Member>,
  ) { }


  public async batchRollback(): Promise<void> {
    await this.productModel
      .updateMany(
        {
          productStatus: ProductStatus.PROCESS,
        },

        { propertyRank: 0 },
      ).exec();

    await this.memberModel
      .updateMany(
        {
          memberStatus: MemberStatus.ACTIVE,
          memberType: MemberType.USER,
        },
        { memberRank: 0 },
      )
      .exec();
  }

  public async batchTopProperties(): Promise<void> {
    const products: Product[] = await this.productModel
      .find({
        productStatus: ProductStatus.PROCESS,
        propertyRank: 0,
      })
      .exec();

    const promisedList = products.map(async (ele: Product) => {
      const { _id, productLikes, productViews } = ele;
      const rank = productLikes * 2 + productViews * 1;
      return await this.productModel.findByIdAndUpdate(_id, { productRank: rank });
    });
    await Promise.all(promisedList);

  }

  public async batchTopUsers(): Promise<void> {
    const users: Member[] = await this.memberModel
      .find({
        memberType: MemberType.USER,
        memberStatus: MemberStatus.ACTIVE,
        memberRank: 0,
      })
      .exec();

    const promisedList = users.map(async (ele: Member) => {
      const { _id, memberOrders, memberLikes, memberArticles, memberViews } = ele;
      const rank = memberOrders * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
      return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
    });
    await Promise.all(promisedList);
  }


  public getHello(): string {
    return 'Welcome to Nestar BATCH Server!';
  }

}
