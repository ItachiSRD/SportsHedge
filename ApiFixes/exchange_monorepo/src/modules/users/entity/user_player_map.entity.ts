import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

/**
 * UserPlayerFavorites table
 * It is designed to follow camelCase column names, even though postgres has snake_case. It will auto convert it to camelCase.
 * Id column is manually created as it's a BIGINT and inside js code, it has to be string.
 */
@Table({
  tableName: 'user_player_map',
  underscored: true,
  timestamps: false,
})
export class UserPlayerFavorites extends Model<UserPlayerFavorites> {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    unique: true,
  })
  userId: string;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  playerId: string;
}
