import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowResolver } from './follow.resolver';
import { MemberModule } from '../member/member.module';
import { AuthModule } from '../auth/auth.module';
import FollowSchema from '../../schemas/Follow.model';

@Module({
  imports: [
    MemberModule,
    MongooseModule.forFeature([{ name: "Follow", schema: FollowSchema }]),
    AuthModule,
  ],
  providers: [FollowService, FollowResolver],
  exports: [FollowService]
})
export class FollowModule { }
