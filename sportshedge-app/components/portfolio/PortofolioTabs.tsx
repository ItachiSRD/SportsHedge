import { View } from 'react-native';
import React from 'react';
import Button from '../general/buttons/Button';

interface IPortfolioTabsProps {
  showHoldings?: boolean;
  selectedTab: 'Orders' | 'Holdings';
  handleToggle: (tab: 'Orders' | 'Holdings') => void;
}

const PortofolioTabs = ({
  showHoldings = false,
  selectedTab,
  handleToggle
}: IPortfolioTabsProps) => {
  return (
    <View className="px-[30px] border-b flex-row items-center border-outline-secondary">
      {showHoldings ? (
        <Button
          variant="ghost"
          containerClass={`flex-1 py-3 px-4 border-b border-transparent ${
            selectedTab === 'Holdings' ? 'border-global-gray-20' : ''
          }`}
          textClass={
            selectedTab === 'Holdings' ? 'text-global-gray-20' : 'text-theme-content-secondary'
          }
          textProps={{ fontWeight: 700 }}
          title="Holdings"
          onPress={() => handleToggle('Holdings')}
        />
      ) : null}
      <Button
        variant="ghost"
        containerClass={`flex-1 py-3 px-4 border-b border-transparent ${
          selectedTab === 'Orders' ? 'border-global-gray-20' : ''
        }`}
        textClass={
          selectedTab === 'Orders' ? 'text-global-gray-20' : 'text-theme-content-secondary'
        }
        textProps={{ fontWeight: 700 }}
        title="Orders"
        onPress={() => handleToggle('Orders')}
      />
    </View>
  );
};

export default PortofolioTabs;
