import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'investments',
  underscored: true,
  timestamps: false,
})
export class Investments extends Model<Investments> {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId: string;

  @PrimaryKey
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
  total: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  average: string;
}
