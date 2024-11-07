/* eslint-disable @typescript-eslint/no-var-requires */
const { Sequelize } = require('sequelize');
//  TODO: read from Config service

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
);

module.exports = { sequelize };
