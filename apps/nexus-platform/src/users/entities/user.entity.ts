import { Model, Table, Column, DataType, DeletedAt, HasMany } from "sequelize-typescript";
import { Order } from "../../orders/entities/order.entity";
import { UserRole } from "../../rbac/entities/user-role.entity";



@Table({tableName: 'users'})
export class User extends Model<User>{
    @Column({
        type: DataType.STRING,
    })
    username: string;

    @Column({
        type: DataType.STRING
    })
    email: string;

    @Column({
        type: DataType.STRING,
    })
    password: string;

    // @Column({
    //     type: DataType.ENUM,
    // })
    // role: Roles;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    isActive: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    isVerified: boolean;

    @HasMany(() => UserRole)
    userRole: UserRole[];

    @HasMany(() => Order)
    orders: Order[]; // a user has many orders...Not a column just for sequelize to create relation and use those relations if needed

    // @Column
    // deletedAt?: any; //implement soft delete later
}
