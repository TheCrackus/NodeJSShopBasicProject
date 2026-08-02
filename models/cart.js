/**
 * The next code works with local JSON data files
 */

/**
const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, price) {
        fs.readFile(p, (error, fileContent) => {
            let cart = { products: [], total: 0 };
            if (!error) {
                cart = JSON.parse(fileContent);
            }
            const existingProdIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProd = cart.products[existingProdIndex];
            let updatedProd;
            if (existingProd) {
                updatedProd = { ...existingProd };
                updatedProd.quantity = updatedProd.quantity + 1;
                cart.products = [...cart.products];
                cart.products[existingProdIndex] = updatedProd;
            } else {
                updatedProd = { id: id, quantity: 1 };
                cart.products = [...cart.products, updatedProd];
            }
            cart.total = cart.total + +price;
            fs.writeFile(p, JSON.stringify(cart), (error) => {
                console.log(error);
            });
        });
    }

    static deleteProductById(id, productPrice) {
        fs.readFile(p, (error, fileContent) => {
            if (error) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            const prod = updatedCart.products.find(p => p.id === id);
            if (!prod) {
                return;
            }
            const prodQuantity = prod.quantity;
            updatedCart.products = updatedCart.products.filter(p => p.id !== id);
            updatedCart.total = updatedCart.total - productPrice * prodQuantity;
            fs.writeFile(p, JSON.stringify(updatedCart), (error) => {
                console.log(error);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (error, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (error) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
}
 */

/**
 * The next code works with Sequelize
 */

const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define(
    'cart',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        }
    }
);

module.exports = Cart;
