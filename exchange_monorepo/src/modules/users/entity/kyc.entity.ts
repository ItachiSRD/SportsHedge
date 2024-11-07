import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { USER_KYC_DOC_TYPE, USER_KYC_STATUS } from '../../../core/constant';
import { User } from './users.entity';

/**
 * UserPlayerFavorites table
 * It is designed to follow camelCase column names, even though postgres has snake_case. It will auto convert it to camelCase.
 * Id column is manually created as it's a BIGINT and inside js code, it has to be string.
 */
@Table({
  tableName: 'kyc',
  underscored: true,
})
export class Kyc extends Model<Kyc> {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
  })
  kycId: string;

  @Column({
    type: DataType.BIGINT,
    unique: true,
  })
  transactionId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  documentId: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(USER_KYC_DOC_TYPE),
    allowNull: false,
  })
  documentType: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(USER_KYC_STATUS),
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.JSON,
  })
  data: object;

  @ForeignKey(() => User) // Define the foreign key to User model
  @Column({
    type: DataType.BIGINT,
  })
  userId: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
