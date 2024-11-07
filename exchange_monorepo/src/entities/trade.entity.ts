import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'trade',
  underscored: true,
  updatedAt: false,
})
export class Trade extends Model<Trade> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
  })
  tradeId: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  buyerOrderId: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  sellerOrderId: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  instrument: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  matchNumber: number;

  @Column({
    type: DataType.BIGINT,
  })
  buyerId: string;

  @Column({
    type: DataType.BIGINT,
  })
  sellerId: string;

  @CreatedAt
  createdAt: string;
}
