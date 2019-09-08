'use strict';

const secretObj = require("../../config/loginapi");
const passport = require('passport');
const KakaoStrategy = require("passport-kakao").Strategy;
 

exports.kakaoPassport= (req,res,next)=>{
	passport.authenticate('login-kakao');
	return next()
};

exports.kakaouse = (req,res,next)=>{
	passport.use('login-kakao', new KakaoStrategy({
			clientID : secretObj.federation.kakao.client_id,
			callbackURL : secretObj.federation.kakao.callback_url
		},
		function(accessToken, refreshToken, profile, done) {
			console.log(profile);
		}))
};

