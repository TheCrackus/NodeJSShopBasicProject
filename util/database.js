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

/**
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
 */

/**
 * The next code works with mongodb
 */

/**
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

let db;

const mongoConnection = (cb) => {
    mongoClient.connect(
        'mongodb+srv://edgarcarrenofonseca_db_user:IT4KKujqjARKWXLh@cluster0.np1ji96.mongodb.net/shop?appName=Cluster0'
    )
        .then(client => {
            console.log("Connected!");
            db = client.db();
            cb();
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

const getDb = () => {
    if (db) {
        return db;
    } else {
        throw 'No mongo database!';
    }
}

exports.mongoConnection = mongoConnection;
exports.getDb = getDb;
*/
