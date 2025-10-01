import { registerEnumType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";

export interface T {
  [key: string]: any;
}


export enum Direction {
  ASC = 1,
  DESC = -1,

}

registerEnumType(Direction, {
  name: "Direction"
});



export interface StatisticModifier {
  _id: ObjectId,
  targetKey: string,
  modifier: number,
}