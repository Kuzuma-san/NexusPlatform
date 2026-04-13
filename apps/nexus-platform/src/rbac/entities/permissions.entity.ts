import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { RolePermission } from "./role-permission.entity";
import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";

@Table({tableName: 'permissions'})
export class Permission extends Model<
    InferAttributes<Permission>,
    InferCreationAttributes<Permission, {omit: 'rolePermission'}>
>{
    @Column({
        type: DataType.STRING,
        unique: true
    })
    declare name: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare description?: CreationOptional<string>;

    @HasMany(() => RolePermission)
    declare rolePermission: RolePermission[];
}