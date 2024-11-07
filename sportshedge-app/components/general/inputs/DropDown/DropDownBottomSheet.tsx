import { forwardRef, RefObject, memo } from 'react';
import {
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import BottomsheetHeader from '../../BottomSheet/BottomsheetHeader';
import CustomBottomSheet from '../../BottomSheet';

interface IDropDownBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: (number | string)[];
  handleSheetChanges?: (index: number) => void;
  title?: string;
}

let DropDownBottomSheet = forwardRef<BottomSheetModal, IDropDownBottomSheetProps>(
  function DropDownBottomSheet(props, ref) {
    // ref
    const bottomSheetModalRef = ref as RefObject<BottomSheetModal>;
    let { snapPoints } = props;

    if (snapPoints?.length === 1) {
      snapPoints = [ ...snapPoints, snapPoints[0] ];
    }

    return (
      <CustomBottomSheet
        handleStyle={{ display: 'none' }}
        index={0}
        {...props}
        snapPoints={snapPoints}
        containerClass="p-0 m-0"
        ref={bottomSheetModalRef}
        enableDynamicSizing={false}>
        <BottomsheetHeader
          title={props.title}
          handleClose={() => bottomSheetModalRef.current?.close()}
        />
        <View className="flex-1 px-[30px]">{props.children}</View>
      </CustomBottomSheet>
    );
  }
);

export default DropDownBottomSheet = memo(DropDownBottomSheet);
