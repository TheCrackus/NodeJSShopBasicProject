const Product = require('../models/product');
const Cart = require('../models/cart');

/**
* The next code works with JSON data into local files
*/

/**
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

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fecthProducts(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ prodData: product, quantity: cartProductData.quantity });
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

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findProductById(prodId, (prod) => {
        Cart.addProduct(prod.id, prod.price);
    });
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findProductById(prodId, prod => {
        Cart.deleteProductById(prod.id, prod.price);
        res.redirect('/cart');
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
 */

/**
 * The next code works with SQL database and MySQL server
*/

/**
exports.getProducts = (req, res, next) => {
    Product.fecthProducts()
        .then(([rows, filedData]) => {
            res.render(
                'shop/product-list',
                {
                    prods: rows,
                    pageTitle: 'All products',
                    path: '/products'
                }
            );
        })
        .catch(error => {
            console.log(error);
        });
}

exports.getIndex = (req, res, next) => {
    Product.fecthProducts()
        .then(([rows, filedData]) => {
            res.render(
                'shop/index',
                {
                    prods: rows,
                    pageTitle: 'Shop',
                    path: '/'
                }
            );
        })
        .catch(error => {
            console.log(error);
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findProductById(prodId)
        .then(([rows, filedData]) => {
            res.render(
                'shop/product-detail',
                {
                    prod: rows[0],
                    pageTitle: rows[0].title,
                    path: '/products'
                }
            );
        })
        .catch(error => {
            console.log(error);
        });
}
 */

/**
 * The next code works with Sequelize
*/

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render(
                'shop/product-list',
                {
                    prods: products,
                    pageTitle: 'All products',
                    path: '/products'
                }
            );
        })
        .catch(error => {
            console.log(error);
        });
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render(
                'shop/index',
                {
                    prods: products,
                    pageTitle: 'Shop',
                    path: '/'
                }
            );
        })
        .catch(error => {
            console.log(error);
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            res.render(
                'shop/product-detail',
                {
                    prod: product,
                    pageTitle: product.title,
                    path: '/products'
                }
            );
        })
        .catch(error => {
            console.log(error);
        });
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            res.render(
                'shop/cart',
                {
                    pageTitle: 'Your Cart',
                    path: '/cart',
                    prods: products
                }
            );
        })
        .catch(error => {
            console.log(error);
        });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    let cartProduct;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(cartProducts => {
            if (cartProducts.length > 0) {
                cartProduct = cartProducts[0];
            }
            if (cartProduct) {
                const oldQuantity = cartProduct.cartItems.quantity;
                newQuantity = oldQuantity + 1;

                return cartProduct;
            } else {
                return Product.findByPk(prodId);
            }
        })
        .then(product => {
            return fetchedCart.addProduct(
                product,
                { through: { quantity: newQuantity } }
            );
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(userCart => {
            return userCart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItems.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        });
}

exports.postCreateOrder = (req, res, next) => {
    let fecthedCart;
    let fetchedProducts;
    req.user.getCart()
        .then(userCart => {
            fecthedCart = userCart;
            return userCart.getProducts();
        })
        .then(products => {
            fetchedProducts = products;
            return req.user.createOrder();
        })
        .then(order => {
            return order.addProducts(
                fetchedProducts.map(product => {
                    product.orderItems = { quantity: product.cartItems.quantity };
                    return product;
                })
            );
        })
        .then(result => {
            return fecthedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(error => {
            console.log(error);
        });
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
        .then(orders => {
            res.render(
                'shop/orders',
                {
                    pageTitle: 'Your Orders',
                    path: '/orders',
                    orders: orders
                }
            );
        })
        .catch();
}
