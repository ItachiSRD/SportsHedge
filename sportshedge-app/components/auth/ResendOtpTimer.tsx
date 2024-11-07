import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { formatTimeFromSeconds } from '../../util/date';
import CustomText, { ICustomTextProps } from '../general/Text';

interface IResendOtpTimerProps extends ICustomTextProps {
  timeOut?: number; // timeout time in seconds
  text?: string;
  textClass?: string;
  canResendOtp?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResendOtpTimer = ({ text, timeOut = 120, canResendOtp, textClass, ...props }: IResendOtpTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(timeOut);

  useEffect(() => {
    if (timeLeft === 0 && canResendOtp) {
      canResendOtp(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev -1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const classes = twMerge(
    'text-xs text-theme-content-active',
    textClass
  );

  const { timeStr } = formatTimeFromSeconds(timeLeft);
  return (
    <CustomText {...props} textClass={classes}>{text} {timeStr}</CustomText>
  );
};

export default ResendOtpTimer;