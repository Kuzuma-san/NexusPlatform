import { BelongsTo, Column, DataType, ForeignKey, Table, Model, HasMany, DeletedAt } from "sequelize-typescript";
import { Currency, CURRENCY_VALUES } from "../../common/constants/currency";
import { User } from "../../users/entities/user.entity";
import { OrderItem } from "./order-item.entity";
import { InferAttributes, InferCreationAttributes } from "sequelize";

@Table({tableName: 'orders', paranoid: true})
export class Order extends Model<
    InferAttributes<Order>,
    InferCreationAttributes<Order, {omit: 'user' | 'items'}>
> {
    // @Column
    // orderNumber: string;

    @Column({
        type: DataType.DECIMAL,
    })
    declare totalAmount: number;

    @Column({
        type: DataType.ENUM(...CURRENCY_VALUES),
        defaultValue: "INR"
    })
    declare currency: Currency;

    @DeletedAt
    declare deletedAt: Date | null;

    @ForeignKey(
        () => {
            return User;
        }
    )
    @Column
    declare userId: number;
    @BelongsTo(() => User)// 1 order per user 
    declare user: User;

    @HasMany(() => OrderItem)
    declare items: OrderItem[];


    //As for products one order can have many products and one product can be in may orders
    //So use a junction table OrderItem
    /*eg.  1.   Apple     order1
           2.   Banana.   order1
           3.   Apple     order2
        1 order multiple products and one product in multiple orders while each combination
        having a unique id
        orderItem belongsto order: ie. order hasmany orderItems
        orderItem belongsto product: product is in many orderItems
User
 └── hasMany Orders

Order
 └── hasMany OrderItems

OrderItem
 ├── belongsTo Order
 └── belongsTo Product

Product
 └── hasMany OrderItems
    */
}
