import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Sequelize } from 'sequelize';


@Injectable()
export class OrdersService {

  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,

    @InjectModel(OrderItem)
    private orderItemModel: typeof OrderItem,

    @InjectModel(Product)
    private productModel: typeof Product,

    @InjectConnection()
    private sequelize: Sequelize,
  ){}

  // only admin can create order else order must pass through users cart
  async create(createOrderDto: CreateOrderDto) {
    // order dto has items:arr of products  and currency i.e same for every product in a timezone
    const currency = createOrderDto.currrency;
    // const sequelize = new Sequelize();//inject sequelize connection instead
    // const transaction = sequelize.transaction();//M1 
    // M1 Transaction: const transaction = sequelize.transaction() on start then transaction.commit on end or transaction.rollback on error
    //Cons: manual rollack on error in catch block and manual commit in try
    //M2 (recommened): use a callback function in sequelize.transaction...auto commits on function end and auto rollback on error
    return await this.sequelize.transaction(async (t) => {
      //M2 : pass t as option while running db queries so sequelize knows what to rollback
      var totalAmount = 0;
      for(const item of createOrderDto.items){
        const product = await this.productModel.findByPk(item.productId, {transaction: t});
        if(!product){
          throw new NotFoundException("Product not Found");
        }
        const quantity = item.quantity;
        const price = product.price;// or const price = product.get({plain: true}).price; i.e convert to plain object
        const stock = product.stock;

        if(stock < quantity){
          //we send error to frontend and then it decides what to shwo to the user
          throw new BadRequestException("Insufficient Stock");
        }
        //calculate the totalamount 
        totalAmount += price*quantity;
      }
      //createOrderDto.items.forEach( async (item) => {}); unlike above loop this doesnt wait for async
      //Create the order after all order items are looped through
      const order = await this.orderModel.create({
        totalAmount,
        currency: createOrderDto.currrency,
        userId: 1,
      }, {transaction: t});
      //create orderITem for each Item and reduce the stock
      for(const item of createOrderDto.items){
        const product = await this.productModel.findByPk(item.productId,{transaction:t});
        const quantity = item.quantity;
        const priceAtPurchase = product.price;
        const price = product.price * quantity;
        const updatedStock = product.stock - quantity;

        await this.orderItemModel.create({
          orderId: order.id,
          productId: product.id,
          quantity,
          priceAtPurchase,
          price,
        },{transaction:t});

        await product.update({
          stock: updatedStock,
        },{
          where: {id: product.id},
          transaction: t,
        });
      }
    });
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
