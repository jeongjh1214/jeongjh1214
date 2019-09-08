var express = require('express');
var router = express.Router();

/* GET users listing. */

const signIn = require('./util/sign');
const login = require('./util/login');
const token = require('./util/token');
const authKey = require('./util/oauth');
const passport = require("passport");
const secretObj = require("../config/loginapi");
const KakaoStrategy = require("passport-kakao").Strategy;
const bcrypt = require("bcrypt");


function loginByThirdparty(info, done) {
	console.log('process : ' + info.auth_type);
	const UserModel = require('../models/User');
	let id = 'kakao:' + info.auth_id
	UserModel.findOne({id:id}, function(err, result) {
		if (err) {
			return done(err);
		} else {
			if (result == null) {
				console.log(id)
				var UserC = new UserModel({
					id:id,
					password:'abc'
				})
				UserC.save(function(err){
					if(err) {
						return done(err)
					} else {
						done(null, {
							'user_id' : id,
							'nickname' : info.auth_name
						});
					}})
			} else {
				console.log('Already');
				done(null, {
					'user_id' : id, 
					'nickname' : info.auth_name 
				})
			}
		}
	})
}

router.get('/sign', function(req, res, next) {
	res.render('users/sign');
});

router.get('/', function(req, res, next) {
	res.render('users/login');
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new KakaoStrategy({
		clientID: secretObj.federation.kakao.client_id, 
		callbackURL: secretObj.federation.kakao.callback_url 
	},
	function (accessToken, refreshToken, profile, done) {
		var _profile = profile._json;
		loginByThirdparty({
			'auth_type': 'kakao',
			'auth_id': _profile.id,
			'auth_name': _profile.properties.nickname,
			'auth_email': _profile.id
		}, done);
	}
));

router.post('/sign',signIn.createUser,signIn.saveUser,signIn.responseToUser);
router.post('/',login.validateParameter,login.comparePassword,login.createJsonWebToken,login.updateUserWithToken,login.responseToUser)
router.get('/token',token.validateParameter,token.verfyToken,token.findUser,token.createToken,token.responseToUser);

router.get('/test', function(req, res, next) {
	res.render('test')
});

// kakao 로그인
router.get('/kakao',
	passport.authenticate('kakao')
);
// kakao 로그인 연동 콜백
router.get('/kakao/callback',
	passport.authenticate('kakao', {
		successRedirect: '/test',
		failureRedirect: '/login'
	})
);

module.exports = router;
