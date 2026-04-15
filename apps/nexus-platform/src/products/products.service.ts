import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ){}

  //Admin Seller...User and Guest cannot make products
  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.create(createProductDto);
    this.logger.log(`Product created: productId=${product.id}`);
    return product;
  }

  //All
  findAll() {
    return this.productModel.findAll();
  }

  //All
  findOne(id: number) {
    return this.productModel.findByPk(id);
  }

  //Admin Seller
  async update(id: number, updateProductDto: UpdateProductDto) {
    const [numberOfRowsAffected] = await this.productModel.update(updateProductDto,{
      where: {id},
    });
    if(numberOfRowsAffected === 0) {
      this.logger.warn(`Product update had no effect: productId=${id}`);
    } else {
      this.logger.log(`Product updated: productId=${id}`);
    }
    return { numberOfRowsAffected };
  }

  //Admin and seller..seller only his products
  async remove(id: number) {
    const product = await this.findOne(id);
    if(!product){
      this.logger.warn(`Delete attempted on non-existent product: productId=${id}`);
      throw new NotFoundException("Product Not Found");
    }
    await this.productModel.destroy({ where: {id} });
    this.logger.log(`Product deleted: productId=${id}`);
  }
}
