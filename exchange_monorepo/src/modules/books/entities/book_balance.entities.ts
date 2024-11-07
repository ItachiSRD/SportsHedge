import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'book_balance',
  timestamps: true,
})
export class BookBalance extends Model<BookBalance> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
  })
  id: bigint;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bookId: string;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assetId: string;

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  operationType: string;

  @Column({
    type: DataType.DECIMAL(32, 6),
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  balance: number;
}
