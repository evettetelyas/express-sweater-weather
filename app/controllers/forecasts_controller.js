require('dotenv').config();
const fetcher = require('../helpers/fetch_helper');
const User = require('../models/user')

const show = (request, response) => {
	const loc = request.param('location')
	const req = request.body
	User.byApiKey(req.api_key)
		.then(async user => {
			if (user[0]) {
			let coords = await fetcher.getCoords(loc)
				await fetcher.getTotalForecastObj(coords, loc)
			.then(content => response.status(200).json(content))
			.catch(error => response.status(500).json(error))
		} else {
			return response
				.status(401)
				.send({message: "API key does not exist."})
			}
		})
	};

module.exports = {
	show,
	}