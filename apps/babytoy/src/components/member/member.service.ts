import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Member, Members } from '../../libs/dto/member/member';
import { LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { Direction, StatisticModifier, T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewInput } from '../../libs/dto/view/view.input';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel("Member") private readonly memberModel: Model<Member>,
    private authService: AuthService,
    private viewService: ViewService
  ) { }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      input.memberPassword = await this.authService.hashPassowrd(input.memberPassword);
      const result = await this.memberModel.create(input);
      result.accessToken = await this.authService.createToken(result);
      return result
      // authentication via token 
    } catch (err) {
      console.log("Error, Servic.model:", err);
      throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    const { memberNick, memberPassword } = input
    const response = await this.memberModel.findOne({ memberNick: memberNick }).select("+memberPassword").exec();
    if (!response || response.memberStatus === MemberStatus.DELETE) {
      throw new InternalServerErrorException(Message.NO_MEMBER_NICK)
    } else if (response.memberStatus === MemberStatus.BLOCK) {
      throw new InternalServerErrorException(Message.BLOCKED_USER)
    }
    // todo compare passwords
    if (!memberPassword || !response.memberPassword) {
      throw new InternalServerErrorException("Passowrd is missing")
    }
    const isMatch = await this.authService.compare(memberPassword, response.memberPassword)

    if (!isMatch) {
      throw new InternalServerErrorException(Message.WRONG_PASSWORD);
    }
    response.accessToken = await this.authService.createToken(response);
    return response
  }


  public async updateMember(memberId: ObjectId, input: MemberUpdate): Promise<Member | null> {

    const result: Member | null = await this.memberModel.findOneAndUpdate(
      { _id: memberId, memberStatus: MemberStatus.ACTIVE },
      input,
      { new: true }
    ).
      exec();
    if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND)
    result.accessToken = await this.authService.createToken(result);

    return result
  }


  public async getMember(memberId: ObjectId, targetId: ObjectId): Promise<Member> {
    const search: T = {
      _id: targetId,
      memberStatus: {
        $in: [MemberStatus.ACTIVE, MemberStatus.BLOCK],
      },
    }
    const targetMember = await this.memberModel.findOne(search).lean().exec();
    if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    if (memberId) {
      const viewInput: ViewInput = { memberId: memberId, viewRefId: targetId, viewGroup: ViewGroup.MEMBER }
      const newView = await this.viewService.recordView(viewInput)
      if (newView) {
        const search: StatisticModifier = {_id: targetId, targetKey: "memberViews", modifier: 1} 
        await this.memberStatsEditor(search);
        // await this.memberModel.findOneAndUpdate(search, { $inc: { memberViews: 1 } }, { new: true });
        targetMember.memberViews++;
      }

      // meliked
      // mefollowed
    }
    return targetMember
  }


  public async getMembers(memberId: ObjectId, input: MembersInquiry): Promise<Members> {
    const { text } = input.search;
    const match: T = { memberType: MemberType.USER, memberStatus: MemberStatus.ACTIVE };  // only user && active
    const sort: T = { [input?.sort ?? "createdAt"]: input?.direction ?? Direction.DESC };
    if (text) match.memberNick = { $regex: new RegExp(text, 'i') };
    console.log("match:", match);

    const result = await this.memberModel.aggregate([
      { $match: match },
      { $sort: sort },
      {
        $facet: {
          list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
          metaCounter: [{ $count: "total" }],
        }
      }
    ]).exec();
    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result[0];
  }


  // ADMIN 
  public async getAllMembersByAdmin(input: MembersInquiry): Promise<Members> {
    const { memberType, memberStatus, text } = input.search; // all st
    const match: T = {};
    const sort: T = { [input?.sort ?? "createdAt"]: input?.direction ?? Direction.DESC };
    if (memberStatus) match.memberStatus = memberStatus;
    if (memberType) match.memberType = memberType;
    if (text) match.memberNick = { $regex: new RegExp(text, 'i') };
    console.log("match:", match);

    const result = await this.memberModel.aggregate([
      { $match: match },
      { $sort: sort },
      {
        $facet: {
          list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
          metaCounter: [{ $count: "total" }],
        }
      }
    ]).exec();
    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result[0];
  }


  public async updateMemberByAdmin(input: MemberUpdate): Promise<Member | null> {
    const result: Member | null = await this.memberModel.findByIdAndUpdate({ _id: input._id }, input, { new: true }).exec();
    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    return result;
  }


  public async memberStatsEditor(input: StatisticModifier): Promise<Member | null> {
    console.log("excuted");
    const { _id, targetKey, modifier } = input;
    return await this.memberModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
  }
}
