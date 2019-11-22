var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var favoritesController = require('./app/controllers/favorites_controller')
var forecastsController = require('./app/controllers/forecasts_controller')
var usersController = require('./app/controllers/users_controller')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.post('/api/v1/favorites', favoritesController.create)
app.post('/api/v1/users', usersController.create)
app.delete('/api/v1/favorites', favoritesController.destroy)
app.get('/api/v1/forecast', forecastsController.show)
app.get('/api/v1/favorites', favoritesController.show)

module.exports = app;