const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/login', authController.getLogIn);

router.post('/login', authController.postLogIn);

router.post('/logout', authController.postLogOut);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

module.exports = router;
