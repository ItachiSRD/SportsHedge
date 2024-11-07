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
import { REDEEM_METHOD, REWARD_TYPES } from '../../../core/constant/enums';

@Table({
  tableName: 'rewards',
  underscored: true,
  timestamps: false,
})
export class Rewards extends Model<Rewards> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
  })
  rewardId: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(REWARD_TYPES),
  })
  type: REWARD_TYPES;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.DATE,
  })
  expiry: Date;

  @CreatedAt
  createdAt: string;

  @UpdatedAt
  updatedAt: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  redeemableAmount: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  redeemedAmount: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  redeemActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  redeemStart: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    values: Object.values(REDEEM_METHOD),
  })
  redeemMethod: REDEEM_METHOD;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 100,
  })
  redeemPercent: number;
}
