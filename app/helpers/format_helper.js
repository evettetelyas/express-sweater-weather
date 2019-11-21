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
  
  function formattedContent(json) {
	  var obj = {
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
	  }
	  return obj;
  }

  module.exports = {
	  hourlyContent,
	  dailyContent,
	  formattedContent,
  }