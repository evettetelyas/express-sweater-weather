require('dotenv').config();
const User = require('../models/user')
const bcrypt = require('bcrypt');

const create = (request, response) => {
	const newUser = request.body
	bcrypt.hash(newUser.password, 10, function (err,   hash) {
	   User.create(newUser.email, hash).then(function(data) {
		  if (data) {
		  response.status(201).json({
			  message: `User has been created`
		  });
		  }
		});
	   });
}

module.exports = {
	create,
	}