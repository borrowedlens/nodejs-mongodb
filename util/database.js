const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(
        'mongodb+srv://VivekPrasad:wengerknows@cluster0-ulb7d.mongodb.net/shop?retryWrites=true&w=majority',
        { useUnifiedTopology: true }
    )
        .then((client) => {
            _db = client.db();
            callback();
        })
        .catch((err) => {
            console.log(err);
        });
};

const getDb = () => {
    if(_db)
        return _db;
    throw 'no database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
