import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { OrderItem } from '../../orders/entities/order-item.entity';

const SUPPORTED_CURRENCIES = {
    USD: "USD",
    INR: "INR",
}as const; //first const is JS protects Currency from reassigning completely
//But Currency.USD = ABC is also possible so we use as const in TS which also protects its values
export type Currency = typeof SUPPORTED_CURRENCIES[keyof typeof SUPPORTED_CURRENCIES];
export const CURRENCY_VALUES = Object.values(SUPPORTED_CURRENCIES);
/*typeof: give typeof values for all keys in obj
typeOf SUPPORTED_CURRENCIES gives 
{USD: "USD",
INR: "INR",}
keyof: extracts keys of na obj type: 
keyof ({USD: "USD",
INR: "INR",}) gives "USD" | "INR"
*/

@Table({tableName: 'products'})
export class Product extends Model<Product> {
    @Column
    name: string;

    @Column({
        type: DataType.DECIMAL,
    })
    price: number;

    @Column({
        type: DataType.STRING,
        defaultValue: "INR",
    })
    currency: Currency;

    @Column
    stock: number;

    @Column
    description: string;

    @HasMany(() => OrderItem)
    items: OrderItem[]; //single product ccan be in many orderItems hence the array
    //also notice we didnt gove it a column..cuz its for nest or sequelize to create logical realtion or joins and not an actual column in table

    // @Column
    // lowStockThreshold: number; //if stock<lowStock thresold trigger ALERT
    //Soft delete later
}
