var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];

var indexRouter = require('./routes/index');
var favoritesController = require('./app/controllers/favorites_controller')

var app = express();

app.locals.title = 'Express Sweater Weather';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.set('port', process.env.PORT || 3000);

app.use('/', indexRouter);
app.post('/api/v1/favorites', favoritesController.create)
app.delete('/api/v1/favorites', favoritesController.destroy)


// app.listen(app.get('port'), () => {
// 	console.log(`${app.locals.title} is running`);
//   });

module.exports = app;