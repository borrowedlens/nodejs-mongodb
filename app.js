const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const adminRoutes = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/ErrorController');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

/* For handlebars */

// app.engine('hbs', expressHbs({ layoutsDir: 'views/hbs/layouts', defaultLayout: 'main-layout', extname: 'hbs'}));
// Or app.engine('handlebars', expressHbs({ layoutsDir: '/views/hbs/layouts', defaultLayout: 'main-layout'})); => looks for only .handlebars files

app.set('view engine', 'ejs');
app.set('views', 'views/ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    User.fetchAll()
        .then((users) => {
            if (users.length === 0) {
                const user = new User('Vivek', 'test@test.com');
                return user.save();
            }
        })
        .then(() => {
            return User.fetchAll();
        })
        .then((users) => {
            req.user = new User(
                users[0].name,
                users[0].email,
                users[0].cart,
                users[0]._id
            );
            next();
        })
        .catch((err) => {
            console.log(err);
        });
    // User.findByPk(1)
    //     .then((user) => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch((err) => {
    //         console.log('err', err);
    //     });
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.use(shopRouter);
app.use('/', errorController.get404Error);

mongoConnect(() => {
    app.listen(3000);
});
