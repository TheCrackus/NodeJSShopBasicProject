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
