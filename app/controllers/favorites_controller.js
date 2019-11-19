// const User = require('../models/user')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const create = (request, response) => {
	const favorite = request.body
	// const user = database('users').where('api_key', req.api_key).select()
	// const favorite = {
	// 	user_id: user[0].id,
	// 	location: req.location
	// };
	for (let requiredParameter of ['location', 'api_key']) {
		if (!favorite[requiredParameter]) {
		return response
			.status(422)
			.send({ error: `Expected format: { location: <String>, api_key: <String> }. You're missing a "${requiredParameter}" property.` });
		};
	}

	database('users').where('api_key', favorite.api_key).limit(1)
		.then(user => {
			if (user[0]) {
				database('favorites').insert({user_id: user[0].id, location: favorite.location})
				.then(fave => {
					response.status(200).json({
						message: favorite.location + " has been added to your favorites"
					})
					})
					.catch(error => {
					response.status(401).json({ error });
					});
			}
			else {
				return response
				.status(422)
				.send({message: "API key does not exist."})
			}
		}

	)
};
	
	// database('favorites').insert(favorite, 'id')
	// 	.then(favorite => {
	// 	response.status(200).json({
	// 		message: favorite.location + " has been added to your favorites"
	// 	})
	// 	})
	// 	.catch(error => {
	// 	response.status(401).json({ error });
	// 	});
	// };

	module.exports = {
		create
	  }