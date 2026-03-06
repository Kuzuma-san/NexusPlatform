import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Currency, Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ){}

  //Admin Seller...User and Guest cannot make products
  create(createProductDto: CreateProductDto) {
    // const currency: Currency = "INR"; 
    // return this.productModel.create({
    //   name: createProductDto.name,
    //   price: createProductDto.price,
    //   currency: currency,
    //   stock: createProductDto.stock,
    //   description: createProductDto.desciption
    // });
    return this.productModel.create(createProductDto);
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
      where: [{id}],
    });

    return { numberOfRowsAffected };
  }

  //Admin and seller..seller only his products
  async remove(id: number) {
    const product = this.findOne(id);
    if(!product){
      throw new NotFoundException("Product Not Found");
    }
    return this.productModel.destroy({
      where: [{id}],
    })
  }
}
