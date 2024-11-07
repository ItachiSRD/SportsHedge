import { View } from 'react-native';
import React from 'react';
import PressableBtn from '../buttons/PressableBtn';
import CustomText from '../Text';

interface ISwitchTabProps {
  tabs: string[];
  tabsText?: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface ITabTextToLabel {
  [key: string]: string;
}

const SwitchTab = ({ tabs, tabsText = tabs, activeTab, setActiveTab }: ISwitchTabProps) => {
  const tabTextToLabel: ITabTextToLabel = {
    'Market Order': 'Available Price',
    'Limit Order': 'Your Price',
  };

  return (
    <View className="px-2 h-[50px] bg-[#111111] rounded-[50px] flex-row">
      {tabs.map((tab, index) => {
        const label = tabTextToLabel[tabsText[index]];
        return (
          <PressableBtn onPress={() => setActiveTab(tab)} key={tab} pressableClasses="py-2 flex-1">
            <View
              className={`${
                tab === activeTab ? 'bg-global-gray-80 rounded-[50px]' : ''
              } items-center flex-1 justify-center`}>
              <CustomText fontWeight={500} textClass="text-brand-content capitalize">
                {tabsText[index]}
              </CustomText>
              {label && (
                <CustomText textClass="text-[10px] text-theme-content-active capitalize leading-[15px] tracking-[0.4px]">
                  {label}
                </CustomText>
              )}
            </View>
          </PressableBtn>
        );
      })}
    </View>
  );
};

export default SwitchTab;
