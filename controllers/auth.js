const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const getTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_SMTP_USER,
            pass: process.env.BREVO_SMTP_KEY,
        }
    });
}

exports.getLogIn = (req, res, next) => {
    let eMessage = req.flash('error');
    if (eMessage.length > 0) {
        eMessage = eMessage[0];
    } else {
        eMessage = null;
    }

    res.render(
        'auth/login',
        {
            path: '/login',
            pageTitle: 'Log in',
            errorMessage: eMessage
        }
    );
};

exports.postLogIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email: email
    })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email.');

                return res.redirect('/login');
            }

            bcrypt.compare(password, user.password)
                .then(matched => {
                    if (matched) {
                        req.session.isLoggedIn = true;
                        req.session.userId = user._id.toString();

                        return req.session.save(error => {
                            console.log(error);

                            res.redirect('/');
                        });
                    } else {
                        req.flash('error', 'Invalid password.');

                        res.redirect('/login');
                    }
                })
                .catch(error => {
                    console.log(error);

                    res.redirect('/login');
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

exports.getSignup = (req, res, next) => {
    let eMessage = req.flash('error');
    if (eMessage.length > 0) {
        eMessage = eMessage[0];
    } else {
        eMessage = null;
    }

    res.render(
        'auth/signup',
        {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: eMessage
        }
    );
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const transporter = getTransporter();

    User.findOne({
        email: email
    })
        .then(user => {
            if (user) {
                req.flash('error', 'Email already registered.');

                return res.redirect('/signup');
            }

            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const newUser = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    });

                    return newUser.save();
                })
                .then(result => {
                    res.redirect('/login');

                    return transporter.sendMail({
                        from: 'edgarcarrenofonseca@outlook.com',
                        to: email,
                        subject: 'Sign up succeded!',
                        html: '<h1>You successfully signed up!</h1>'
                    });
                })
                .catch(error => {
                    console.log(error);
                });;
        })
        .catch(error => {
            console.log(error);
        });
}
