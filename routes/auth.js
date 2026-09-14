const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { check, body } = require('express-validator');
const User = require('../models/user');

router.get('/login', authController.getLogIn);

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .normalizeEmail(),
        body(
            'password',
            'Password is not valid.'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
    ],
    authController.postLogIn
);

router.post('/logout', authController.postLogOut);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({
                    email: value
                })
                    .then(user => {
                        if (user) {
                            return Promise.reject(
                                'Email exists already, please pick a different one.'
                            );
                        }
                    })
            })
            .normalizeEmail(),
        body(
            'password',
            'Please enter a password with only numbers and text with at least 5 characters.'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error(
                        'Passwords have to match.'
                    );
                }

                return true;
            })
            .trim()
    ],
    authController.postSignup
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
