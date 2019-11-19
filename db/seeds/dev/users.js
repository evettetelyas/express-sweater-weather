
exports.seed = function(knex) {
	return knex('users').del()
	  .then(() => {
		return Promise.all([
  		  knex('users').insert({
			email: 'evette@email.com', password_hash: '$2b$12$OFqZVoyZLawBzUMUrdOg0ubF3N0xB9cE0anMisb3z1TG1kMJJVhGW', api_key: 'sample_api_key'
		  }, 'id')
		  .then(() => console.log('Seeding complete!'))
		  .catch(error => console.log(`Error seeding data: ${error}`))
		])
	  })
	  .catch(error => console.log(`Error seeding data: ${error}`));
  };