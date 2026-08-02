/**
 * The next code works with JSON data into local files
 */

/**
const fs = require('fs');
const path = require('path');
const Cart = require('./cart');
const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);

const getProductsFromFile = data => {
    fs.readFile(
        p,
        (error, fileContent) => {
            if (error) {
                data([]);
            } else {
                data(JSON.parse(fileContent));
            }
        }
    );
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

save() {
        getProductsFromFile(
            products => {
                if (this.id) {
                    const existingProdIndex = products.findIndex(p => p.id === this.id);
                    const updatedProducts = [...products];
                    updatedProducts[existingProdIndex] = this;
                    fs.writeFile(p, JSON.stringify(updatedProducts), error => {
                        console.log(error);
                    });
                } else {
                    this.id = Math.random().toString();
                    products.push(this);
                    fs.writeFile(p, JSON.stringify(products), error => {
                        console.log(error);
                    });
                }
            }
        );
    }

    static deleteProductById(id) {
        getProductsFromFile(products => {
            const prod = products.find(p => p.id === id);
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), error => {
                console.log(error);
                if (!error) {
                    Cart.deleteProductById(id, prod.price);
                }
            });
        });
    }

    static fecthProducts(products) {
        getProductsFromFile(products);
    }

    static findProductById(id, product) {
        getProductsFromFile(products => {
            const prod = products.find(p => p.id === id);
            product(prod);
        });
    }
}
 */

/**
 * The next code works with SQL database and MySQL server
 */

/**
const db = require('../util/database');

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute(
            'INSERT INTO products(title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.description, this.imageUrl]
        );
    }

    static fecthProducts(products) {
        return db.execute('SELECT * FROM products');
    }

    static findProductById(id) {
        return db.execute(
            'SELECT * FROM products WHERE products.id = ?',
            [id]
        );
    }
}
 */

/**
 * The next code works with Sequlize
 */

const Sequlize = require('sequelize');

const sequalize = require('../util/database');

const Product = sequalize.define(
    'product',
    {
        id: {
            type: Sequlize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: Sequlize.STRING,
        price: {
            type: Sequlize.DOUBLE,
            allowNull: false
        },
        imageUrl: {
            type: Sequlize.STRING,
            allowNull: false
        },
        description: {
            type: Sequlize.STRING,
            allowNull: false
        }
    }
);

module.exports = Product;
