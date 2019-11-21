require('dotenv').config();
const fetch = require('node-fetch');
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
	forecasts,
}