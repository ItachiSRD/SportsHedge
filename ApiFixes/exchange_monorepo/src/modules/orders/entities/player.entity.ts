import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { PLAYER_ROLES } from '../../../core/constant';
import { OrderBook } from './player-types';

@Table({
  tableName: 'players',
  timestamps: false,
  underscored: true,
})
export class Player extends Model<Player> {
  // @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.STRING,
  })
  playerId: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isPlaying: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  canTrade: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  team: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(PLAYER_ROLES),
    allowNull: false,
  })
  role: string;

  //  TODO: Convert Decimal types to String
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  ltp: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  price: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  fantasyPoints: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  matchNumber: number;

  @Column({
    type: DataType.TEXT,
  })
  orderBook: string;

  @Column({
    type: DataType.JSON,
    defaultValue: { bids: [], asks: [] },
  })
  topPrices: OrderBook;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: 0,
  })
  maxInventoryLimit: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: 0,
  })
  buyInventoryLimit: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: 0,
  })
  sellInventoryLimit: string;
}
