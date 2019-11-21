require('dotenv').config();
const fetch = require('node-fetch');
const google_key = process.env.GOOGLE_API_KEY
const google_base_url = "https://maps.googleapis.com/maps/api/geocode/json"
const darksky_key = process.env.DARKSKY_API_KEY
const darksky_url = `https://api.darksky.net/forecast/${darksky_key}/`
const formatter = require('../helpers/format_helper')

// function forecasts(cities) {
// 	cities.forEach(loc => {
// 		var city = loc.location.split(",")[0]
// 		var state = loc.location.split(",")[1].substring(1)
// 		var google_url = `${google_base_url}?key=${google_key}&address=${city}+${state}`
// 		fetch(google_url)
// 		.then((res) => res.json())
// 		.then((json) => {
// 			var lat_lng =  json.results[0].geometry.location
// 			var lat_lng_format = lat_lng.lat + "," + lat_lng.lng
// 			fetch(darksky_url + lat_lng_format)
// 			.then((res) => res.json())
// 			.then((json) => {
// 				content = formatter.formatCurrently(json, loc)
// 				forecastsAry.push(content)
// 			})
// 		})
// 	})
// 	return forecastsAry;
// };

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function forecasts(cities) {
  let forecastsAry = []
	await asyncForEach(cities, async (loc) => {
    let coords = await getCoords(loc.location)
    let forecastObj = await getForecastObj(coords, loc.location)
    forecastsAry.push(forecastObj)
  })
  return forecastsAry;
};

async function getCoords(location) {
  var city = location.split(",")[0]
  var state = location.split(",")[1].substring(1)
  var google_url = `${google_base_url}?key=${google_key}&address=${city}+${state}`
  var resp = await fetch(google_url)
  var json = await resp.json()
  return json.results[0].geometry.location
}

async function getForecastObj(coords, loc) {
  var lat_lng = coords.lat + "," + coords.lng
  var resp = await fetch(darksky_url + lat_lng)
  var json = await resp.json()
  return formatter.formatCurrently(json, loc)
}

module.exports = {
	forecasts,
}