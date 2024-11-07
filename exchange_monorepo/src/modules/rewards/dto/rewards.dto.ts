import { ApiProperty } from '@nestjs/swagger';
import { SWAGGER } from '../../../core/constant';
import { REWARD_ACTION, REWARD_TYPES } from '../../../core/constant/enums';

class RewardLog {
  @ApiProperty({ example: SWAGGER.BONUS_LOG.REWARD_LOG_ID })
  rewardLogId: string;

  @ApiProperty({ example: SWAGGER.BONUS_LOG.REWARD_ID })
  rewardId: string;

  @ApiProperty({ example: SWAGGER.BONUS_LOG.USER_ID })
  userId: string;

  @ApiProperty({ example: SWAGGER.BONUS_LOG.REWARD_TYPE, enum: REWARD_TYPES })
  type: REWARD_TYPES;

  @ApiProperty({ example: SWAGGER.BONUS_LOG.AMOUNT })
  amount: number;

  @ApiProperty({
    example: SWAGGER.BONUS_LOG.REWARD_ACTION,
    enum: REWARD_ACTION,
  })
  action: REWARD_ACTION;

  @ApiProperty({ example: SWAGGER.BONUS_LOG.DESCRIPTION })
  description: string;

  @ApiProperty({ example: SWAGGER.BONUS_LOG.CREATED_AT })
  createdAt: string;
}

class MonthWiseRewardLogs {
  [key: string]: RewardLog[];
}

export class UserRewardsResponse {
  @ApiProperty({ example: SWAGGER.BONUS.UPTO_MONTH })
  uptoMonth: number;

  @ApiProperty({ example: SWAGGER.BONUS.AMOUNT })
  amount: number;

  @ApiProperty({ example: SWAGGER.MONTH_WISE_BONUS_LOG })
  history: MonthWiseRewardLogs;

  @ApiProperty({ example: SWAGGER.BONUS.MORE_MONTHS_AVAILABLE })
  moreMonthsAvailable: number;
}
