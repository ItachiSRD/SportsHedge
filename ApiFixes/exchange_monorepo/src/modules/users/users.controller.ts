import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Put,
  Query,
  Version,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { ERROR_CODES, ERROR_MSG } from '../../core/constant';
import { Pagination, PaginationDto } from '../../core/pagination';
import { CustomSwaggerResponse } from '../../core/swagger';
import { GetUser } from './decorator/get-user.decorator';
import {
  AadharKycDto,
  AadharOtpDto,
  BankDto,
  DrivingLicenseDto,
  PanDto,
} from './dto/kyc.dto';
import {
  BonusQuery,
  FundsHistoryApiResponse,
  FundsHistoryResponse,
  GetBonusApiResponse,
  GetUserFunds,
  GetUserFundsApiResponse,
  GetUserInvestmentApiResponse,
  GetUserInvestmentResponse,
  Holdings,
  PaymentInitiateRequest,
  PlayerIdQuery,
  RegisterUserApiResponse,
  RegisterUserDto,
  RegisterUserResponse,
  ToggleFavoriteApiResponse,
  UpdateUserDto,
  UserAPIResponse,
  UserHoldingsApiResponse,
  UserResponseDto,
} from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  throwUserNotFoundException() {
    throw new NotFoundException({
      message: ERROR_MSG.USER_NOT_FOUND,
      error_code: ERROR_CODES.NOT_FOUND,
    });
  }

  @Get()
  @Version('1')
  @CustomSwaggerResponse({
    summary: 'Get User details',
    type: UserAPIResponse,
  })
  async getUserDetails(
    @GetUser() userDetails: DecodedIdToken,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.getUserDetails(userDetails.uid);

    if (!user) {
      this.throwUserNotFoundException();
    }

    return user;
  }

  @Post()
  @Version('1')
  @CustomSwaggerResponse({
    type: RegisterUserApiResponse,
    summary: 'Register User',
    methodType: 'POST',
  })
  async registerUser(
    @GetUser() userDetails: DecodedIdToken,
    @Body() userDto: RegisterUserDto,
  ): Promise<RegisterUserResponse> {
    return this.usersService.findOrRegisterUser(userDetails, userDto);
  }

  @Put('/')
  @Version('1')
  @CustomSwaggerResponse({
    summary: 'Update User details',
    type: UserAPIResponse,
  })
  async updateUserDetails(
    @GetUser() userDetails: DecodedIdToken,
    @Body() userDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.updateUserById(
      userDetails.uid,
      userDto,
    );
    if (!updatedUser) {
      this.throwUserNotFoundException();
    }

    return updatedUser;
  }

  @Get('/funds')
  @Version('1')
  @CustomSwaggerResponse({
    summary: 'Get User Funds',
    type: GetUserFundsApiResponse,
  })
  async getUserFundsDetails(
    @GetUser() userDetails: DecodedIdToken,
  ): Promise<GetUserFunds> {
    const user = await this.usersService.getUserWithFunds(userDetails.uid, []);
    if (!user) {
      this.throwUserNotFoundException();
    }
    return {
      funds: user.funds,
    };
  }

  @Get('funds/history')
  @Version('1')
  @CustomSwaggerResponse({
    summary: 'Get User Funds History',
    type: FundsHistoryApiResponse,
    isPagination: true,
  })
  async getUserFundsHistory(
    @GetUser() userDetails: DecodedIdToken,
    @Pagination() pagination: PaginationDto,
  ): Promise<FundsHistoryResponse> {
    return this.usersService.getUserFundsHistory(userDetails.uid, pagination);
  }

  @Get('/favorites')
  @Version('1')
  @CustomSwaggerResponse({
    summary: 'Get User Favorite players',
  })
  async getUserFavoritePlayers(
    @GetUser() userDetails: DecodedIdToken,
  ): Promise<any> {
    const favorites = await this.usersService.getUserFavoritePlayers(
      userDetails.uid,
    );
    // favorites will be null only when user doesn't exist, else it will be empty array
    if (!favorites) {
      this.throwUserNotFoundException();
    }
    return favorites;
  }

  @Patch('favorites')
  @Version('1')
  @CustomSwaggerResponse({
    type: ToggleFavoriteApiResponse,
    summary: 'Toggle Favorite Player',
  })
  @ApiQuery({ name: 'playerId', allowEmptyValue: false, required: true })
  async toggleFavoritePlayer(
    @GetUser() userDetails: DecodedIdToken,
    @Query() query: PlayerIdQuery,
  ) {
    return this.usersService.toggleUserFavoritePlayer(
      userDetails.uid,
      query.playerId,
    );
  }

  @Get('holdings')
  @Version('1')
  @CustomSwaggerResponse({
    type: UserHoldingsApiResponse,
    summary: 'Get User Holdings',
  })
  async getUserHoldings(
    @GetUser() userDetails: DecodedIdToken,
  ): Promise<Holdings> {
    return this.usersService.getUserHoldings(userDetails.uid);
  }

  @Get('investment')
  @Version('1')
  @CustomSwaggerResponse({
    type: GetUserInvestmentApiResponse,
    summary: 'Get User Investments and Returns',
  })
  async getUserInvestment(
    @GetUser() userDetails: DecodedIdToken,
  ): Promise<GetUserInvestmentResponse[]> {
    return this.usersService.getInvestments(userDetails.uid);
  }

  @Get('bonus')
  @Version('1')
  @CustomSwaggerResponse({
    type: GetBonusApiResponse,
    summary: 'Get Bonus Locked Amount and Bonus History',
  })
  async getUserBonus(
    @GetUser() userDetails: DecodedIdToken,
    @Query() query: BonusQuery,
  ) {
    return this.usersService.getUserBonus(
      userDetails.uid,
      query.type,
      query.uptoMonth,
    );
  }

  @Post('/kyc/aadhar_get_otp')
  @Version('1')
  async getAadharOtp(
    @Body() aadharKycDto: AadharKycDto,
    @GetUser() userDetails: DecodedIdToken,
  ) {
    return this.usersService.getAadharOtp(userDetails.uid, aadharKycDto);
  }

  @Post('/kyc/aadhar_submit_otp')
  @Version('1')
  async submitAadharOtp(@Body() aadharOtpDto: AadharOtpDto) {
    return this.usersService.submitAadharOtp(aadharOtpDto);
  }

  @Post('/kyc/driving_license')
  @Version('1')
  async submitDrivingLicense(
    @Body() dlDto: DrivingLicenseDto,
    @GetUser() userDetails: DecodedIdToken,
  ) {
    return this.usersService.submitDrivingLicense(userDetails.uid, dlDto);
  }

  @Post('/kyc/pan_card')
  @Version('1')
  async submitPanCard(
    @Body() panDto: PanDto,
    @GetUser() userDetails: DecodedIdToken,
  ) {
    return this.usersService.submitPanCard(userDetails.uid, panDto);
  }

  @Post('/kyc/bank_account')
  @Version('1')
  async submitBankAccount(
    @Body() bankDto: BankDto,
    @GetUser() userDetails: DecodedIdToken,
  ) {
    return this.usersService.submitBankAccount(userDetails.uid, bankDto);
  }

  @Get('notifications')
  @CustomSwaggerResponse({
    summary: 'Get User Notifications',
  })
  @Version('1')
  async getUserNotifications(
    @GetUser() userDetails: DecodedIdToken,
  ): Promise<any> {
    const notifications = await this.usersService.getUserNotifications(
      userDetails.uid,
    );
    // notifications will be null only when user doesn't exist, else it will be empty array
    if (!notifications) {
      this.throwUserNotFoundException();
    }
    return notifications;
  }

  @Post('payment')
  @CustomSwaggerResponse({
    summary: 'Add User funds',
    methodType: 'POST',
  })
  @Version('1')
  async initiatePayment(
    @GetUser() userDetails: DecodedIdToken,
    @Body() paymentDetails: PaymentInitiateRequest,
  ) {
    return this.usersService.initiatePayment(userDetails.uid, paymentDetails);
  }
}
