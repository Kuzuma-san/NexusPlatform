
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { UserRole } from "../../rbac/entities/user-role.entity";
import { RolePermission } from "./role-permission.entity";
import { InferAttributes, InferCreationAttributes } from "sequelize";

@Table({tableName: 'roles'})
export class Role extends Model<
    InferAttributes<Role>,
    InferCreationAttributes<Role, {omit: 'userRole' | 'rolePermission'}>
>{
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    declare name: string;

    @HasMany(() => UserRole)
    declare userRole: UserRole[];

    @HasMany(() => RolePermission)
    declare rolePermission: RolePermission[];
}