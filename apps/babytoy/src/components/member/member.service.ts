import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
  constructor(@InjectModel("Member") private readonly memberModel: Model<null>) { }

  public signup = async (): Promise<string> => {
    return "signup Executed"
  }

  public async login(): Promise<string> {
    return "login executed"
  }


  public async updateMember(): Promise<string> {
    return "updateMember executed"
  }


  public async getMember(): Promise<string> {
    return "getMember executed"
  }

}
