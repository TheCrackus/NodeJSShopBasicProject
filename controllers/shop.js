const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fecthProducts(
        products => {
            res.render(
                'shop',
                {
                    prods: products,
                    pageTitle: 'Shop',
                    path: '/',
                    hasProducts: products.length > 0,
                    activeShop: true,
                    productCSS: true
                }
            );
        }
    );
}
