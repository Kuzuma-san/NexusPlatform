
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { UserRole } from "../../rbac/entities/user-role.entity";
import { RolePermission } from "./role-permission.entity";

@Table({tableName: 'roles'})
export class Role extends Model<Role>{
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    name: string;

    @HasMany(() => UserRole)
    userRole: UserRole[];

    @HasMany(() => RolePermission)
    rolePermission: RolePermission[];
}