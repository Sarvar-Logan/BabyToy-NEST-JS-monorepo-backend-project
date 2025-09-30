import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { LoginInput, MemberInput } from '../../libs/dto/member.input';
import { Member } from '../../libs/dto/member';
import { InternalServerErrorException } from '@nestjs/common';

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
  @Mutation(() => String)
  public async updateMember(): Promise<string> {
    console.log("Mutation: updateMember");
    return this.memberService.updateMember();

  }


  @Query(() => String)
  public async getMember(): Promise<string> {
    console.log("Query: getMember");
    return this.memberService.getMember();
  }





  // ADMIN 
  // AUTHORIZET
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



