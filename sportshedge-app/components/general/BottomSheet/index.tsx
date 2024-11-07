import { forwardRef, RefObject, useCallback, memo } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetModalProps,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { Dimensions, View } from 'react-native';
import { bottomSheetStyle } from './style';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface ICustomBottomSheetProps extends BottomSheetModalProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  handleSheetChanges?: (index: number) => void;
  containerClass?: string;
  customHeader?: boolean;
}

let CustomBottomSheet = forwardRef<BottomSheetModal, ICustomBottomSheetProps>(
  function CustomBottomSheet(props, ref) {
    // ref
    const bottomSheetModalRef = ref as RefObject<BottomSheetModal>;
    const {
      customHeader,
      containerClass,
      snapPoints = [100],
      handleSheetChanges,
      children,
      enableDynamicSizing = true,
      ...bsProps
    } = props;

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} pressBehavior="close" />,
      []
    );

    const containerClasses = twMerge(
      'px-[30px] mt-3 pb-[30px]',
      clsx({
        'flex-1': !enableDynamicSizing
      }),
      containerClass
    );

    const maxHeight = Dimensions.get('window').height * 0.9;

    if (typeof snapPoints[0] === 'number' && snapPoints[0] > maxHeight) {
      snapPoints[0] = '90%';
    }

    const content = <View className={containerClasses}>{children}</View>;

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={enableDynamicSizing}
        maxDynamicContentSize={enableDynamicSizing ? maxHeight : undefined}
        onChange={handleSheetChanges}
        containerStyle={[bottomSheetStyle.containerStyle]}
        backgroundStyle={bottomSheetStyle.backgroundStyle}
        handleStyle={[bottomSheetStyle.handleStyle, customHeader && { display: 'none' }]}
        handleIndicatorStyle={bottomSheetStyle.handleIndicatorStyle}
        {...bsProps}>
        {enableDynamicSizing ? <BottomSheetView>{content}</BottomSheetView> : content}
      </BottomSheetModal>
    );
  }
);

export default CustomBottomSheet = memo(CustomBottomSheet);