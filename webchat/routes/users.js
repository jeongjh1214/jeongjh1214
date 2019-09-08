var express = require('express');
var router = express.Router();

/* GET users listing. */

const signIn = require('./util/sign');
const login = require('./util/login');
const token = require('./util/token');

router.get('/sign', function(req, res, next) {
	res.render('users/sign');
});

router.get('/login', function(req, res, next) {
	res.render('users/login');
});

router.post('/sign',signIn.createUser,signIn.saveUser,signIn.responseToUser);
router.post('/login',login.validateParameter,login.comparePassword,login.createJsonWebToken,login.updateUserWithToken,login.responseToUser)
router.get('/token',token.validateParameter,token.verfyToken,token.findUser,token.createToken,token.responseToUser);


module.exports = router;
