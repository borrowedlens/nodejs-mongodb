const mongoDb = require('mongodb');

const getDb = require('../util/database').getDb;

class Product {
    constructor(id, title, imageUrl, price, description, userId) {
        this._id = id ? new mongoDb.ObjectId(id) : null;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.userId = userId;
    }
    save() {
        const db = getDb();
        if (this._id) {
            return db
                .collection('products')
                .updateOne({ _id: this._id }, { $set: this });
        } else {
            return db.collection('products').insertOne(this);
        }
    }
    /* Alternate way to update */
    // static update(id, $set) {
    //     console.log('Product -> update -> $set', $set);
    //     const db = getDb();
    //     const _id = new mongoDb.ObjectId(id);
    //     return db.collection('products').updateOne({ _id }, { $set });
    // }

    static deleteById(productId) {
        const db = getDb();
        return db
            .collection('products')
            .deleteOne({ _id: new mongoDb.ObjectId(productId) })
            .then(() => {
                // req.user.deleteCartItem(productId);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static findById(productId) {
        const db = getDb();
        return db
            .collection('products')
            .find({ _id: new mongoDb.ObjectId(productId) })
            .next();
    }
    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
    }
}

module.exports = Product;
