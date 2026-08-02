/**
 * The next code works with Sequelize
 */

const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const CartItem = sequelize.define(
    'cartItems',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        quantity: Sequelize.INTEGER
    }
);

module.exports = CartItem;
