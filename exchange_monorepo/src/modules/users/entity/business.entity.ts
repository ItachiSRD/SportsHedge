import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'businesses',
  underscored: true,
})
export class Business extends Model<Business> {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
  })
  businessId: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
