/**
 * The next code works with Sequelize
 */

/**
const Sequelize = require('Sequelize');

const sequelize = require('../util/database');

const User = sequelize.define(
    'user',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING
    }
);
 */

/**
 * The next code works with mongodb
 */

const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();

        return db.collection('users').insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.log(error);
            });
    }

    addToCart(product) {
        let cartProductIndex;
        let updatedCartItems;
        let newQuantity = 1;

        if (this.cart) {
            cartProductIndex = this.cart.items.findIndex(p => {
                return p.productId.toString() === product._id.toString();
            });
            updatedCartItems = [...this.cart.items];
        } else {
            cartProductIndex = -1;
            updatedCartItems = [];
        }

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push(
                {
                    productId: new mongodb.ObjectId(product._id),
                    quantity: newQuantity
                }
            );
        }

        const updatedCart = {
            items: updatedCartItems
        }

        const db = getDb();

        return db.collection('users').updateOne(
            {
                _id: new mongodb.ObjectId(this._id)
            },
            {
                $set: {
                    cart: updatedCart
                }
            }
        );
    }

    getCart() {
        const db = getDb();

        let productIds;

        if (this.cart) {
            productIds = this.cart.items.map(i => {
                return i.productId;
            });
        } else {
            productIds = [];
        }

        return db.collection('products').find(
            {
                _id: { $in: productIds }
            }
        )
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString()
                        }).quantity
                    };
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    deleteItemFromCart(productId) {
        const db = getDb();

        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });

        return db.collection('users').updateOne(
            {
                _id: new mongodb.ObjectId(this._id)
            },
            {
                $set: {
                    cart: { items: updatedCartItems }
                }
            }
        );
    }

    addOrder() {
        const db = getDb();

        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new mongodb.ObjectId(this._id),
                        name: this.name
                    }
                };

                return db.collection('orders')
                    .insertOne(order)
            })
            .then(result => {
                this.cart = { items: [] }

                return db.collection('users').updateOne(
                    {
                        _id: new mongodb.ObjectId(this._id)
                    },
                    {
                        $set: {
                            cart: { items: [] }
                        }
                    }
                );
            })
            .catch(error => {
                console.log(error);
            });
    }

    getOrders() {
        const db = getDb();

        return db.collection('orders')
            .find({ 'user._id': new mongodb.ObjectId(this._id) })
            .toArray();
    }

    static getUser(userId) {
        const db = getDb();

        return db.collection('users').find(
            {
                _id: new mongodb.ObjectId(userId)
            }
        )
            .next()
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(error => {
                console.log(error);
            });
    }
}

module.exports = User;
