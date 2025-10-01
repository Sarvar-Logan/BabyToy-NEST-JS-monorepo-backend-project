import mongoose, {ObjectId} from "mongoose"

export const shapeIntoMongoObjectId  = (target: any) =>  {
  return typeof target === "string" ? new mongoose.Types.ObjectId(target) : target
}


export const availableAgentSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews", "memberRank" ];

export const availableMemberSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews" ];