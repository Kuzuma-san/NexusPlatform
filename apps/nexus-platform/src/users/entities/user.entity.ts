import { Model, Table, Column, DataType, HasMany } from "sequelize-typescript";
import { Order } from "../../orders/entities/order.entity";
import { UserRole } from "../../rbac/entities/user-role.entity";
import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";



@Table({tableName: 'users'})
export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User, {omit: 'userRole' | 'orders'}>>{
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare currentHashedRefreshToken: CreationOptional<string | null>;

    // @Column({
    //     type: DataType.ENUM,
    // })
    // role: Roles;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    declare isActive: CreationOptional<boolean>;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare isVerified: CreationOptional<boolean>;
    @HasMany(() => UserRole)
    declare userRole: UserRole[];

    @HasMany(() => Order)
    declare orders: Order[]; // a user has many orders...Not a column just for sequelize to create relation and use those relations if needed

    // @Column
    // deletedAt?: any; //implement soft delete later
}
