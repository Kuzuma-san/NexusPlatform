import { QueryInterface, DataTypes } from "sequelize";

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('orders', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            totalAmount: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },

            currency: {
                type: DataTypes.ENUM('USD', 'INR'),
                allowNull: false,
                defaultValue: 'INR',
            },

            // FK column — references users.id
            // onDelete RESTRICT: prevents deleting a user who has orders
            // onUpdate CASCADE: if users.id changes, update this column too
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
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
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('orders');
    },
};
