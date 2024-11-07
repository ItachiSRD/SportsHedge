import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'ledger_logs',
  updatedAt: false,
  underscored: true,
})
export class LedgerLogs extends Model<LedgerLogs> {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  orderId: string;

  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'ledger_txn_id',
  })
  ledgerTransactionId: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  memo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.STRING,
  })
  error: string;

  @Column({
    type: DataType.STRING,
  })
  rejectionReason: string;

  @Column({
    type: DataType.STRING,
  })
  entries: string;

  @CreatedAt
  createdAt: Date;
}
