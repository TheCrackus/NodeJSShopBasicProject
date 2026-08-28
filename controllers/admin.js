/**
 * The next code works with Sequelize
 */

/**
const { where } = require('sequelize');
 */

/**
 * The next code works with JSON data into local files
 */

/**
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

/**
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
 */

/**
 * The next code works with mongodb
 */

/**
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

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(
        title,
        price,
        description,
        imageUrl,
        null,
        req.user._id
    );
    product.save()
        .then(() => {
            res.redirect('/admin/products');
        }).catch(error => {
            console.log(error);
        });
}

exports.getProducts = (req, res, next) => {
    Product.getProducts()
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
    Product.getProduct(prodId)
        .then(product => {
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
    const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedDescription,
        updatedImageUrl,
        prodId,
        req.user._id
    );
    product.save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteProduct(prodId)
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        });
}
 */

/**
 * The next code works with mongoose
 */
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render(
        'admin/edit-product',
        {
            pageTitle: 'Add product',
            path: '/admin/add-product',
            editing: false,
            isAuthenticated: req.session.isLoggedIn
        }
    );
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save()
        .then(() => {
            res.redirect('/admin/products');
        }).catch(error => {
            console.log(error);
        });
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render(
                'admin/products',
                {
                    prods: products,
                    pageTitle: 'Admin products',
                    path: '/admin/products',
                    isAuthenticated: req.session.isLoggedIn
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
    Product.findById(prodId)
        .then(product => {
            res.render(
                'admin/edit-product',
                {
                    pageTitle: 'Edit product',
                    path: '/admin/edit-product',
                    editing: editmode,
                    prod: product,
                    isAuthenticated: req.session.isLoggedIn
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
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;

            return product.save();
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndDelete(prodId)
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(error => {
            console.log(error);
        });
}
