const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fecthProducts(
        (products) => {
            res.render(
                'shop/product-list',
                {
                    prods: products,
                    pageTitle: 'All products',
                    path: '/products'
                }
            );
        }
    );
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findProductById(
        prodId,
        (product) => {
            res.render(
                'shop/product-detail',
                {
                    prod: product,
                    pageTitle: product.title,
                    path: '/products'
                }
            );
        }
    );
}

exports.getIndex = (req, res, next) => {
    Product.fecthProducts(
        (products) => {
            res.render(
                'shop/index',
                {
                    prods: products,
                    pageTitle: 'Shop',
                    path: '/'
                }
            );
        }
    );
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findProductById(prodId, (prod) => {
        Cart.addProduct(prod.id, prod.price);
    });
    res.redirect('/cart');
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fecthProducts(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({prodData: product, quantity: cartProductData.quantity});
                }
            }
            res.render(
                'shop/cart',
                {
                    pageTitle: 'Your Cart',
                    path: '/cart',
                    prods: cartProducts
                }
            );
        });
    });
}


exports.getOrders = (req, res, next) => {
    res.render(
        'shop/orders',
        {
            pageTitle: 'Your Orders',
            path: '/orders'
        }
    );
}

exports.getCheckout = (req, res, next) => {
    res.render(
        'shop/checkout',
        {
            pageTitle: 'Checkout',
            path: '/checkout'
        }
    );
}
