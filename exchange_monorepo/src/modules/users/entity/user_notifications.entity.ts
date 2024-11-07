import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

/**
 * UserNotifications table
 */
@Table({
  tableName: 'user_notifications',
  underscored: true,
})
export class UserNotifications extends Model<UserNotifications> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
  })
  notificationId: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isRead: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
