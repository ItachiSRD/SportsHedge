import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  CreatedAt,
} from 'sequelize-typescript';
import { REWARD_ACTION, REWARD_TYPES } from '../../../core/constant/enums';

@Table({
  tableName: 'reward_logs',
  underscored: true,
  updatedAt: false,
})
export class RewardLogs extends Model<RewardLogs> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
  })
  rewardLogId: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  rewardId: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId: string;

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
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(REWARD_ACTION),
  })
  action: REWARD_ACTION;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @CreatedAt
  createdAt: string;
}
