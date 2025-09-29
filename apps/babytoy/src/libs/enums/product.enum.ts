import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
 PLAYSET = 'PLAYSET',
 CONTROL = 'CONTROL', 
 EDUCATIONAL = 'EDUCATIONAL', 
 ECO_FRIENDLY = 'ECO-FRIENDLY', 
 STUFFED = 'STUFFED',
}
registerEnumType(ProductType, {
	name: 'ProductType',
});

export enum ProductStatus {
	PAUSE = 'PAUSE', 
  PROCESS = 'PROCESS', 
  DELETE = 'DELETE'
}
registerEnumType(ProductStatus, {
	name: 'ProductStatus',
});


