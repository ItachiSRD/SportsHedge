import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

/**
 * Fund Transactions Table
 * transaction_id column is manually created as it's a BIGINT and inside js code, it has to be string.
 */
@Table({
  tableName: 'fund_transactions',
  underscored: true,
})
export class FundTransactions extends Model<FundTransactions> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  transactionId: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['withdraw', 'deposit'],
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.STRING,
  })
  referenceId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
