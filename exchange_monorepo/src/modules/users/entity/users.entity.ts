import { Table, Column, Model, DataType } from 'sequelize-typescript';

import { USER_GENDER, USER_ROLE } from '../../../core/constant';
/**
 * User table
 * It is designed to follow camelCase column names, even though postgres has snake_case. It will auto convert it to camelCase.
 * Id column is manually created as it's a BIGINT and inside js code, it has to be string.
 */
@Table({
  tableName: 'users',
  underscored: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.BIGINT,
  })
  parent: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(USER_GENDER),
  })
  gender: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  firebaseId: string;

  @Column
  firstName: string;

  @Column
  middleName: string;

  @Column
  lastName: string;

  @Column
  emailVerified: boolean;

  @Column
  phoneVerified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  country: string;

  @Column
  state: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    field: 'referral_code',
  })
  referralCode: string;

  @Column({
    type: DataType.DECIMAL(32, 8),
    field: 'invested_amount',
    allowNull: false,
    defaultValue: 0,
  })
  investedAmount: number;

  @Column({
    type: DataType.DECIMAL(32, 8),
    field: 'realized_amount',
    allowNull: false,
    defaultValue: 0,
  })
  realizedAmount: number;

  @Column
  profilePicture: string;

  @Column({ type: DataType.BIGINT })
  referrer: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'INR',
    allowNull: false,
  })
  currency: string;

  @Column({
    type: DataType.ENUM, values: Object.values(USER_ROLE)
  })
  role: string;

  @Column
  isActive: boolean;

  @Column
  isDeleted: boolean;

  @Column
  isKycDone: boolean;

  @Column
  lockBookId: string;

  @Column
  mainBookId: string;

  @Column({
    type: DataType.JSON,
    defaultValue: {
      lock: null,
      main: null,
      short: null,
    },
    allowNull: false,
  })
  book: any;

  @Column({ type: DataType.JSONB })
  metadata: Record<string, any>;
}
