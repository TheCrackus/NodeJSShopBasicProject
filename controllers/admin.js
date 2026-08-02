const { where } = require('sequelize');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render(
        'admin/edit-product',
        {
            pageTitle: 'Add product',
            path: '/admin/add-product',
            editing: false
        }
    );
}

/**
 * The next code works with JSON data into local files
 */

/**
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(
        null,
        title,
        imageUrl,
        description,
        price
    );
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    Product.fecthProducts(
        products => {
            res.render(
                'admin/products',
                {
                    prods: products,
                    pageTitle: 'Admin products',
                    path: '/admin/products'
                }
            );
        }
    );
}

exports.getEditProduct = (req, res, next) => {
    const editmode = req.query.edit;
    if (!editmode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findProductById(
        prodId,
        (prod) => {
            if (!prod) {
                return res.redirect('/');
            }
            res.render(
                'admin/edit-product',
                {
                    pageTitle: 'Edit product',
                    path: '/admin/edit-product',
                    editing: editmode,
                    prod: prod
                }
            );
        }
    );
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedProd = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDescription,
        updatedPrice
    );
    updatedProd.save();
    res.redirect('/admin/products');
}

exports.deleteProducts = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteProductById(prodId);
    res.redirect('/admin/products');
}
 */

/**
 * The next code works with SQL database and MySQL Server
 */

/**
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(
        null,
        title,
        imageUrl,
        description,
        price
    );
    product.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(error => {
            console.log(error);
        });
}
 */

/**
 * The next code works with Sequelize
 */

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }).then(() => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
}

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then(products => {
            res.render(
                'admin/products',
                {
                    prods: products,
                    pageTitle: 'Admin products',
                    path: '/admin/products'
                }
            );
        })
        .catch(error => {
            console.log(error);
        });
}

exports.getEditProduct = (req, res, next) => {
    const editmode = req.query.edit;
    if (!editmode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    req.user.getProducts({ where: { id: prodId } })
        .then(products => {
            const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render(
                'admin/edit-product',
                {
                    pageTitle: 'Edit product',
                    path: '/admin/edit-product',
                    editing: editmode,
                    prod: product
                }
            );
        })
        .catch(error => {
            console.log(error);
        });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    Product.findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save();
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        });
}

exports.deleteProducts = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        });
}
