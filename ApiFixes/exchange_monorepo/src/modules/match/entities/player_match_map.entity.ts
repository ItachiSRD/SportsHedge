import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'player_match_map',
  timestamps: false,
  underscored: true,
})
export class PlayerMatchMap extends Model<PlayerMatchMap> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  matchId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  playerId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  playerMatchNumber: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  fantasyPoints: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  returns: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  openingPrice: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  closingPrice: number;

  @CreatedAt
  createdAt: Date;
}
