import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'postings',
  timestamps: true,
})
export class Postings extends Model<Postings> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  id: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  operationId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bookId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  value: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  metadata: any;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assetId: string;
}
