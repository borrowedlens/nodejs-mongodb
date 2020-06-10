const mongoDb = require('mongodb');

const getDb = require('../util/database').getDb;

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        console.log('User -> addToCart -> this.cart.items', this.cart.items);
        let cartProductIndex = this.cart.items.findIndex((p) => {
            return p.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        let updatedCartItems = [...this.cart.items];
        if (cartProductIndex === -1) {
            updatedCartItems.push({
                productId: new mongoDb.ObjectId(product._id),
                quantity: newQuantity,
            });
        } else {
            updatedCartItems[cartProductIndex].quantity += 1;
        }
        const updatedCart = { items: updatedCartItems };
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new mongoDb.ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }

    getCart() {
        console.log('User -> getCart -> this.cart.items', this.cart.items);
        const db = getDb();
        let productIds = this.cart.items.map((p) => {
            return p.productId;
        });
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then((products) => {
                if (products.length > 0) {
                    return products.map((p) => {
                        return {
                            ...p,
                            quantity: this.cart.items.find(
                                (i) =>
                                    p._id.toString() === i.productId.toString()
                            ).quantity,
                        };
                    });
                } else {
                    db.collection('users').updateOne(
                        { _id: new mongoDb.ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    )
                    return products
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    deleteCartItem(id) {
        const db = getDb();
        console.log(
            'User -> deleteCartItem -> this.cart.items',
            this.cart.items
        );
        let updatedCartItems = this.cart.items.filter(
            (p) => p.productId.toString() !== id.toString()
        );
        console.log(
            'User -> deleteCartItem -> updatedCartItems',
            updatedCartItems
        );
        return db
            .collection('users')
            .updateOne(
                { _id: new mongoDb.ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } }
            );
    }

    placeOrder() {
        const db = getDb();
        return this.getCart().then((products) => {
            let orders = {
                items: products,
                user: {
                    _id: new mongoDb.ObjectId(this._id),
                    name: this.name,
                },
            };
            return db
                .collection('orders')
                .insertOne(orders)
                .then(() => {
                    this.cart.items = [];
                    return db
                        .collection('users')
                        .updateOne(
                            { _id: new mongoDb.ObjectId(this._id) },
                            { $set: { cart: { items: [] } } }
                        );
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }

    getOrders() {
        const db = getDb();
        return db
            .collection('orders')
            .find({ 'user._id': new mongoDb.ObjectId(this._id) })
            .toArray();
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('users').find().toArray();
    }
}

module.exports = User;
