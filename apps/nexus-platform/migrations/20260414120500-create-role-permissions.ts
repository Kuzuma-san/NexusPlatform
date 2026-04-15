import { QueryInterface, DataTypes } from "sequelize";

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('role_permission', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE', // removing a role removes its permission assignments
            },

            permissionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'permissions',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT', // don't delete a permission that roles are using
            },

            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },

            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        });

        // Composite unique constraint: same role can't have the same permission twice
        await queryInterface.addIndex('role_permission', ['roleId', 'permissionId'], {
            unique: true,
            name: 'unique_role_permission',
        });

        // Index on roleId alone — RbacService queries WHERE roleId IN (...)
        // on every protected request. This index makes that fast.
        await queryInterface.addIndex('role_permission', ['roleId'], {
            name: 'idx_role_permission_role',
        });

        await queryInterface.addIndex('role_permission', ['permissionId'], {
            name: 'idx_role_permission_permission',
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        // Remove indexes before dropping the table
        await queryInterface.removeIndex('role_permission', 'unique_role_permission');
        await queryInterface.removeIndex('role_permission', 'idx_role_permission_role');
        await queryInterface.removeIndex('role_permission', 'idx_role_permission_permission');
        await queryInterface.dropTable('role_permission');
    },
};
