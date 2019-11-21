require('dotenv').config();
const fetch = require('node-fetch');
const User = require('../models/user')

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