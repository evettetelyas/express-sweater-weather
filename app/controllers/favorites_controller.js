require('dotenv').config();
const fetch = require('node-fetch');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const create = (request, response) => {
	const favorite = request.body
	for (let requiredParameter of ['location', 'api_key']) {
		if (!favorite[requiredParameter]) {
		return response
			.status(422)
			.send({ error: `Expected format: { location: <String>, api_key: <String> }. You're missing a "${requiredParameter}" property.` });
		};
	}

	database('users').where('api_key', favorite.api_key).limit(1)
		.then(user => {
			if (user[0]) {
				database('favorites').insert({user_id: user[0].id, location: favorite.location})
				.then(fave => {
					response.status(200).json({
						message: favorite.location + " has been added to your favorites"
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
	for (let requiredParameter of ['location', 'api_key']) {
		if (!favorite[requiredParameter]) {
		return response
			.status(422)
			.send({ error: `Expected format: { location: <String>, api_key: <String> }. You're missing a "${requiredParameter}" property.` });
		};
	}

	database('users').where('api_key', favorite.api_key).limit(1)
		.then(user => {
			if (user[0]) {
				database('favorites').del().where({user_id: user[0].id, location: favorite.location})
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
	for (let requiredParameter of ['api_key']) {
		if (!req[requiredParameter]) {
		return response
			.status(422)
			.send({ error: `Expected format: { api_key: <String> }. You're missing a "${requiredParameter}" property.` });
		};
	}
	
	database('users').where('api_key', req.api_key).limit(1)
		.then(user => {
			if (user[0]) {
				database('favorites').where('user_id', user[0].id).distinct('location')
				.then(cities => {
					result = forecasts(cities)
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

const forecastsAry = []

function forecasts(cities) {
	cities.forEach(loc => {
		var city = loc.location.split(",")[0]
		var state = loc.location.split(",")[1].substring(1)
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
				var obj = {
						location: loc.location,
						currently: {
							summary: json.currently.summary,
							icon: json.currently.icon,
							precipIntensity: json.currently.precipIntensity,
							temperature: json.currently.temperature,
							humidity: json.currently.humidity,
							pressure: json.currently.pressure,
							windSpeed: json.currently.windSpeed,
							windGust: json.currently.windGust,
							windBearing: json.currently.windBearing,
							cloudCover: json.currently.cloudCover,
							visibility: json.currently.visibility
						}
					}
				forecastsAry.push(obj)
			})
		})
	})
	return forecastsAry;
};

module.exports = {
	create,
	destroy,
	show,
	}