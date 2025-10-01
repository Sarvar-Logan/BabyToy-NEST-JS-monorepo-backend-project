import { registerEnumType } from "@nestjs/graphql";

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