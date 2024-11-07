import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { INSTRUMENT_TPYE, ORDER_SIDE, ORDER_STATES, ORDER_TYPE } from '../core/constant';

@Table({
  tableName: 'orders',
  underscored: true,
})
export class Order extends Model<Order> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
  })
  orderId: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId: bigint;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
  })
  transactionFee: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
  })
  feePercent: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  size: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  quantityFilled: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  priceFilled: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  feesFilled: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  totalAmount: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(ORDER_STATES),
    allowNull: false,
    defaultValue: ORDER_STATES.INIT,
  })
  status: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ORDER_SIDE),
  })
  side: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ORDER_TYPE),
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  instrument: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(INSTRUMENT_TPYE),
    allowNull: true,
  })
  instrument_type: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  settled_quantity: number;
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_settled: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_short: boolean;

  @Column({
    type: DataType.JSON,
  })
  metadata: any;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
