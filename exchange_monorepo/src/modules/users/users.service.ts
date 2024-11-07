import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { customAlphabet } from 'nanoid';
import { Op, Optional, QueryTypes, Sequelize } from 'sequelize';
import { NullishPropertiesOf } from 'sequelize/types/utils';
import {
  ERROR_CODES,
  ERROR_MSG,
  FUND_TRANSACTION_LOG_REPOSITORY,
  FUND_TRANSACTION_REPOSITORY,
  INVESTMENTS_REPOSITORY,
  KYC_ERROR_CODES,
  KYC_REPOSITORY,
  PLAYER_REPOSITORY,
  SEQUELIZE,
  USER_KYC_DOC_TYPE,
  USER_KYC_STATUS,
  USER_NOTIFICATIONS_REPOSITORY,
  USER_PLAYER_MAP_REPOSITORY,
  USER_REPOSITORY,
} from '../../core/constant';
import { REWARD_TYPES } from '../../core/constant/enums';
import { PaginationDto } from '../../core/pagination';
import { KycService } from '../../services/kyc/kyc.service';
import { LedgerService } from '../../services/ledger/ledger.service';
import { PhonepeService } from '../../services/phonepe/phonepe.service';
import { Player } from '../orders/entities/player.entity';
import { PublicRepository } from '../public/public.repository';
import { RewardsService } from '../rewards/rewards.service';
import {
  AadharKycDto,
  AadharOtpDto,
  BankDto,
  DrivingLicenseDto,
  PanDto,
} from './dto/kyc.dto';
import {
  CurrentValueQuery,
  FundsHistoryResponse,
  GetUserInvestmentResponse,
  Holdings,
  PaymentInitiateRequest,
  RegisterUserDto,
  ToggleFavoriteResponse,
  UpdateUserDto,
  UserDto,
} from './dto/users.dto';
import { FundTransactionLogs } from './entity/fund_transaction_logs.entity';
import { FundTransactions } from './entity/fund_transactions.entity';
import { Kyc } from './entity/kyc.entity';
import { UserNotifications } from './entity/user_notifications.entity';
import { UserPlayerFavorites } from './entity/user_player_map.entity';
import { User } from './entity/users.entity';
import { Investments } from '../../entities/investments.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(INVESTMENTS_REPOSITORY)
    private readonly investmentRepository: typeof Investments,
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(USER_PLAYER_MAP_REPOSITORY)
    private readonly userPlayerMapModel: typeof UserPlayerFavorites,
    @Inject(KYC_REPOSITORY) private readonly kycRepository: typeof Kyc,
    private readonly ledgerService: LedgerService,
    private readonly kycService: KycService,
    @Inject(USER_NOTIFICATIONS_REPOSITORY)
    private readonly userNotificationsModel: typeof UserNotifications,
    private readonly phonepeService: PhonepeService,
    @Inject(FUND_TRANSACTION_REPOSITORY)
    private readonly fundTransaction: typeof FundTransactions,
    @Inject(FUND_TRANSACTION_LOG_REPOSITORY)
    private readonly fundTransactionLogs: typeof FundTransactionLogs,
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: typeof Player,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
    private readonly rewardsService: RewardsService,
    private readonly publicRepository: PublicRepository,
  ) {}

  async create(user: User): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  async findOneByFirebaseId(firebaseId: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { firebaseId } });
  }

  private sendFormattedUserResponse(user: User): UserDto {
    // exclude properties to be send back as response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { realizedAmount, investedAmount, ...response } = user.dataValues;
    return response;
  }

  /**
   * If this method is called just for INR, then it will return user object
   * where the funds key will be just INR value.
   * Ensure `serializeForInr` is set to true along with instruments[0] having INR
   *
   * Incase, you provide an instrument, for which balance doesn't exist, it will return `{...user, "funds": null}`
   * @param firebaseId
   * @param instruments
   * @param serializeForInr - defaults to false
   * @returns
   */
  async getUserWithFunds(
    firebaseId: string,
    instruments: string[],
    serializeForInr: boolean = false,
  ): Promise<any> {
    const existingUser = await this.findOneByFirebaseId(firebaseId);
    if (!existingUser) {
      return null;
    }

    const response = {
      ...existingUser.dataValues,
      funds: null,
    };

    let user = existingUser;
    if (!existingUser.mainBookId && !existingUser.lockBookId) {
      // Retry to create the user books
      user = await this.createBooksAndSaveUser(existingUser);
    }

    const balances = await this.ledgerService.getBookBalances(
      user.mainBookId,
      instruments,
    );

    if (!balances || Object.keys(balances).length === 0) {
      return response;
    }

    if (
      instruments.length === 1 &&
      instruments[0].toUpperCase() === 'INR' &&
      serializeForInr
    ) {
      response.funds = balances['INR'];
    } else {
      response.funds = balances;
    }

    return response;
  }

  async getUserDetails(firebaseId: string): Promise<UserDto> {
    //  1. Get User Details from Database
    const existingUser = await this.findOneByFirebaseId(firebaseId);
    if (!existingUser) {
      return null;
    }

    let user = existingUser;
    if (!existingUser.mainBookId && !existingUser.lockBookId) {
      // Retry to create the user books
      user = await this.createBooksAndSaveUser(existingUser);
    }

    //  2. Get User's INR balances from Ledger
    const balances = await this.ledgerService.getBookBalances(user.mainBookId, [
      user.currency,
    ]);

    // TODO: Verify whether balances is an empty object
    const funds = balances ? balances[user.currency] : null;

    return {
      ...this.sendFormattedUserResponse(user),
      funds,
    };
  }

  async updateUserById(
    firebaseId: string,
    userDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.findOneByFirebaseId(firebaseId);
    if (!user) {
      return null;
    }

    const updates = {};
    for (const updateKey in userDto) {
      if (userDto[updateKey] !== undefined) {
        updates[updateKey] = userDto[updateKey];
      }
    }

    //  Get User's INR balances from Ledger
    const balances = await this.ledgerService.getBookBalances(user.mainBookId, [
      user.currency,
    ]);

    // TODO: Verify whether balances is an empty object
    const funds = balances ? balances[user.currency] : null;

    if (!Object.keys(updates)?.length) {
      return {
        ...this.sendFormattedUserResponse(user),
        funds,
      };
    }

    const [, updatedUser] = await this.userRepository.update(
      { ...updates },
      {
        where: { id: user.id },
        returning: true,
      },
    );

    return {
      ...this.sendFormattedUserResponse(updatedUser[0]),
      funds,
    };
  }

  private async createBooksAndSaveUser(user: User) {
    const { lockBookId, mainBookId } = await this.ledgerService.createBooks(
      user.id,
    );

    user.lockBookId = lockBookId;
    user.mainBookId = mainBookId;
    user.isActive = true;

    await user.save();
    return user;
  }

  private generateReferralCode(length = 12) {
    const allowedString =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    return customAlphabet(allowedString, length)().toUpperCase();
  }

  /**
   * Tries to find user by it's (phone or firebaseId)
   * If found, returns the existing user, else creates the user.
   */
  async findOrRegisterUser(
    userDetails: DecodedIdToken,
    userDto: RegisterUserDto,
  ): Promise<UserDto> {
    // 1. Validate Firebase phone number with body phone number
    if (
      userDetails.phone_number !==
      `${userDto.phone.countryCode}${userDto.phone.number}`
    ) {
      throw new BadRequestException({
        message: ERROR_MSG.USER_REGISTER_PHONE_FAILED,
        error_code: ERROR_CODES.USER_REGISTER_FAIL,
      });
    }

    let user: User = null;
    const transaction = await this.sequelize.transaction();
    try {
      // 2. Create new user object
      const providedUserDetails: Optional<User, NullishPropertiesOf<User>> = {
        firstName: userDto.userName,
        firebaseId: userDetails.uid,
        email: userDetails.email,
        phone: userDto.phone.number,
        phoneVerified: true,
        country: userDto.phone.countryCode,
        referralCode: this.generateReferralCode(),
      };

      // 3. Check for existing user in case they re-register
      const [existingUser, created] = await this.userRepository.findOrCreate({
        defaults: providedUserDetails,
        where: {
          [Op.or]: {
            firebaseId: userDetails.uid,
          },
        },
        transaction,
      });

      // 4. If user books are already created, return
      if (existingUser.lockBookId && existingUser.mainBookId) {
        return existingUser.dataValues;
      }

      // 5. If ledger books not created, get User details
      if (existingUser) {
        user = existingUser;
      } else {
        user = new User(providedUserDetails);
      }

      // 6. Create new Ledger Books
      const { lockBookId, mainBookId, shortBookId } =
        await this.ledgerService.createBooks(user.id);

      user.lockBookId = lockBookId;
      user.mainBookId = mainBookId;
      user.book = {
        main: mainBookId,
        lock: lockBookId,
        short: shortBookId,
      };
      user.isActive = true;

      // 7. Get Referral details if new User
      if (created && userDto.referralCode) {
        const referrer = await this.userRepository.findOne({
          where: { referralCode: userDto.referralCode },
          transaction,
        });

        user.referrer = referrer.id;
      }

      //  8. Save all User Details
      await user.save({ transaction });

      //  9. Provide joining bonus for User
      await this.rewardsService.provideJoiningBonus(user, transaction);

      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      throw err;
    }

    //  10. Get User's INR balances from Ledger
    const balances = await this.ledgerService.getBookBalances(user.mainBookId, [
      user.currency,
    ]);
    const funds = balances ? balances[user.currency] : null;

    return {
      ...user.dataValues,
      funds,
    };
  }

  async getUserFundsHistory(
    firebaseId: string,
    pagination: PaginationDto,
  ): Promise<FundsHistoryResponse> {
    const existingUser = await this.findOneByFirebaseId(firebaseId);

    if (!existingUser) {
      throw new NotFoundException({
        message: ERROR_MSG.USER_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    const fundTransactions = await this.fundTransaction.findAll({
      where: {
        userId: existingUser.id,
      },
      attributes: { exclude: ['userId'] },
      order: [['created_at', 'desc']],
      offset: pagination.offset,
      limit: pagination.limit,
    });

    return {
      userId: existingUser.id,
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
      fundTransactions,
    };
  }

  async getUserFavoritePlayers(firebaseId: string) {
    const user = await this.findOneByFirebaseId(firebaseId);
    if (!user || Object.keys(user).length === 0) {
      return null;
    }
    const favoritePlayers = await this.userPlayerMapModel.findAll({
      where: {
        userId: user.id,
      },
    });

    return {
      userId: user.id,
      favorites: favoritePlayers.reduce((acc, curr) => {
        acc.push(curr.playerId);
        return acc;
      }, []),
    };
  }

  async toggleUserFavoritePlayer(
    firebaseId: string,
    playerId: string,
  ): Promise<ToggleFavoriteResponse> {
    const [user, player] = await Promise.all([
      this.findOneByFirebaseId(firebaseId),
      this.playerRepository.findByPk(playerId),
    ]);
    if (!user) {
      throw new NotFoundException({
        message: ERROR_MSG.USER_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    if (!player) {
      throw new NotFoundException({
        message: ERROR_MSG.PLAYER_DETAILS_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    const [, created] = await this.userPlayerMapModel.findOrCreate({
      where: {
        userId: user.id,
        playerId: playerId,
      },
      defaults: {
        userId: user.id,
        playerId: playerId,
      },
    });

    if (!created) {
      // If created is false, delete the existing record
      const count = await this.userPlayerMapModel.destroy({
        where: {
          userId: user.id,
          playerId: playerId,
        },
      });

      if (!count) {
        throw new BadRequestException({
          message: ERROR_MSG.USER_FAVORITE_NOT_REMOVED,
          error_code: ERROR_CODES.BAD_REQUEST,
        });
      }
    }

    return { isFavorite: created };
  }

  private async getUserPlayersBalance(
    userMainBookId: string,
    instrument?: string[],
  ) {
    const balances = await this.ledgerService.getBookBalances(
      userMainBookId,
      instrument ?? [],
    );

    if (!balances || Object.keys(balances).length === 0) {
      return null;
    }

    // remove currency balance key
    if ('INR' in balances) {
      delete balances.INR;
    }

    return balances;
  }

  async getUserHoldings(firebaseId: string): Promise<Holdings> {
    //  1. Verify if User exists
    const existingUser = await this.findOneByFirebaseId(firebaseId);
    if (!existingUser) {
      throw new NotFoundException({
        message: ERROR_MSG.USER_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    //  TODO: Extract this logic somewhere else
    // 2. Create user books if they don't exist
    let user = existingUser;
    if (!existingUser.mainBookId && !existingUser.lockBookId) {
      user = await this.createBooksAndSaveUser(existingUser);
    }

    //  3. Fetch balance from Ledger
    const balances = await this.ledgerService.getBookBalances(user.mainBookId);
    if (balances) {
      delete balances[user.currency];
    }

    return balances;
  }

  private async getUserPlayersCurrentValue(
    playersBalance: { [key: string]: number },
    playersLastTradedPrice: { [key: string]: number },
  ): Promise<number> {
    const playersBalancesData = Object.entries(playersBalance).map(
      ([key, value]) => [
        key.toUpperCase(),
        Number(value),
        playersLastTradedPrice[key] ?? 0,
      ],
    );

    if (playersBalancesData.length === 0) {
      return 0;
    }

    const valuesPlaceholder = playersBalancesData
      .map(() => '(?, ?, ?)')
      .join(', ');

    const query = `
      WITH player_quantity_data(player_id, player_quantity, player_ltp) AS (
        VALUES ${valuesPlaceholder}
      )
      SELECT
        SUM(
          CASE
            WHEN pq.player_ltp = 0 THEN p.price
            ELSE pq.player_ltp
          END
           * pq.player_quantity
        ) AS current_value
      FROM
        players p
        JOIN player_quantity_data pq ON p.player_id = pq.player_id;
    `;

    const [playersValue]: CurrentValueQuery[] = await this.sequelize.query(
      query,
      { replacements: playersBalancesData.flat(), type: QueryTypes.SELECT },
    );

    return playersValue?.current_value ? Number(playersValue.current_value) : 0;
  }

  async getInvestments(
    firebaseId: string,
  ): Promise<GetUserInvestmentResponse[]> {
    //  1. Verify if User exists
    const existingUser = await this.findOneByFirebaseId(firebaseId);
    if (!existingUser) {
      throw new NotFoundException({
        message: ERROR_MSG.USER_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    //  TODO: Extract this logic somewhere else
    // 2. Create user books if they don't exist
    let user = existingUser;
    if (!existingUser.mainBookId && !existingUser.lockBookId) {
      user = await this.createBooksAndSaveUser(existingUser);
    }

    //  3. Get user Investments from database
    const investments = await this.investmentRepository.findAll({
      where: {
        userId: user.id,
      },
      raw: true,
    });

    const output = investments.map((data) => {
      delete data.userId;
      return data;
    });

    return output;
  }

  async getUserBonus(
    firebaseId: string,
    type: REWARD_TYPES,
    uptoMonth: number,
  ) {
    const existingUser = await this.findOneByFirebaseId(firebaseId);

    if (!existingUser) {
      throw new NotFoundException({
        message: ERROR_MSG.USER_NOT_FOUND,
        error_code: ERROR_CODES.NOT_FOUND,
      });
    }

    return this.rewardsService.getUserRewards(existingUser.id, type, uptoMonth);
  }

  async verifyKycInitiation(documentId: string) {
    // 1: Check if document already verified
    const existingDoc = await this.kycRepository.findOne({
      where: {
        documentId: documentId,
        status: USER_KYC_STATUS.DONE,
      },
    });

    // 2: If document already verified reject the request
    if (existingDoc) {
      throw new BadRequestException({
        code: KYC_ERROR_CODES.DOCUMENT_ALREADY_VERIFIED,
        message: 'Document is already verified.',
      });
    }

    // 3: If document verification was initiated before but left incomplete
    // update the status to CANCELLED from PENDING;
    await this.kycRepository.update(
      { status: USER_KYC_STATUS.CANCELLED },
      {
        where: {
          documentId: documentId,
          status: USER_KYC_STATUS.PENDING,
        },
      },
    );
  }

  async getAadharOtp(firebaseId: string, aadharKycDto: AadharKycDto) {
    // 1: Check if verification can be initiated
    await this.verifyKycInitiation(aadharKycDto.aadharNumber);

    const user = await this.findOneByFirebaseId(firebaseId);

    // 2: Save the user kyc initiation info
    const kycDoc = await this.kycRepository.create<Kyc>({
      documentId: aadharKycDto.aadharNumber,
      documentType: USER_KYC_DOC_TYPE.AADHAR,
      status: USER_KYC_STATUS.PENDING,
      userId: user.id,
    });

    try {
      // 3: Submit the details to kyc provider
      const kycResponse = await this.kycService.getAadharOtp(
        kycDoc.kycId,
        aadharKycDto,
      );

      // 4: Update the kyc table with the transactionId
      const [, updatedKycDoc] = await this.kycRepository.update<Kyc>(
        { transactionId: kycResponse.tsTransId },
        {
          where: { kycId: kycDoc.kycId },
          returning: true,
        },
      );

      return updatedKycDoc[0];
    } catch (err) {
      if (err.data) {
        throw new BadRequestException({
          code: err.name,
          message: err.message,
        });
      }
      throw err;
    }
  }

  async submitAadharOtp(aadharOtpDto: AadharOtpDto) {
    const updates = {};
    let error;

    try {
      // Step 1: Submit otp and get the user aadhar details
      const kycResponse = await this.kycService.submitAadharOtp(aadharOtpDto);
      updates['data'] = kycResponse.msg;
      updates['status'] = USER_KYC_STATUS.DONE;
    } catch (err) {
      error = err;
      updates['data'] = err.data.msg;
      updates['status'] = USER_KYC_STATUS.REJECTED;
    }

    // Step 2: Save the user aadhar details/error in kyc table
    const [, updatedKycDoc] = await this.kycRepository.update<Kyc>(
      { ...updates },
      {
        where: { transactionId: aadharOtpDto.transId },
        returning: true,
      },
    );

    if (error) {
      if (error.data) {
        throw new BadRequestException({
          code: error.name || KYC_ERROR_CODES.DOCUMENT_VERIFICATION_FAILED,
          message: error.message,
        });
      }
      throw error;
    }

    return updatedKycDoc[0];
  }

  async submitDrivingLicense(firebaseId: string, dlDto: DrivingLicenseDto) {
    // 1: Check if verification can be initiated
    await this.verifyKycInitiation(dlDto.licenseNumber);

    const user = await this.findOneByFirebaseId(firebaseId);

    // 2: Save the user kyc initiation info
    const kycDoc = await this.kycRepository.create<Kyc>({
      documentId: dlDto.licenseNumber,
      documentType: USER_KYC_DOC_TYPE.DRIVING_LICENSE,
      status: USER_KYC_STATUS.PENDING,
      userId: user.id,
    });

    const updates = {};
    let error;

    try {
      // 3: Verify Driving License
      const kycResponse = await this.kycService.submitDrivingLicense(
        kycDoc.kycId,
        dlDto,
      );
      updates['data'] = kycResponse.msg;
      updates['status'] = USER_KYC_STATUS.DONE;
    } catch (err) {
      error = err;
      updates['data'] = err.data?.msg;
      updates['status'] = USER_KYC_STATUS.REJECTED;
    }

    // 4: Save the user DL details/error in kyc table
    const [, updatedKycDoc] = await this.kycRepository.update<Kyc>(
      { ...updates },
      {
        where: { kycId: kycDoc.kycId },
        returning: true,
      },
    );

    if (error) {
      if (error.data) {
        throw new BadRequestException({
          code: error.name || KYC_ERROR_CODES.DOCUMENT_VERIFICATION_FAILED,
          message: error.message,
        });
      }
      throw error;
    }

    return updatedKycDoc[0];
  }

  async submitPanCard(firebaseId: string, panDto: PanDto) {
    // 1: Check if verification can be initiated
    await this.verifyKycInitiation(panDto.panNumber);

    const user = await this.findOneByFirebaseId(firebaseId);

    // 2: Save the user kyc initiation info
    const kycDoc = await this.kycRepository.create<Kyc>({
      documentId: panDto.panNumber,
      documentType: USER_KYC_DOC_TYPE.PAN,
      status: USER_KYC_STATUS.PENDING,
      userId: user.id,
    });

    const updates = {};
    let error;

    try {
      // 3: Verify Pan Card
      const kycResponse = await this.kycService.submitPanCard(
        kycDoc.kycId,
        panDto,
      );
      updates['data'] = kycResponse.msg;
      updates['status'] = USER_KYC_STATUS.DONE;
    } catch (err) {
      error = err;
      updates['data'] = err.data?.msg;
      updates['status'] = USER_KYC_STATUS.REJECTED;
    }

    // 4: Save the user PAN details/error in kyc table
    const [, updatedKycDoc] = await this.kycRepository.update<Kyc>(
      { ...updates },
      {
        where: { kycId: kycDoc.kycId },
        returning: true,
      },
    );

    if (error) {
      if (error.data) {
        throw new BadRequestException({
          code: error.name || KYC_ERROR_CODES.DOCUMENT_VERIFICATION_FAILED,
          message: error.message,
        });
      }
      throw error;
    }

    return updatedKycDoc[0];
  }

  async submitBankAccount(firebaseId: string, bankDto: BankDto) {
    // 1: Check if verification can be initiated
    await this.verifyKycInitiation(bankDto.accountNo);

    const user = await this.findOneByFirebaseId(firebaseId);

    // 2: Save the user kyc initiation info
    const kycDoc = await this.kycRepository.create<Kyc>({
      documentId: bankDto.accountNo,
      documentType: USER_KYC_DOC_TYPE.BANK_ACCOUNT,
      status: USER_KYC_STATUS.PENDING,
      userId: user.id,
    });

    const updates = {};
    let error;

    try {
      // 3: Verify Bank Account
      const kycResponse = await this.kycService.submitBankAccount(
        kycDoc.kycId,
        bankDto,
      );
      updates['data'] = kycResponse.msg;
      updates['status'] = USER_KYC_STATUS.DONE;
    } catch (err) {
      error = err;
      updates['data'] = err.data?.msg;
      updates['status'] = USER_KYC_STATUS.REJECTED;
    }

    // 4: Save the user Bank Account details/error in kyc table
    const [, updatedKycDoc] = await this.kycRepository.update<Kyc>(
      { ...updates },
      {
        where: { kycId: kycDoc.kycId },
        returning: true,
      },
    );

    if (error) {
      if (error.data) {
        console.log('error message', error.message);
        throw new BadRequestException({
          code: error.name || KYC_ERROR_CODES.DOCUMENT_VERIFICATION_FAILED,
          message: error.message,
        });
      }
      throw error;
    }

    return updatedKycDoc[0];
  }

  async getUserNotifications(firebaseId: string) {
    const user = await this.findOneByFirebaseId(firebaseId);
    if (!user || Object.keys(user).length === 0) {
      return null;
    }

    const userNotifications = await this.userNotificationsModel.findAll({
      where: { userId: user.id },
    });

    return {
      userId: user.id,
      notifications: userNotifications.map(
        ({ title, description, createdAt }) => ({
          title,
          description,
          created_at: createdAt,
        }),
      ),
    };
  }

  async initiatePayment(
    userId: string,
    paymentDetails: PaymentInitiateRequest,
  ) {
    //  1. Create an Entry in the database for the request
    const currency = 'INR';
    const fundTransaction = await this.fundTransaction.create({
      userId,
      type: 'deposit',
      currency,
      amount: paymentDetails.amount,
      status: 'INITIATED',
    });
    const transactionId = fundTransaction.transactionId;

    //  2. Call Phonepe for the initiate Payment
    const paymentInfo = await this.phonepeService.initiatePayment(
      userId,
      paymentDetails,
      transactionId,
    );

    //  3. Create Fund Transaction Log
    await this.fundTransactionLogs.create({
      transactionId,
      status: 'SUCCESS',
      description: paymentInfo,
    });

    return paymentInfo;
  }
}
