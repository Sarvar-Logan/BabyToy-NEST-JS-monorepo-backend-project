import { Injectable } from '@nestjs/common';
import { genSalt } from 'bcryptjs';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  public async hashPassowrd(memberPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(memberPassword, salt);
  }

  public async compare(password, hashedPassowrd): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassowrd);
  }
}
