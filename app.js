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
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();

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
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
    bodyParser.urlencoded(
        {
            extended: false
        }
    )
);
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

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
 * The next code wors with mongoose, no sessions
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
 * The next code wors with mongoose and sessions
 */
app.use((req, res, next) => {
    if (!req.session.isLoggedIn || !req.session.userId) {
        return next();
    }

    User.findById(req.session.userId)
        .then(user => {
            if (!user) {
                return next();
            }

            req.user = user;
            return next();
        })
        .catch(error => {
            next(new Error(error));
        })
});

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error);

    res.status(500).render('500', {
        pageTitle: 'Server error',
        path: '/500'
    });
});

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
        process.env.MONGODB_URI
    )
    .then(result => {
        app.listen(3000);
    })
    .catch(error => {
        console.log(error);
    });
