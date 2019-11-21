const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('users')
  .select()

const favorites = (id) => database('favorites')
	.where('user_id', id)
	.distinct('location')

module.exports = {
	all,
	favorites,
}