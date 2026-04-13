import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Op, Sequelize } from 'sequelize';


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
  async create(createOrderDto: CreateOrderDto, userId: number) {
    // const sequelize = new Sequelize();//inject sequelize connection instead
    // const transaction = sequelize.transaction();//M1 
    // M1 Transaction: const transaction = sequelize.transaction() on start then transaction.commit on end or transaction.rollback on error
    //Cons: manual rollack on error in catch block and manual commit in try
    //M2 (recommened): use a callback function in sequelize.transaction...auto commits on function end and auto rollback on error
    const productIds = createOrderDto.items.map((item) => item.productId);
    const products = await this.productModel.findAll({where:{id: {[Op.in]: productIds}}});
    const idToProductMap = new Map(products.map(p => [p.id, p]));
    return await this.sequelize.transaction(async (t) => {
      //M2 : pass t as option while running db queries so sequelize knows what to rollback
      let totalAmount = 0;
      for(const item of createOrderDto.items){
        const product = idToProductMap.get(item.productId);
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
        currency: createOrderDto.currency ?? "INR",
        userId,
      }, {transaction: t});
      //create orderITem for each Item and reduce the stock
      await Promise.all(
        createOrderDto.items.map((item) => {//With Promise.all, you use .map() instead of a for loop. .map() does not await — it just collects all the Promises into an array, then Promise.all fires them together:
          const product = idToProductMap.get(item.productId)!;
          
          return Promise.all([
            this.orderItemModel.create({
              orderId: order.id,
              productId: product.id,
              quantity: item.quantity,
              priceAtPurchase: product.price,
              price: product.price * item.quantity,
            }, { transaction: t }),

            product.decrement('stock', { by: item.quantity, transaction: t }),
          ]);
        })
      );//this just runs all at once and then wait for promises to resolve unlike waiting for each promise to resolve one at a time using await in a for loop (map is synchronus)
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
