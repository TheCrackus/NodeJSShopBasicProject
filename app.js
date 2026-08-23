const express = require('express');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const bodyParser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error');

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

const mongoConnection = require('./util/database').mongoConnection;
const User = require('./models/user');

const app = express();

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

/**
 * The next code wors with sequelize
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
 * The next code wors with mongodb
 */

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


app.use('/admin', adminData.routes);
app.use(shopRoutes);

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

mongoConnection(() => {
    app.listen(3000);
});
