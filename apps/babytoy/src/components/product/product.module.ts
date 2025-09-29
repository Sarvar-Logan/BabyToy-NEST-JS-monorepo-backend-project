import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import ProductSchema from '../../schemas/Product.model';

@Module({
  imports: [MongooseModule.forFeature([{name: "Product", schema: ProductSchema}])],
  providers: [ProductResolver, ProductService]
})
export class ProductModule {}
