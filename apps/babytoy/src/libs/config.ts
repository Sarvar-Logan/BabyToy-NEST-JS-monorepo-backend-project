import mongoose, {ObjectId} from "mongoose"


export const availableAgentSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews", "memberRank" ];

export const availableMemberSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews" ];

export const availableProductsSorts = [
  'createdAt',
  'updatedAt',
  'productLikes',
  'productViews',
  'productRank',
  'productPrice',
];






 // IMAGE CONFIGURATION   // bu faqat uuid 11.0.0 pasda ishlaydi 13dan boshlab boshqa qilish kerak
 import { v4 as uuidv4 } from 'uuid';
 import * as path from 'path';
 
 export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
 export const getSerialForImage = (filename: string) => {
   const ext = path.parse(filename).ext;
   return uuidv4() + ext;
 };


export const shapeIntoMongoObjectId  = (target: any) =>  {
  return typeof target === "string" ? new mongoose.Types.ObjectId(target) : target
}




export const lookupMember = {
  $lookup: {
    from: 'members',
    localField: "memberId",
    foreignField: "_id",
    as: 'memberData',
  },

};
