/* eslint-disable @typescript-eslint/no-var-requires */
const { Sequelize } = require('sequelize');
require('dotenv').config();
const { Umzug, SequelizeStorage } = require('umzug');
const { DataType } = require('sequelize-typescript');

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

async function runMigrations() {
  console.log(await sequelize.authenticate());

  const umzug = new Umzug({
    migrations: {
      glob: [
        `${__dirname}/*.{js,cjs,mjs}`,
        {
          ignore: [`${__dirname}/index.js`],
        },
      ],
    },
    context: {
      queryInterface: sequelize.getQueryInterface(),
      DataTypes: DataType,
    },
    storage: new SequelizeStorage({ sequelize: sequelize }),
    logger: console,
  });

  try {
    const executedSeeds = await umzug.runAsCLI();
    console.log('Seeders ran successfully. ', executedSeeds);
  } catch (error) {
    console.error('Error running Seeders:', error);
  }
}

runMigrations();
