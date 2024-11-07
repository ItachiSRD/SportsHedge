import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
} from 'class-validator';
import { SWAGGER, USER_GENDER } from '../../../core/constant';
import { REWARD_TYPES } from '../../../core/constant/enums';
import { PaginationQuery } from '../../../core/pagination';
import { ApiResponse } from '../../../core/swagger';
import { UserRewardsResponse } from '../../rewards/dto/rewards.dto';

/**
 * UpdateUserDto is used for update user
 */
export class UpdateUserDto {
  @ApiPropertyOptional({ example: SWAGGER.USER.EMAIL })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: SWAGGER.USER.GENDER })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: SWAGGER.USER.FIRST_NAME })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: SWAGGER.USER.MIDDLE_NAME })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiPropertyOptional({ example: SWAGGER.USER.LAST_NAME })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: SWAGGER.USER.IS_EMAIL_VERIFIED })
  @IsBoolean()
  @IsOptional()
  emailVerified: boolean;

  @ApiPropertyOptional({ example: SWAGGER.USER.METADATA })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ example: SWAGGER.USER.STATE })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: SWAGGER.USER.PROFILE_PIC })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({ example: SWAGGER.USER.IS_ACTIVE })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: SWAGGER.USER.IS_DELETED })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @ApiPropertyOptional({ example: SWAGGER.USER.IS_KYC_DONE })
  @IsBoolean()
  @IsOptional()
  isKycDone?: boolean;
}

export class UserDto extends UpdateUserDto {
  @ApiProperty({ example: SWAGGER.USER.USER_ID })
  id: string;

  @ApiProperty({ example: SWAGGER.USER.FIREBASE_ID })
  firebaseId: string;

  @ApiProperty({ example: SWAGGER.USER.IS_PHONE_VERIFIED })
  phoneVerified: boolean;

  @ApiProperty({ example: SWAGGER.USER.PHONE_NUMBER })
  phone: string;

  @ApiProperty({ example: SWAGGER.USER.COUNTRY })
  country: string;

  @ApiProperty({ example: SWAGGER.USER.REFERRAL_CODE })
  referralCode: string;

  @ApiProperty({ example: SWAGGER.USER.REFERRER })
  referrer: string;

  @ApiProperty({ example: SWAGGER.USER.LOCK_BOOK_ID })
  lockBookId: string;

  @ApiProperty({ example: SWAGGER.USER.MAIN_BOOK_ID })
  mainBookId: string;

  @ApiPropertyOptional({ example: SWAGGER.USER.FUNDS })
  funds?: number;
}

export class UserResponseDto extends UserDto {}

export class UserAPIResponse extends ApiResponse {
  @ApiProperty({ type: UserResponseDto })
  data: UserResponseDto;
}

class Phone {
  @ApiProperty({ example: SWAGGER.USER.PHONE_NUMBER })
  @IsPhoneNumber()
  @IsString()
  @IsNotEmpty()
  number: string;

  // TODO: Later add equals to other country codes
  @ApiProperty({ example: SWAGGER.USER.COUNTRY })
  @IsString()
  @IsNotEmpty()
  @Equals(SWAGGER.USER.COUNTRY)
  countryCode: string;
}

export class RegisterUserDto {
  @ApiProperty({
    example: SWAGGER.USER.USERNAME,
    description: 'Username saved by user while onboarding',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ type: Phone })
  @IsNotEmptyObject()
  @Type(() => Phone)
  phone: Phone;

  @ApiPropertyOptional({ example: SWAGGER.USER.REFERRAL_CODE })
  @IsString()
  @IsOptional()
  referralCode?: string;

  @ApiPropertyOptional({
    example: SWAGGER.USER.GENDER,
    enum: USER_GENDER,
  })
  @IsEnum(USER_GENDER)
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: SWAGGER.USER.COUNTRY })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: SWAGGER.USER.STATE })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: SWAGGER.USER.PROFILE_PIC })
  @IsString()
  @IsOptional()
  profilePicture?: string;
}

export class RegisterUserResponse extends UserResponseDto {}

export class RegisterUserApiResponse extends ApiResponse {
  @ApiProperty({ type: RegisterUserResponse })
  data: RegisterUserResponse;
}

export class PlayerIdQuery {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  playerId: string;
}

export class PaymentInitiateRequest {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  deviceOS: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  targetApp: string;
}

export class ToggleFavoriteResponse {
  @ApiProperty({ example: true })
  isFavorite: boolean;
}

export class ToggleFavoriteApiResponse extends ApiResponse {
  @ApiProperty({ type: ToggleFavoriteResponse })
  data: ToggleFavoriteResponse;
}

export class Holdings {
  [instrument: string]: number;
}

export class UserHoldingsApiResponse extends ApiResponse {
  @ApiProperty({ type: Holdings, example: SWAGGER.HOLDING })
  data: Holdings;
}

export class CurrentValueQuery {
  current_value: number;
}

export class GetUserInvestmentResponse {
  @ApiProperty({ example: SWAGGER.PLAYER.NAME })
  instrument: string;

  @ApiProperty({ example: SWAGGER.USER.INVESTED_AMOUNT })
  total: string;

  @ApiProperty({ example: SWAGGER.USER.INVESTED_AVERAGE })
  average: string;
}

export class GetUserInvestmentApiResponse extends GetUserInvestmentResponse {
  @ApiProperty({ type: GetUserInvestmentResponse })
  data: GetUserInvestmentResponse;
}

export class GetUserFunds {
  @ApiProperty({ example: SWAGGER.USER.FUNDS })
  funds: number | null;
}

export class GetUserFundsApiResponse extends ApiResponse {
  @ApiProperty({ type: GetUserFunds })
  data: GetUserFunds;
}

class Fund {
  transactionId: string;

  @ApiProperty({ example: SWAGGER.FUND.USER_ID })
  userId: string;

  @ApiProperty({
    enum: ['withdraw', 'deposit'],
    example: SWAGGER.FUND.TYPE,
  })
  type: string;

  @ApiProperty({ example: SWAGGER.FUND.CURRENCY })
  currency: string;

  @ApiProperty({ example: SWAGGER.FUND.AMOUNT })
  amount: number;

  @ApiProperty({ example: SWAGGER.FUND.STATUS })
  status: string;

  @ApiProperty({ example: SWAGGER.FUND.REFERENCE_ID })
  referenceId?: string;

  @ApiProperty({ example: SWAGGER.FUND.CREATED_AT })
  createdAt: Date;

  @ApiProperty({ example: SWAGGER.FUND.UPDATED_AT })
  updatedAt: Date;
}

export class FundsHistoryResponse extends PaginationQuery {
  @ApiProperty({ example: SWAGGER.FUND.USER_ID })
  userId: string;

  @ApiProperty({ type: [Fund] })
  fundTransactions: Fund[];
}

export class FundsHistoryApiResponse extends ApiResponse {
  @ApiProperty({ type: FundsHistoryResponse })
  data: FundsHistoryResponse;
}

export class BonusQuery {
  @ApiProperty({ example: SWAGGER.BONUS.TYPE, enum: REWARD_TYPES })
  @IsString()
  @IsNotEmpty()
  type: REWARD_TYPES;

  @ApiPropertyOptional({
    example: SWAGGER.BONUS.UPTO_MONTH,
    description: 'Get bonus history for previous months',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  uptoMonth?: number;
}

export class GetBonusApiResponse extends ApiResponse {
  @ApiProperty({ type: UserRewardsResponse })
  data: UserRewardsResponse;
}
