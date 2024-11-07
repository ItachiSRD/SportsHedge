export const KYC_DOC_TYPE = Object.freeze({
  AADHAR: 211,
  DRIVING_LICENSE: 326,
  PAN_CARD: 2,
  BANK_ACCOUNT: '92',
});

export const KYC_ERROR_CODES = Object.freeze({
  DOCUMENT_ALREADY_VERIFIED: 'DOCUMENT_ALREADY_VERIFIED',
  DOCUMENT_VERIFIED: 'DOCUMENT_VERIFIED',
  DOCUMENT_VERIFICATION_FAILED: 'DOCUMENT_VERIFICATION_FAILED',
});

export const USER_KYC_DOC_TYPE = Object.freeze({
  AADHAR: 'AADHAR',
  PAN: 'PAN',
  DRIVING_LICENSE: 'DRIVING_LICENSE',
  BANK_ACCOUNT: 'BANK_ACCOUNT',
});

export const USER_KYC_STATUS = Object.freeze({
  PENDING: 'PENDING',
  DONE: 'DONE',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
});

export const AADHAR_ERROR_CODES = Object.freeze({
  OTP_FAILED: {
    msg: 'Failed to get the otp',
  },
  VERIFICATION_FAILED: {
    msg: 'Failed to verify the Aadhar',
  },
  '1022': {
    code: 'WRONG_OTP',
    msg: 'Wrong otp',
  },
  '1088': {
    code: 'AADHARNO_IS_REQUIRED',
    msg: 'AadharNo is required',
  },
  '1017': {
    code: 'REQUEST_BODY_IS_REQUIRED',
    msg: 'Request body is required',
  },
  '1023': {
    code: 'OTP_EXPIRED',
    msg: 'otp expired',
  },
  '1024': {
    code: 'INVALID_UID_PLEASE_ENTER_VALID_UID',
    msg: 'Invalid UID. Please enter valid UID',
  },
  '1025': {
    code: 'AADHAAR_NUMBER_IS_DEACTIVATED_OR_SUSPENDED',
    msg: 'Aadhaar number is deactivated or suspended',
  },
  '2611': {
    code: 'AADHAAR_NOT_LINKED_TO_MOBILE_NUMBER',
    msg: 'Aadhaar not linked to mobile number',
  },
});

export const DL_ERROR_CODES = Object.freeze({
  VERIFICATION_FAILED: {
    msg: 'Failed to verify the Driving License',
  },
  '9': {
    code: 'DL_DETAIL_NOT_FOUND',
    msg: 'DL Detail Not Found',
  },
  '1091': {
    code: 'PLEASE_ENTER_CORRECT_LICENSE_NO',
    msg: 'Please enter the correct License No.',
  },
  '1092': {
    code: 'INVALID_DL_FORMAT',
    msg: 'Invalid DL format. Please re-enter the correct DL no.',
  },
});

export const PAN_ERROR_CODES = Object.freeze({
  VERIFICATION_FAILED: {
    msg: 'Failed to verify the PAN',
  },
  '9': {
    code: 'PAN_DETAIL_NOT_FOUND',
    msg: 'PAN Not Found',
  },
});

export const BANK_ACCOUNT_ERROR_CODES = Object.freeze({
  VERIFICATION_FAILED: {
    msg: 'Failed to verify the Bank Account Details',
  },
  1011: {
    code: 'INVALID_DATA',
    msg: 'Invalid request. Please check the Data.',
  },
});
