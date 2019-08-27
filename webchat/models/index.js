'use strict';

const mongoose = require('mongoose');

const db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
	console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/aproject', {useNewUrlParser:true});
