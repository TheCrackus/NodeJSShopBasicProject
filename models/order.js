/**
 * The next code works with Sequelize
 */

const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define(
    'order',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        }
    }
);

module.exports = Order;
