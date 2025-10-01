import { registerEnumType } from "@nestjs/graphql";

export enum OrderStatus {
  PAUSE="PAUSE",
  FINISH="FINISH",
  PROCESS="PROCESS",
  DELETE="DELETE", 
}

registerEnumType(OrderStatus, {
  name: "OrderStatus"
})