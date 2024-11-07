import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
} from 'sequelize-typescript';

/**
 * Fund Transactions Logs Table
 */
@Table({
  tableName: 'fund_transaction_logs',
  underscored: true,
})
export class FundTransactionLogs extends Model<FundTransactionLogs> {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  transactionId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @CreatedAt
  createdAt: Date;
}
