import { BelongsTo, Column, DataType, ForeignKey, Table, Model } from "sequelize-typescript";
import { Product } from "../../products/entities/product.entity";
import { Order } from "./order.entity";
import { Col } from "sequelize/types/utils";
import { InferAttributes, InferCreationAttributes } from "sequelize";

@Table({tableName: 'order_item'})
export class OrderItem extends Model<
    InferAttributes<OrderItem>,
    InferCreationAttributes<OrderItem, {omit: 'order' | 'product'}>
> {
    @Column
    @ForeignKey(() => Order)
    declare orderId: number;
    @BelongsTo(() => Order)
    declare order: Order;

    @Column
    @ForeignKey(() => Product)
    declare productId: number;
    @BelongsTo(() => Product)
    declare product: Product;

    @Column
    declare quantity: number;

    @Column({
        type: DataType.DECIMAL,
    })
    declare priceAtPurchase: number;

    @Column({
        type: DataType.DECIMAL,
    })
    declare price: number; // stores snapshot of the price so if price changes later the orderitem remains same
    //for this we must first calculate the orderItem price from product and quantity and then calculate orderItem price and then use that price and not the productPrice cuz that would beat the purpose of having a orderItem price in the first place

}