// const User = require('../models/user')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const create = (request, response) => {
	const req = request.body
	const user = database('users').where('api_key', req.api_key).select()
	const favorite = {
		user_id: user.id,
		location: req.location
	};
	for (let requiredParameter of ['location', 'api_key']) {
		if (!req[requiredParameter]) {
		return response
			.status(422)
			.send({ error: `Expected format: { location: <String>, api_key: <String> }. You're missing a "${requiredParameter}" property.` });
		}
	}
	
	database('favorites').insert(favorite, 'id')
		.then(favorite => {
		response.status(200).json("return forecase obj here")
		})
		.catch(error => {
		response.status(401).json({ error });
		});
	};

	module.exports = {
		create,
	  }