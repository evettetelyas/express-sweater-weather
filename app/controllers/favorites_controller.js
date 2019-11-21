require('dotenv').config();
// const fetch = require('node-fetch');
const User = require('../models/user')
const helper = require('../helpers/fave_helper')

const create = (request, response) => {
	const favorite = request.body
	User.byApiKey(favorite.api_key)
		.then(user => {
			if (user[0]) {
				User.addFavorite(user[0].id, favorite.location)
				.then(fave => {
					response.status(200).json({
						message: `${favorite.location} has been added to your favorites`
						})
					})
					.catch(error => {
					response.status(401).json({ error });
					});
			}
			else {
				return response
				.status(401)
				.send({message: "API key does not exist."})
			}
		}

	)
};


const destroy = (request, response) => {
	const favorite = request.body
	User.byApiKey(favorite.api_key)
		.then(user => {
			if (user[0]) {
				User.removeFavorite(user[0].id, favorite.location)
				.then(deleted => {
					response.status(204).json({status: 204})
					})
					.catch(error => {
					response.status(401).json({ error });
					});
			}
			else {
				return response
				.status(401)
				.send({message: "API key does not exist."})
			}
		}

	)
};

const show = (request, response) => {
	const req = request.body
	User.byApiKey(req.api_key)
		.then(user => {
			if (user[0]) {
				User.favorites(user[0].id)
				.then(cities => {
					result = helper.forecasts(cities)
					response.status(200).send(result)
					})
				.catch(error => {
					response.status(401).json({ error })
				})
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