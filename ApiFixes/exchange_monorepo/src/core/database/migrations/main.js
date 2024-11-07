/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const { sequelize } = require('./db');

const { Umzug, SequelizeStorage } = require('umzug');

const { DataType } = require('sequelize-typescript');

async function runMigrations() {
  console.log(await sequelize.authenticate());

  const umzug = new Umzug({
    migrations: {
      glob: [
        `${__dirname}/*.{js,cjs,mjs}`,
        {
          ignore: [
            `${__dirname}/main.js`,
            `${__dirname}/db.js`,
            `${__dirname}/index.js`,
          ],
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
    const executedMigrations = await umzug.runAsCLI();
    console.log('Migrations ran successfully. ', executedMigrations);
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

runMigrations();
