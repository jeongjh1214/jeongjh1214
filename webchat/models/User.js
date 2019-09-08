'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	id:{type:String,required:true},
	password:{type:String,required:true},
	email:String,
	name:String,
	relation:[{type:Schema.Types.ObjectId,ref:'User'}],
	relationReRq:[{type:Schema.Types.ObjectId,ref:'User'}],
	relationRq:[{type:Schema.Types.ObjectId,ref:'User'}],
	rooms:[{type:Schema.Types.ObjectId,ref:'Room'}],
	inviterooms:[{type:Schema.Types.ObjectId,ref:'Room'}],
	CreatedAt: {type:Date,default:Date.now},
	UpdatedAt: {type:Date,default:Date.now}
});

module.exports = mongoose.model('User',UserSchema);
	
