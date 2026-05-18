const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render(
        'add-product',
        {
            pageTitle: 'Add product',
            path: '/admin/add-product',
            formCCS: true,
            productCCS: true,
            activeAddProduct: true
        }
    );
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}
