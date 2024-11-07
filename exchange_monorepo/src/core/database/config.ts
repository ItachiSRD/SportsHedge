import { databaseConfig } from '../config';
const config = databaseConfig;
module.exports = {
  development: {
    default: {
      database: config.database,
      username: config.username,
      password: config.password,
      host: config.host,
      port: config.port,
      dialect: 'postgres',
    },
  },
};
