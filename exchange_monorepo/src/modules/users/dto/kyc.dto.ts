import { IsNumberString, IsString, Length, Matches } from 'class-validator';

/**
 * AadharKycDto is used for aadhar kyc otp request
 */
export class AadharKycDto {
  @IsString()
  @Length(12, 12)
  aadharNumber: string;
}

/**
 * AadharOtpDto is used for aadhar otp verification
 */
export class AadharOtpDto {
  @IsString()
  transId: string;

  @IsNumberString(undefined, { message: 'OTP must contain only numbers' })
  @Length(6, 6)
  otp: string;
}

/**
 * DrivingLicenseDto is used for the driving license verification
 */
export class DrivingLicenseDto {
  @IsString()
  licenseNumber: string;

  @IsString()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'DOB must be in dd-mm-yyyy format',
  })
  dob: string;
}

/**
 * PanDto is used for the pan card verification
 */
export class PanDto {
  @IsString()
  @Length(10, 10, { message: 'panNumber must be 10 characters.' })
  panNumber: string;
}

/**
 * BankAccountDto is used for the bank account verification
 */
export class BankDto {
  @IsString()
  @Length(5, 20)
  accountNo: string;

  @IsString()
  @Length(11, 11, { message: 'ifsc must be 11 characters.' })
  ifsc: string;
}
