import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'books',
  timestamps: true,
})
export class Books extends Model<Books> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
  })
  id: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  metadata: any;
}
