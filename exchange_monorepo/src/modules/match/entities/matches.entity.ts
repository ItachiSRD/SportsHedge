import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { MATCH_STATUS } from '../../../core/constant/match';

@Table({
  tableName: 'matches',
  timestamps: false,
})
export class Matches extends Model<Matches> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    field: 'match_id',
  })
  matchId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    field: 'short_name',
  })
  shortName: string;

  @Column({
    type: DataType.STRING,
    field: 'game_format',
  })
  gameFormat: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(MATCH_STATUS),
    defaultValue: MATCH_STATUS.NOT_STARTED,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.DATE,
    field: 'expected_start',
    allowNull: false,
  })
  expectedStart: Date;

  @Column({
    type: DataType.DATE,
    field: 'expected_end',
  })
  expectedEnd: Date;
}
