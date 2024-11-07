import CustomText from '@/components/general/Text'
import { View } from 'react-native'
import ButtonOverlay from '../ButtonOverlay';
import { SPLASH_THEME_DATA } from '@/constants/splash-theme-data';
import BaseScreen from '@/screens/BaseScreen';


const Theme2 = () => {

  const ColoredText = ({ text, color }: { text: string, color: string }) => (
    <CustomText fontWeight={600} style={{color: color}} className={`text-[12px] leading-[18px] tracking-[0.48px]`}>{text}</CustomText>
  );

  return (
    <BaseScreen>
    <View style={{gap: 24}} className='mt-[51px] mx-[20px] flex-row justify-between items-center'>
      <CustomText fontWeight={700} className='text-white text-[19px] leading-[28.5px] tracking-[0.76px] mr-[23px]'>Virat Kohli</CustomText>
      <ButtonOverlay text='Buy'/>
      <ButtonOverlay text='Sell'/>
    </View>
    <View className='mx-[10px] mt-[49px] flex-1'>
      <View className='flex-row justify-between mx-[18.5px] mb-[6px]'>
        {SPLASH_THEME_DATA.theme2.title.map((item) => (
          <CustomText key={item.id} className='text-theme-content-active text-[12px] leading-[18px] tracking-[0.48px]'>{item.text}</CustomText>
        ))}
      </View>
      <View style={{gap: 20}}>
        {SPLASH_THEME_DATA.theme2.values.map((item) => (
          <View key={item.id} style={{opacity: item.opacity, marginHorizontal: item.marginX}} className='bg-global-gray-80 rounded-[8px] px-[20px] py-[20px] flex-row justify-between'>
            <ColoredText text={item.bid} color='#38E896'/>
            <ColoredText text={item.qty1} color='#38E896'/>
            <ColoredText text={item.offer} color='#FF6D64'/>
            <ColoredText text={item.qty2} color='#FF6D64'/>
          </View>
        ))}
      </View>
    </View>
    </BaseScreen>
  )
}

export default Theme2;