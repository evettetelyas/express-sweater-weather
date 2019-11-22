require('dotenv').config();
const User = require('../models/user')
const bcrypt = require('bcrypt');

const create = (request, response) => {
  const newUser = request.body
  User.byEmail(newUser.email).then(ary => {
    if (ary.length > 0) {
      response.status(401).json({
        message: "Email already Exists."
      })
    } else {
      bcrypt.hash(newUser.password, 10, function (err, hash) {
        User.create(newUser.email, hash).then(user => {
          if (user) {
            User.keyByEmail(newUser.email).then(key => {
              response.status(201).json({
              message: `User has been created with key: ${key[0].api_key}`
              })
            })
          } else {
            response.status(500).json({
              message: "Could not create user"
            })
          }
        })
     })
    }
  })
}

module.exports = {
	create,
	}