const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                docTitle: 'Home',
                path: '/',
            });
        })
        .catch((err) => {
            console.log('exports.getIndex -> err', err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render('shop/products', {
                prods: products,
                docTitle: 'Products',
                path: '/products',
            });
        })
        .catch((err) => {
            console.log('exports.getIndex -> err', err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                docTitle: 'Product Details',
                path: '/products',
            });
        })
        .catch((err) => {
            console.log('exports.getProduct -> err', err);
        });
    /* Alternate using 'where' and findAll() */
    // Product.findAll({ where: { id: prodId }}).then(products => {
    //     res.render('shop/product-detail', {
    //         product: products[0],
    //         docTitle: 'Product Details',
    //         path: '/products',
    //     });
    // }).catch(err => {
    //     console.log("exports.getProduct -> err", err)
    // })
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then((products) => {
            res.render('shop/cart', {
                docTitle: 'Cart',
                path: '/cart',
                products: products,
            });
        })
        .catch((err) => {
            console.log('exports.getCart -> err', err);
        });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    console.log('exports.postCart -> productId', productId);
    Product.findById(productId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.deleteCartItem = (req, res, next) => {
    const id = req.body.productId;
    req.user
        .deleteCartItem(id)
        .then(() => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then((orders) => {
            res.render('shop/orders', {
                docTitle: 'Orders',
                path: '/orders',
                orders: orders,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .placeOrder()
        .then(() => {
            res.redirect('orders');
        })
        .catch((err) => {
            console.log(err);
        });
};

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         docTitle: 'Checkout',
//         path: '/checkout',
//     });
// };
