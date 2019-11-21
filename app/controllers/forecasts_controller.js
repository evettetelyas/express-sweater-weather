require('dotenv').config();
const fetch = require('node-fetch');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const helper = require('../helpers/format_helper');
const User = require('../models/user')

const show = (request, response) => {
	const location = request.param('location')
	const req = request.body
	for (let requiredParameter of ['api_key']) {
		if (!req[requiredParameter]) {
		return response
			.status(422)
			.send({ error: `Expected format: { api_key: <String> }. You're missing a "${requiredParameter}" property.` });
		}
	};
	User.byApiKey(req.api_key)
		.then(user => {
			if (user[0]) {
			var city = location.split(",")[0]
			var state = location.split(",")[1]
			var google_key = process.env.GOOGLE_API_KEY
			var google_base_url = "https://maps.googleapis.com/maps/api/geocode/json"
			var google_url = `${google_base_url}?key=${google_key}&address=${city}+${state}`
			var darksky_key = process.env.DARKSKY_API_KEY
			var darksky_url = `https://api.darksky.net/forecast/${darksky_key}/`
			fetch(google_url)
			.then((res) => res.json())
			.then((json) => {
				var lat_lng =  json.results[0].geometry.location
				var lat_lng_format = lat_lng.lat + "," + lat_lng.lng
				fetch(darksky_url + lat_lng_format)
				.then((res) => res.json())
				.then((json) => {
					var content = helper.formattedContent(json)
					response.status(200).json(content)
				})		
			})
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