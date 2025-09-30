import { Injectable } from '@nestjs/common';
import { genSalt } from 'bcryptjs';
import bcrypt from 'bcryptjs';
import { Member } from '../../libs/dto/member';
import { JwtService } from '@nestjs/jwt';
import { T } from '../../libs/types/common';

@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService) { }

  public async hashPassowrd(memberPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(memberPassword, salt);
  }

  public async compare(password, hashedPassowrd): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassowrd);
  }


  // cretae acces token with jwt
  public async createToken(member: Member): Promise<string> {
    const payload: T = {};
    Object.keys(member['_doc'] ? member['_doc'] : member).map((ele) => {
      payload[`${ele}`] = member[`${ele}`];
    });
    delete payload.memberPassword
    return await this.jwtService.signAsync(payload);

  }

    // verify token to member
    public async verifyToken(token: string): Promise<Member> {
      const member = await this.jwtService.verifyAsync(token)
      return member
    }

}
