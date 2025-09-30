import mongoose, {ObjectId} from "mongoose"

export const shapeIntoMongoObjectId  = (target: any) =>  {
  return typeof target === "string" ? new mongoose.Types.ObjectId(target) : target
}