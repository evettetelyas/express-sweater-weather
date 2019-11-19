// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/express_sweater_weather_dev',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/express_sweater_weather_test',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: 'postgres://xinvbvsannovap:fa3db906686f1cec0805f21a359b64f290033092fcd60b7419d3983fc615b0b2@ec2-174-129-253-144.compute-1.amazonaws.com:5432/d1ubg2aibs7dfc',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
