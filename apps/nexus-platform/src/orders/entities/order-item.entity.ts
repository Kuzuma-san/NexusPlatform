import { BelongsTo, Column, DataType, ForeignKey, Table, Model } from "sequelize-typescript";
import { Product } from "../../products/entities/product.entity";
import { Order } from "./order.entity";
import { Col } from "sequelize/types/utils";

@Table({tableName: 'order_item'})
export class OrderItem extends Model<OrderItem> {
    @Column
    @ForeignKey(() => Order)
    orderId: number;
    @BelongsTo(() => Order)
    order: Order;

    @Column
    @ForeignKey(() => Product)
    productId: number;
    @BelongsTo(() => Product)
    product: Product;

    @Column
    quantity: number;

    @Column({
        type: DataType.DECIMAL,
    })
    priceAtPurchase: number;

    @Column({
        type: DataType.DECIMAL,
    })
    price: number; // stores snapshot of the price so if price changes later the orderitem remains same
    //for this we must first calculate the orderItem price from product and quantity and then calculate orderItem price and then use that price and not the productPrice cuz that would beat the purpose of having a orderItem price in the first place

}