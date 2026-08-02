/**
 * The next commented code works with sql2
 */

/**
const mySql = require('mysql2');

const pool = mySql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'Node_JS_Basic_Shop',
    password: 'Crackxx991223!'
});

module.exports = pool.promise();
 */

/**
 * The next code works with sequlize
 */

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'Node_JS_Basic_Shop', 
    'root', 
    'Crackxx991223!', 
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

module.exports = sequelize;
