const express = require('express');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const bodyParser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error');
const authRoutes = require('./routes/auth');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URI = 'mongodb+srv://edgarcarrenofonseca_db_user:IT4KKujqjARKWXLh@cluster0.np1ji96.mongodb.net/shop?appName=Cluster0';

/**
 * The next code wors with sequelize
 */

/**
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
 */

/**
 * The next code wors with Mongo DB
 */

/**
const mongoConnection = require('./util/database').mongoConnection;
const User = require('./models/user');
*/

/**
 * The next code wors with mongoose
 */

const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
    bodyParser.urlencoded(
        {
            extended: false
        }
    )
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrfProtection);
app.use(flash());

/**
 * The next code wors with sequelize not sessions
 */

/**
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(error => {
            console.log(error);
        });
    next();
});
 */

/**
 * The next code wors with mongodb not sessions
 */

/**
app.use((req, res, next) => {
    User.getUser('6a89fa989c95112d440c614f')
        .then(user => {
            req.user = new User(
                user.name,
                user.email,
                user.cart,
                user._id
            );
            next();
        })
        .catch(error => {
            console.log(error);
        });
});
 */

/**
 * The next code wors with mongoose wothout sessions
 */

/**
app.use((req, res, next) => {
    User.findById('6a8cba058d888699da5de390')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(error => {
            console.log(error);
        });
});
 */

/**
 * The next code wors with mongoose with sessions
 */
app.use((req, res, next) => {
    if (!req.session.isLoggedIn || !req.session.userId) {
        return next();
    }

    User.findById(req.session.userId)
        .then(user => {
            req.user = user;
            return next();
        })
        .catch(error => {
            console.log(error);
        })
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

/**
 * The next code wors with sequelize
 */

/**
Product.belongsTo(
    User,
    {
        constraints: true,
        onDelete: 'CASCADE'
    }
);
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

let fetchedUser;
sequelize
    //.sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Edgar', email: 'edgarcarrenofonseca@outlook.com' });
        } else {
            return user;
        }
    })
    .then(user => {
        fetchedUser = user;
        return user.getCart();
    })
    .then(userCart => {
        if (userCart) {
            return userCart;
        } else {
            return fetchedUser.createCart();
        }
    })
    .then(createdCart => {
        app.listen(3000);
    })
    .catch(error => {
        console.log(error);
    });
 */

/**
 * The next code wors with Mongo DB
 */

/**
mongoConnection(() => {
    app.listen(3000);
});
*/

mongoose
    .connect(
        MONGODB_URI
    )
    .then(result => {
        app.listen(3000);
    })
    .catch(error => {
        console.log(error);
    });
