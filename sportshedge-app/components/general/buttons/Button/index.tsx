import clsx from 'clsx';
import { ActivityIndicator, Image, ImageSourcePropType, Pressable, PressableProps } from 'react-native';
import { twMerge } from 'tailwind-merge';
import CustomText, { ICustomTextProps } from '../../Text';
import { customButtonStyles } from './styles';

export interface IButtonProps extends PressableProps {
  variant?: 'solid' | 'outlined' | 'ghost';
  shape?: 'rounded' | 'pill';
  containerClass?: string;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  loaderColor?: string;
  icon?: React.ReactNode;
  textClass?: string;
  textProps?: ICustomTextProps;
  disabled?: boolean;
  leadingIconSource?: ImageSourcePropType;
  trailingIconSource?: ImageSourcePropType;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Button = ({
  variant = 'solid',
  size = 'medium',
  shape,
  loading,
  loaderColor,
  containerClass,
  textClass,
  textProps,
  title,
  children,
  leadingIconSource,
  trailingIconSource,
  leadingIcon,
  trailingIcon,
  ...props
}: IButtonProps) => {
  const classes = twMerge(
    'active:opacity-60 bg-brand bg-brand flex-row items-center justify-center',
    clsx({
      'py-[13px] px-3': size === 'large',
      'py-1.5 px-3': size === 'medium',
      'py-[3px] px-3': size === 'small',
      'rounded': shape === 'rounded',
      'rounded-[20px]': shape === 'pill',
      'bg-transparent border border-brand': variant === 'outlined',
      'border-none bg-transparent p-0': variant === 'ghost',
      'bg-disabled-secondary': props.disabled
    }),
    containerClass
  );

  const textClasses = twMerge(
    'text-brand-content',
    clsx({
      'text-disabled-primary': props.disabled,
      'text-brand': variant === 'outlined' || variant === 'ghost'
    }),
    textClass
  );

  const style =
    typeof props.style === 'object'
      ? { ...customButtonStyles.container, ...props.style }
      : customButtonStyles.container;

  let iconSize = 20;

  if (size === 'large') iconSize = 24;
  else if (size === 'small') iconSize = 18;

  const iconClasses = twMerge(
    'w-5 h-5',
    clsx({
      'w-6 h-6': size === 'large',
      'w-[18px] h-[18px]': size === 'small'
    })
  );

  return (
    <Pressable {...props} style={{ ...style }} className={classes} accessibilityRole="button">
      {loading ? <ActivityIndicator testID='loader' color={loaderColor} size={iconSize} /> : null}
      {leadingIcon || (leadingIconSource ? <Image className={iconClasses} source={leadingIconSource} /> : null)}
      <>
        {title ? <CustomText {...textProps} textClass={textClasses}>{title}</CustomText> : children}
      </>
      {trailingIcon || (trailingIconSource ? <Image className={iconClasses} source={trailingIconSource} /> : null)}
    </Pressable>
  );
};

export default Button;
