import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Member } from '../../libs/dto/member';
import { LoginInput, MemberInput } from '../../libs/dto/member.input';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member.update';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel("Member")
    private readonly memberModel: Model<Member>,
    private authService: AuthService
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
      if(!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND)
      result.accessToken = await this.authService.createToken(result);
    console.log("inut:", result)

    return result
  }


  public async getMember(): Promise<string> {
    return "getMember executed"
  }





  // ADMIN 
  public async getAllMemmbersByAdmin(): Promise<Member[]> {
    const result = await this.memberModel.find()
    return result
  }


  public async uptadateMemberByAdmin(): Promise<string> {
    return "Update method executed"
  }
}
