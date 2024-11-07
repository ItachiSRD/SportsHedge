/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
('use strict');

const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  /**
   * @param {{context: {queryInterface: QueryInterface, DataTypes: DataTypes}}} context
   */
  async up({ context: { queryInterface, DataTypes } }) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const RESERVE_BOOKS = 50;
      const books = [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'CASH_BOOK',
          metadata: JSON.stringify({
            details: 'Cash book to mint Cash and Assets',
          }),
        },
        {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'SH_MAIN',
          metadata: JSON.stringify({ details: 'SportsHedge Mainbook' }),
        },
        {
          id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'SH_LOCK',
          metadata: JSON.stringify({ details: 'SportsHedge Lockbook' }),
        },
        {
          id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'SH_FEES',
          metadata: JSON.stringify({ details: 'SportsHedge Fee book' }),
        },
        {
          id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'SH_TCS',
          metadata: JSON.stringify({
            details: 'SportsHedge TCS book',
            description:
              'When user deposits money, the tax is transferred to this book.',
          }),
        },
        {
          id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'SH_TDS',
          metadata: JSON.stringify({ details: 'SportsHedge TDS book' }),
        },
      ];

      const booksReserved = books.length;
      for (let i = booksReserved + 1; i < RESERVE_BOOKS; i += 1) {
        books.push({
          id: i,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'SH_RESERVED_' + (i - booksReserved),
          metadata: JSON.stringify({ details: 'SportsHedge Reserved book' }),
        });
      }

      console.log('BBB', books);

      await queryInterface.bulkInsert('books', books, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  /**
   * @param {{context: {queryInterface: QueryInterface}}} context
   */
  async down({ context: { queryInterface } }) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('users', null, {}, { transaction });
      transaction.commit();
    } catch (err) {
      transaction.rollback();
    }
  },
};
