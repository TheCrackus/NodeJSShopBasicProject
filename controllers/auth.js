const User = require('../models/user');

exports.getLogIn = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Log in',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogIn = (req, res, next) => {
    User.findById('6a8cba058d888699da5de390')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.userId = user._id.toString();

            req.session.save(error => {
                console.log(error);
                res.redirect('/');
            });
        })
        .catch(error => {
            console.log(error);
        });
}

exports.postLogOut = (req, res, next) => {
    req.session.destroy((error) => {
        console.log(error);

        res.redirect('/');
    });
}
