import { QueryInterface, DataTypes } from "sequelize";

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('order_item', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            // FK → orders.id
            // CASCADE: if an order is deleted, its items are deleted too
            // Order items have no meaning without their parent order
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            // FK → products.id
            // RESTRICT: don't allow deleting a product that has order history
            // A buyer's purchase record must always point to a valid product row
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },

            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            // Snapshot of price at the time of purchase
            // Stored separately so future product price changes
            // don't alter historical order records
            priceAtPurchase: {
                type: DataTypes.DECIMAL,
                allowNull: false,
            },

            // quantity * priceAtPurchase — pre-computed line total
            price: {
                type: DataTypes.DECIMAL,
                allowNull: false,
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
        await queryInterface.dropTable('order_item');
    },
};
