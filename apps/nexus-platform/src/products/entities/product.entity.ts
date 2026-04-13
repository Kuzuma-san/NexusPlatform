import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Currency } from '../../common/constants/currency';
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
@Table({tableName: 'products'})
export class Product extends Model<
    InferAttributes<Product>,
    InferCreationAttributes<Product, {omit: 'items'}>
> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.DECIMAL,
        allowNull: false,
    })
    declare price: number;

    @Column({
        type: DataType.STRING,
        defaultValue: "INR",
    })
    declare currency: CreationOptional<Currency>;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare stock: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare description?: CreationOptional<string>;

    @HasMany(() => OrderItem)
    declare items: OrderItem[]; //single product ccan be in many orderItems hence the array
    //also notice we didnt gove it a column..cuz its for nest or sequelize to create logical realtion or joins and not an actual column in table

    // @Column
    // lowStockThreshold: number; //if stock<lowStock thresold trigger ALERT
    //Soft delete later
}
