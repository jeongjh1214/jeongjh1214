'use strict';

const secretObj = require("../../config/jwt");

exports.validateParameter = (req,res,next)=>{
	const id =req.body.id;
	const password = req.body.password;
	if(!id){
		const error = new Error("Bad request");
		error.status = 400;
		return next(error);

	}else if(!password){
		const error = new Error("Bad request");
		error.status = 400;
		return next(error);
	}
	return next();
};

exports.comparePassword = (req,res,next)=>{
	const UserModel = require('../../models/User');
	const bcrypt = require('bcrypt');
	const id =req.body.id;
	const password = req.body.password;
	const OnError = (error)=>{
		return next(error);
	};
	const comparePassword = (user)=>{
		if(!user){
			const error = new Error('User Not Found');
			error.status = 404;
			return next(error);
		}
		req.SearchUser = user;
		return bcrypt.compare(password,user.password);

	};
	const compareResultResponse = (isValid)=>{
		if(isValid){
			return next();
		}
		const error = new Error('Invalid password');
		error.status = 401;
		return next(error);
	};
	UserModel.findOne({id:id}).select({id:1,password:1,CreatedAt:1})
		.then(comparePassword)
		.then(compareResultResponse)
		.catch(OnError);
};

exports.createJsonWebToken = (req,res,next)=>{
	const jsonwebtoken = require('jsonwebtoken');
	const options = {
		algorithm:"HS256",
		expiresIn:"4h"
	};
	const plainObject = req.SearchUser.toObject({getters:true});
	jsonwebtoken.sign(plainObject,secretObj.secret,options,(err,token)=>{
		if(err){
			return next(err);
		}
		req.CreatedToken = token;
		return next();
	});
};

exports.updateUserWithToken = (req,res,next)=>{
	const OnError = (error)=>{
		return next(error);
	};

	const updateResultResponse = (updatedUser)=>{
		req.SearchUser = updatedUser;
		return next();
	};
	req.SearchUser.set({token:req.CreatedToken});
	req.SearchUser.save()
		.then(updateResultResponse)
		.catch(OnError)
};
exports.responseToUser = (req,res,next)=>{
	res.cookie("user",req.CreatedToken);
	res.json({token:req.CreatedToken});
};
