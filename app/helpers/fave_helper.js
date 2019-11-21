require('dotenv').config();
const fetch = require('node-fetch');
const google_key = process.env.GOOGLE_API_KEY
const google_base_url = "https://maps.googleapis.com/maps/api/geocode/json"
const darksky_key = process.env.DARKSKY_API_KEY
const darksky_url = `https://api.darksky.net/forecast/${darksky_key}/`
const formatter = require('../helpers/format_helper')
const forecastsAry = []

function forecasts(cities) {
	cities.forEach(loc => {
		var city = loc.location.split(",")[0]
		var state = loc.location.split(",")[1].substring(1)
		var google_url = `${google_base_url}?key=${google_key}&address=${city}+${state}`
		fetch(google_url)
		.then((res) => res.json())
		.then((json) => {
			var lat_lng =  json.results[0].geometry.location
			var lat_lng_format = lat_lng.lat + "," + lat_lng.lng
			fetch(darksky_url + lat_lng_format)
			.then((res) => res.json())
			.then((json) => {
				content = formatter.formatCurrently(json, loc)
				forecastsAry.push(content)
			})
		})
	})
	return forecastsAry;
};

module.exports = {
	forecasts,
}