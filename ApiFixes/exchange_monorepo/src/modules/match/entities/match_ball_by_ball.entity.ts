import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'match_ball_by_ball',
  timestamps: false,
})
export class MatchBallByBall extends Model<MatchBallByBall> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
  })
  id: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'match_id',
  })
  matchId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'innings',
  })
  innings: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ball: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'current_over',
  })
  currentOver: string;

  @Column({
    type: DataType.STRING,
    field: 'previous_over',
  })
  previousOver: string;

  @Column({
    type: DataType.STRING,
    field: 'next_over',
  })
  nextOver: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'players_fantasy_points',
  })
  playersFantasyPoints: Record<string, number>;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
  })
  updatedAt: Date;
}
