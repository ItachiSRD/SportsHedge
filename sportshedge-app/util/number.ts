export const formatNumToShort = (number: number) => {
  if (number >= 10000000) {
    return (number / 10000000).toFixed(2) + 'Cr';
  } else if (number >= 100000) {
    return (number / 100000).toFixed(2) + 'L';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(2) + 'K';
  } else {
    return number.toLocaleString('en-IN');
  }
};

export const roundOffNumber = (num: number, upToDecimals = 2) => {
  return parseFloat(num.toFixed(upToDecimals));
};
