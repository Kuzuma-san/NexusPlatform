import { Model, Table, Column, DataType, HasMany, DeletedAt } from 'sequelize-typescript';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Currency, CURRENCY_VALUES } from '../../common/constants/currency';
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
@Table({tableName: 'products', paranoid: true})
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
        type: DataType.ENUM(...CURRENCY_VALUES),
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

    @DeletedAt
    declare deletedAt: Date | null;

    @HasMany(() => OrderItem)
    declare items: OrderItem[]; //single product ccan be in many orderItems hence the array
    //also notice we didnt gove it a column..cuz its for nest or sequelize to create logical realtion or joins and not an actual column in table

    // @Column
    // lowStockThreshold: number; //if stock<lowStock thresold trigger ALERT
    //Soft delete later
}
