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
			var google_url = `${google_base_url}?key=${google_key}&address=${city}+${state}`
			var darksky_key = process.env.DARKSKY_API_KEY
			var darksky_url = `https://api.darksky.net/forecast/${darksky_key}/`
		
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
						data: hourlyContent(json.hourly.data)
					},
					daily: {
						summary: json.daily.summary,
						icon: json.daily.icon,
						data: dailyContent(json.daily.data)
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

function hourlyContent(hourlyData) {
  var hourlys = []
  hourlyData.forEach (hour => {
    var obj = { 
      time: hour.time,
      summary: hour.summary,
      icon: hour.icon,
      precipIntensity: hour.precipIntensity,
      precipProbability: hour.precipProbability,
      temperature: hour.temperature,
      humidity: hour.humidity,
      pressure: hour.pressure,
      windSpeed: hour.windSpeed,
      windGust: hour.windGust,
      windBearing: hour.windBearing,
      cloudCover: hour.cloudCover,
      visibility: hour.visibility 
    }
    hourlys.push(obj)
  })
  return hourlys;
}; 

function dailyContent(dailyData) {
  var daily = []
  dailyData.forEach (day => {
    var obj = { 
      time: day.time,
      summary: day.summary,
      icon: day.icon,
      precipIntensity: day.precipIntensity,
      precipProbability: day.precipProbability,
      temperature: day.temperature,
      humidity: day.humidity,
      pressure: day.pressure,
      windSpeed: day.windSpeed,
      windGust: day.windGust,
      windBearing: day.windBearing,
      cloudCover: day.cloudCover,
      visibility: day.visibility 
    }
    daily.push(obj)
  })
  return daily;
}

module.exports = {
	show,
	}