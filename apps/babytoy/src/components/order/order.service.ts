import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema } from 'mongoose';
import { Order, OrderItem, Orders } from '../../libs/dto/order/order';
import { MemberService } from '../member/member.service';
import { OrderAdminInqury, OrderInput, OrderInqury, OrderItemInput } from '../../libs/dto/order/order.input';
import { Message } from '../../libs/enums/common.enum';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { OrderUpdateInput } from '../../libs/dto/order/order.update';
import { OrderStatus } from '../../libs/enums/order.enum';
import { StatisticModifier, T } from '../../libs/types/common';

@Injectable()
export class OrderService {

  constructor(
    @InjectModel("Order") private readonly orderModel: Model<Order>,
    @InjectModel("OrderItem") private readonly orderItemModel: Model<OrderItem>,
    private memberService: MemberService
  ) { }


  public async createOrder(input: OrderInput, memberId: ObjectId): Promise<Order> {
    const amount = input.orderInput.reduce((acc, item) => {
      return acc + item.itemPrice * item.itemQuantity;
    }, 0);
    const delivery = amount < 100 ? 5 : 0;
    const order = { orderTotal: amount + delivery, orderDelivery: delivery, memberId: memberId }
    const newOrder = await this.orderModel.create(order);
    if (!newOrder) throw new InternalServerErrorException(Message.CREATE_FAILED)
    const orderId = newOrder._id;
    this.recordOrderItem(orderId, input);
    return newOrder;
  }


  private async recordOrderItem(orderId: ObjectId, input: OrderInput): Promise<void> {
    const promisedList = input.orderInput.map(async (item: OrderItemInput) => {
      item.orderId = orderId;
      item.productId = shapeIntoMongoObjectId(item.productId);
      await this.orderItemModel.create(item);
      return "INSERTED"
    });
    const orderItemsState = await Promise.all(promisedList)
    console.log("orderItemsState:", orderItemsState);

  }





  public async getMyOrders(memberId: ObjectId, input: OrderInqury): Promise<Orders> {
    const matches = { memberId: memberId, orderStatus: input.orderStatus };
    const result = await this.orderModel.aggregate([
      { $match: matches },
      { $sort: { updatedAt: -1 } },
      {
        $facet: {
          list: [
            { $skip: (input.page - 1) * input.limit },
            { $limit: input.limit },
            {
              $lookup: {
                from: "orderItems",
                localField: "_id",
                foreignField: "orderId",
                as: "orderItems",
              }
            },
            {
              $lookup: {
                from: "products",
                let: { productId: "$orderItems.productId" },
                pipeline: [
                  { $match: { $expr: { $in: ["$_id", "$$productId"] } } }
                ],
                as: "productData"
              }
            },

            lookupMember,
            { $unwind: { path: "$memberData", preserveNullAndEmptyArrays: true } },
          ],
          metaCounter: [{ $count: 'total' }],
        },
      },

    ]).exec();
    return result[0]
  };




  public async updateMyOrder(id: ObjectId, input: OrderUpdateInput): Promise<Order> {
     const orderStatus = input.orderStatus;

    const result = await this.orderModel
      .findByIdAndUpdate({ memberId: id, _id: input._id }, { orderStatus: orderStatus }, { new: true }).exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    if (orderStatus === OrderStatus.PROCESS) {
      const pointArgs: StatisticModifier = {_id: id, targetKey: "memberPoints", modifier: 1}
      const memberOrdersCount: StatisticModifier = {_id: id, targetKey: "memberOrders", modifier: 1}
      await this.memberService.memberStatsEditor(pointArgs);
      await this.memberService.memberStatsEditor(memberOrdersCount);
    }
    return result;
  }







  //ADMIN
  public async getMemberOrdersByAdmin(input: OrderAdminInqury): Promise<Orders> {
    const match: T = {}
    const orderStatus = input.orderStatus;
    if(orderStatus) match.orderStatus = orderStatus;
    const result = await this.orderModel.aggregate([
      { $match: match },
      { $sort: { updatedAt: -1 } },
      {
        $facet: {
          list: [
            { $skip: (input.page - 1) * input.limit },
            { $limit: input.limit },
            {
              $lookup: {
                from: "orderItems",
                localField: "_id",
                foreignField: "orderId",
                as: "orderItems",
              }
            },
            {
              $lookup: {
                from: "products",
                let: { productId: "$orderItems.productId" },
                pipeline: [
                  { $match: { $expr: { $in: ["$_id", "$$productId"] } } }
                ],
                as: "productData"
              }
            },

            lookupMember,
            { $unwind: { path: "$memberData", preserveNullAndEmptyArrays: true } },
          ],
          metaCounter: [{ $count: 'total' }],
        },
      },

    ]).exec();
    return result[0]
  };

}

