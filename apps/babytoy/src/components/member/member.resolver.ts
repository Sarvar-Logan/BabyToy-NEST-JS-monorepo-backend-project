import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { InternalServerErrorException, Optional, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type {ObjectId} from "mongoose"
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) { }

  @Mutation(() => Member)
  public async singup(@Args('input') input: MemberInput): Promise<Member> {
      console.log("Mutation: signup")
      return this.memberService.signup(input)

  }

  @Mutation(() => Member)
  public async login(@Args('input') input: LoginInput): Promise<Member> {
      console.log("Mutation: login");
      return this.memberService.login(input);
  }

//Authenticated
  @UseGuards(AuthGuard)
  @Mutation(() => Member)
  public async updateMember(
    @Args('input') input: MemberUpdate, 
    @AuthMember('_id') memberId: ObjectId
  ): Promise<Member | null> {
    console.log("Mutation: updateMember");
    console.log("ID:", memberId)
    delete (input as any)._id;

    return this.memberService.updateMember(memberId, input);
  }
  @UseGuards(WithoutGuard)
  @Query(() => Member)
  public async getMember(@AuthMember('_id') memberId: ObjectId, @Args("input") refId: string): Promise<Member> {
    console.log("Query: getMember");
    const targetId = shapeIntoMongoObjectId(refId);
    return this.memberService.getMember(memberId, targetId);
  }


  
  @UseGuards(AuthGuard)
  @Query(() => String)
  public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
    return `Hi ${memberNick}`
  }

  @Roles(MemberType.ADMIN, MemberType.USER)
  @UseGuards(RolesGuard)
  @Query(() => String)
  public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
    return `Hi ${authMember.memberNick}, you are ${authMember.memberType}, your id ${authMember._id}`
  }







  // ADMIN 
  // AUTHORIZET
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Array(Member))
  public async getAllMemmbersByAdmin(): Promise<Member[]> {
    console.log("Query: getAllMemmbersByAdmin");
    return this.memberService.getAllMemmbersByAdmin();
  }


  @Mutation(() => String)
  public async uptadateMemberByAdmin(): Promise<string> {
    console.log("Mutation: uptadateMemberByAdmin");
    return this.memberService.uptadateMemberByAdmin();
  }
}



