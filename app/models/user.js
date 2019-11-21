const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('users')
  .select()

const favorites = (id) => database('favorites')
	.where('user_id', id)
	.distinct('location')

const byApiKey = (key) => database('users')
	.where('api_key', key)
	.limit(1)

const addFavorite = (id, location) => database('favorites')
	.insert({user_id: id, location: location})

const removeFavorite = (id, location) => database('favorites')
	.del()
	.where({user_id: id, location: location})

module.exports = {
	all,
	favorites,
	byApiKey,
	addFavorite,
	removeFavorite,
}