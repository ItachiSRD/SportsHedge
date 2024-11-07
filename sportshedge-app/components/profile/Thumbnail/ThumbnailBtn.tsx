import PressableBtn, { IPressableBtnProps } from '../../general/buttons/PressableBtn';
import { twMerge } from 'tailwind-merge';

const ThumbnailBtn = ({ pressableClasses, children, ...props }: IPressableBtnProps) => {
  const classes = twMerge(
    'flex-row items-center justify-between bg-theme-secondary py-4 px-5 rounded-lg',
    pressableClasses
  );
  return (
    <PressableBtn {...props} pressableClasses={classes}>
      {children}
    </PressableBtn>
  );
};

export default ThumbnailBtn;