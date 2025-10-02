import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { MongooseModule } from '@nestjs/mongoose';
import LikeSchema from '../../schemas/Like.model';
import { AuthModule } from '../auth/auth.module';
import { Like } from '../../libs/dto/like/like';

@Module({
  imports: [
    MongooseModule.forFeature([{name: "Like", schema: LikeSchema}]),
  ],
  providers: [LikeService],
  exports: [LikeService]
})
export class LikeModule {}
