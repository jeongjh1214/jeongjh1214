'use strict';

exports.createUser = (req,res,next)=>{
	const UserModel = require('../../models/User');
	const bcrypt = require('bcrypt');
	const id = req.body.id;
	const name = req.body.name;
	const password = req.body.password;

	console.log(req.body);
	if(!id){
		const error = new Error("Bad Request ID");
		error.status = 400;
		return next(error);

	}else if(!password){
		const error = new Error("Bad Request Password");
		error.status = 400;
		return next(error);
	}
	const generateStrictPassword = (salt)=>{
		return bcrypt.hash(password,salt);
	};
	const createUser = (strictPassword)=>{
		const User = new UserModel({
			id:id,
			name:name,
			password:strictPassword
		});
		req.CreatedUser = User;
		next();
	};
	const OnError = (error)=>{
		return next(error);
	};
	bcrypt.genSalt(13)
		.then(generateStrictPassword)
		.then(createUser)
		.catch(OnError)

};

exports.saveUser = (req,res,next)=>{

	const OnError = (error)=>{
		return next(error);
	};
	req.CreatedUser.save()
		.then((user)=>{
			req.CreatedUser = user;
			return next();
		})
		.catch(OnError)
};
exports.responseToUser = (req,res,next)=>{
	res.json(req.CreatedUser);
};
