const mongoDb = require('mongodb');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/product-details', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        edit: false,
        // activeProduct: true, // For handlebars
        // productCss: true
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, price, description, req.user._id);
    product
        .save()
        .then((result) => {
            console.log('exports.postAddProduct -> result', result);
            res.redirect('product-list');
        })
        .catch((err) => {
            console.log('exports.postAddProduct -> err', err);
        });
};

exports.getProductList = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render('admin/product-list', {
                prods: products,
                docTitle: 'Product-list: Admin',
                path: '/admin/product-list',
            });
        })
        .catch((err) => {
            console.log('exports.getProductList -> err', err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/product-details', {
                docTitle: 'Edit Product',
                path: '/admin/edit-product',
                edit: editMode,
                product: product,
            });
        })
        .catch((err) => {
            console.log('exports.getEditProduct -> err', err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(id, title, imageUrl, price, description);
    product
        .save()
        /* Alternate way using update() */
        // Product.update(id, { title, imageUrl, price, description })
        .then((result) => {
            console.log('exports.postEditProduct -> result', result);
            res.redirect('product-list');
        })
        .catch((err) => {
            console.log('exports.postEditProduct -> err', err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.deleteById(id)
        .then((result) => {
            res.redirect('product-list');
        })
        .catch((err) => {
            console.log('exports.postDeleteProduct -> err', err);
        });
};
