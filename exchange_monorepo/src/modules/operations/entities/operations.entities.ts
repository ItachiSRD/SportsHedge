import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  tableName: 'operations',
  timestamps: true,
})
export class Operations extends Model<Operations>{
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  id: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  memo: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  entries: any;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  rejectionReason: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  metadata: any;
}
