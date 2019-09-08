'use strict';


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
	roomName:{type:String,required:true},
	participants:[{type:Schema.Types.ObjectId,ref:'User'}],
	messages:[{type:Schema.Types.ObjectId, ref:'Message'}],
	CreatedAt:{type:Date,default:Date.now},
	UpdatedAt:{type:Date,default:Date.now}
});


RoomSchema.index({ messages: -1});
module.exports = mongoose.model('Room',RoomSchema);
