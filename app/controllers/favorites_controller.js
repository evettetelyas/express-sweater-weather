require('dotenv').config();
const User = require('../models/user')
const helper = require('../helpers/fetch_helper')

const create = (request, response) => {
	const favorite = request.body
	User.byApiKey(favorite.api_key)
		.then(user => {
			if (user[0]) {
				User.addFavorite(user[0].id, favorite.location)
				.then(() => response.status(201).json({
						message: `${favorite.location} has been added to your favorites`
						}))
					.catch(error => response.status(500).json(error))
			}
			else {
				return response
				.status(401)
				.send({message: "API key does not exist."})
			}
		})
};


const destroy = (request, response) => {
	const favorite = request.body
	User.byApiKey(favorite.api_key)
		.then(user => {
			if (user[0]) {
				User.removeFavorite(user[0].id, favorite.location)
				.then(() => response.status(204).json())
        .catch(error => response.status(500).json(error))
			}
			else {
				return response
				.status(401)
				.send({message: "API key does not exist."})
			}
		})
};

const show = (request, response) => {
	const req = request.body
	User.byApiKey(req.api_key)
		.then(user => {
			if (user[0]) {
				User.favorites(user[0].id)
				.then(async cities => {
          var content = await helper.forecasts(cities)
					response.status(200).json(content)
					})
        .catch(error => response.status(500).json(error))
			} else {
			  	return response
          .status(401)
          .send({message: "API key does not exist."})
			}
		})
};

module.exports = {
	create,
	destroy,
	show,
	}