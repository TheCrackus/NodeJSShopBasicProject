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
}
