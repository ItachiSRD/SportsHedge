import CustomText from '@/components/general/Text';
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import Modal from 'react-native-modal';
import ModalButton from './button';

import { colors } from '@/styles/theme/colors';
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import XMark from '@/assets/icons/X.svg';
import { useModalFunctions } from './modalFunctions';
import BorderBumpDownIcon from '@/assets/icons/border-bump-down.svg'

const HomeScreenModal = () => {
  const [isModalVisible, setModalVisible] = useState(true);
  const {
    currentId,
    totalIds,
    handleLeftButton,
    handleRightButton,
    currentInfo,
  } = useModalFunctions();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <View>
      <Modal isVisible={isModalVisible} className='justify-end m-0' backdropOpacity={0.8}>
        <View className='bg-white rounded-[10px] mx-[30px] p-4'>
          <CustomText 
            fontWeight={700} 
            className='text-theme-secondary text-[16px] leading-[24px] tracking-[0.64px] mb-[8px]'
            >
              {currentInfo.title}
          </CustomText>
          <CustomText 
            fontWeight={500} 
            className='text-theme-secondary text-[12px] leading-[18px] tracking-[0.48px] mb-[12px]'
          >
            {currentInfo.desc}
          </CustomText>
          <View className='flex-row justify-between items-center'>
            <CustomText 
              fontWeight={700} 
              className='rounded-[20px] px-[8px] py-[4px] bg-[#EFEFEF] text-[#565661] text-[12px] leading-[18px] tracking-[0.48px]'>
                {currentId}/{totalIds}
            </CustomText>
              <View style={{gap: 12}} className='flex-row'>
                <ModalButton 
                  icon={<ChevronLeftIcon width={18} height={18} fill={currentId === 1 ? colors['theme-content-active'] : colors['theme-primary']} />}
                  onPress={handleLeftButton}
                />
                <ModalButton 
                  icon={<ChevronRightIcon width={18} height={18} fill={currentId === totalIds ? colors['theme-content-active'] : colors['theme-primary']}/>}
                  onPress={handleRightButton}
                />
              </View>
              <ModalButton 
                icon={<XMark width={18} height={18} fill={colors['theme-primary']}/>}
                onPress={toggleModal}
                customStyles='px-[4px]'
              />
          </View>
        </View>
        <View className='mb-[5px]'>
          <View style={{marginLeft: currentInfo.distance }} className='items-center w-1/4'>
            <BorderBumpDownIcon width={18} height={9}/>
            <View className='w-[74px] h-[74px] rounded-[70px] border border-[#D9D9D9]' style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}/>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default HomeScreenModal;
