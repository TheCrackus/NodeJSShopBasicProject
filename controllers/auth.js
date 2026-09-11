const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
};

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

                        return res.redirect('/login');
                    }
                })
                .catch(error => {
                    console.log(error);

                    return res.redirect('/login');
                });
        })
        .catch(error => {
            console.log(error);
        });
};

exports.postLogOut = (req, res, next) => {
    req.session.destroy((error) => {
        console.log(error);

        return res.redirect('/');
    });
};

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
};

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
};

exports.getReset = (req, res, next) => {
    let eMessage = req.flash('error');
    if (eMessage.length > 0) {
        eMessage = eMessage[0];
    } else {
        eMessage = null;
    }

    res.render(
        'auth/reset',
        {
            path: '/reset',
            pageTitle: 'Reset Password',
            errorMessage: eMessage
        }
    );
};

exports.postReset = (req, res, next) => {
    const transporter = getTransporter();

    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
            console.log(error);

            return res.redirect('/reset');
        } else {
            const token = buffer.toString('hex');

            User.findOne({
                email: req.body.email
            })
                .then(user => {
                    if (!user) {
                        req.flash('error', 'No account found!');

                        return res.redirect('/reset');
                    } else {
                        user.resetToken = token;
                        user.resetTokenExpiration = Date.now() + 3600000;

                        return user.save();
                    }
                })
                .then(result => {
                    res.redirect('/login');

                    return transporter.sendMail({
                        from: 'edgarcarrenofonseca@outlook.com',
                        to: req.body.email,
                        subject: 'Password Reset',
                        html: `
                            <p>You requested a password reset.</p>
                            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                        `
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now()
        }
    })
        .then(user => {
            let eMessage = req.flash('error');
            if (eMessage.length > 0) {
                eMessage = eMessage[0];
            } else {
                eMessage = null;
            }

            res.render(
                'auth/new-password',
                {
                    path: '/new-password',
                    pageTitle: 'New Password',
                    errorMessage: eMessage,
                    userId: user._id.toString(),
                    passwordToken: token
                }
            );
        })
        .catch(error => {
            console.log(error);
        });
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken
    let updatedUser;

    User.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: {
            $gt: Date.now()
        }
    })
        .then(user => {
            updatedUser = user;

            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            updatedUser.password = hashedPassword;
            updatedUser.resetToken = null;
            updatedUser.resetTokenExpiration = null;
            
            return updatedUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(error => {
            console.log(error);
        });
}
