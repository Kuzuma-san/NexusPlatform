import { Model, Table, Column, DataType } from "sequelize-typescript";

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

}
