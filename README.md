# Express Sweater Weather

## Local Setup
To use this repo, you’ll need to `fork` or `clone` the repo as your own. Once you have done that, you’ll need to run the following command below to get everything up and running. 

#### Installing necessary dependencies
The easiest way to get started is to run the following command. This will pull down any necessary dependencies that this app will require.

`$ npm install`

#### Set up your local database
```
$ psql
$ CREATE DATABASE <your db name>;
```

#### Migrate && Seed
Once you have your database setup, you’ll need to run the migrations. You can do this by running the following command: 

```
$ knex migrate:latest
$ knex seed:run
```

## Endpoints

Production Root URL: `express-sweaterweather.herokuapp.com` 
**a valid api key is required for all endpoints except Create User**

#### Create User
`POST /api/v1/users`

sample request
```
{
  "email": "eevette@email.com",
  "password": "password"
}
```

sample response
```
{
    "message": "User has been created with key: a9bd614f3b105930c3c20cac3a13cc2c"
}
```

#### Add Favorite Location
`POST /api/v1/favorites`

sample request
```
{
  "api_key": "jgn983hy48thw9begh98h4539h4"
}
```

sample response
```
{
  "message": "Denver, CO has been added to your favorites"
}
```

#### Remove Favorite Location
`DELETE /api/v1/favorites`

sample request
```
{
  "api_key": "jgn983hy48thw9begh98h4539h4"
}
```

sample response
```
204 No Content
```

#### Get Forecast for a Location
`GET /api/v1/forecast?location=denver,co`

sample request
```
{
  "api_key": "jgn983hy48thw9begh98h4539h4"
}
```

sample response
```
{
  "location": "Denver, C0",
  "currently": {
      "summary": "Overcast",
      "icon": "cloudy",
      "precipIntensity": 0,
      "precipProbability": 0,
      "temperature": 54.91,
      "humidity": 0.65,
      "pressure": 1020.51,
      "windSpeed": 11.91,
      "windGust": 23.39,
      "windBearing": 294,
      "cloudCover": 1,
      "visibility": 9.12,
    },
  "hourly": {
    "summary": "Partly cloudy throughout the day and breezy this evening.",
    "icon": "wind",
    "data": [
      {
      "time": 1555016400,
      "summary": "Overcast",
      "icon": "cloudy",
      "precipIntensity": 0,
      "precipProbability": 0,
      "temperature": 54.9,
      "humidity": 0.65,
      "pressure": 1020.8,
      "windSpeed": 11.3,
      "windGust": 22.64,
      "windBearing": 293,
      "cloudCover": 1,
      "visibility": 9.02,
      },
    ]
  },
  "daily": {
    "summary": "No precipitation throughout the week, with high temperatures bottoming out at 58°F on Monday.",
    "icon": "clear-day",
    "data": [
      {
        "time": 1554966000,
        "summary": "Partly cloudy throughout the day and breezy in the evening.",
        "icon": "wind",
        "sunriseTime": 1554990063,
        "sunsetTime": 1555036947,
        "precipIntensity": 0.0001,
        "precipIntensityMax": 0.0011,
        "precipIntensityMaxTime": 1555045200,
        "precipProbability": 0.11,
        "precipType": "rain",
        "temperatureHigh": 57.07,
        "temperatureLow": 51.47,
        "humidity": 0.66,
        "pressure": 1020.5,
        "windSpeed": 10.94,
        "windGust": 33.93,
        "cloudCover": 0.38,
        "visibility": 9.51,
        "temperatureMin": 53.49,
        "temperatureMax": 58.44,
      },
    ]
  }
}
```
