require('dotenv').config();
const fetch = require('node-fetch');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const show = (request, response) => {
	const location = request.param('location')
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
			var city = location.split(",")[0]
			var state = location.split(",")[1]
			var google_key = process.env.GOOGLE_API_KEY
			var google_base_url = "https://maps.googleapis.com/maps/api/geocode/json"
			var google_url = google_base_url + "?key=" + google_key + "&address=" + city + "+" + state
			var darksky_key = process.env.DARKSKY_API_KEY
			var darksky_url = "https://api.darksky.net/forecast/" + darksky_key + "/"
		
			fetch(google_url)
			.then((res) => {
				return res.json()
		})
		.catch(error => {
			response.status(401).json({ error });
			})
		.then((json) => {
			var lat_lng =  json.results[0].geometry.location
			var lat_lng_format = lat_lng.lat + "," + lat_lng.lng
			fetch(darksky_url + lat_lng_format)
			.then((res) => {
				return res.json()
			})
			.catch(error => {
				response.status(401).json({ error });
				})
			.then((json) => {
				response.status(200).json({
					location: location,
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
					},
					hourly: {
						summary: json.hourly.summary,
						icon: json.hourly.icon,
						data: [{
							time: json.hourly.data[0].time,
							summary: json.hourly.data[0].summary,
							icon: json.hourly.data[0].icon,
							precipIntensity: json.hourly.data[0].precipIntensity,
							precipProbability: json.hourly.data[0].precipProbability,
							temperature: json.hourly.data[0].temperature,
							humidity: json.hourly.data[0].humidity,
							pressure: json.hourly.data[0].pressure,
							windSpeed: json.hourly.data[0].windSpeed,
							windGust: json.hourly.data[0].windGust,
							windBearing: json.hourly.data[0].windBearing,
							cloudCover: json.hourly.data[0].cloudCover,
							visibility: json.hourly.data[0].visibility
						}]
					},
					daily: {
						summary: json.daily.summary,
						icon: json.daily.icon,
						data: [{
							time: json.daily.data[0].time,
							summary: json.daily.data[0].summary,
							icon: json.daily.data[0].icon,
							sunriseTime: json.daily.data[0].sunriseTime,
							precipIntensity: json.daily.data[0].precipIntensity,
							precipIntensityMax: json.daily.data[0].precipIntensityMax,
							precipIntensityMaxTime: json.daily.data[0].precipIntensityMaxTime,
							precipProbability: json.daily.data[0].precipProbability,
							precipType: json.daily.data[0].precipType,
							temperatureHigh: json.daily.data[0].temperatureHigh,
							temperatureLow: json.daily.data[0].temperatureLow,
							humidity: json.daily.data[0].humidity,
							pressure: json.daily.data[0].pressure,
							windSpeed: json.daily.data[0].windSpeed,
							windGust: json.daily.data[0].windGust,
							cloudCover: json.daily.data[0].cloudCover,
							visibility: json.daily.data[0].visibility,
							temperatureMin: json.daily.data[0].temperatureMin,
							temperatureMax: json.daily.data[0].temperatureMax
						}]
					}
				})
			})		
		})
		.catch(error => {
			response.status(401).json({ error });
			});
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