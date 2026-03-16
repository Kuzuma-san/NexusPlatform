import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { RolePermission } from "./role-permission.entity";

@Table({tableName: 'permissions'})
export class Permission extends Model<Permission>{
    @Column({
        type: DataType.STRING,
        unique: true
    })
    name: string;

    @Column({
        type: DataType.STRING,
    })
    description: string;

    @HasMany(() => RolePermission)
    rolePermission: RolePermission[];
}