import CustomText from '@/components/general/Text';
import { View } from 'react-native';

interface IUSPsSlideProps {
  title: string;
  description: string;
  backgroundTheme: React.ComponentType;
}

const USPsSlide = ( { title, description, backgroundTheme: BackgroundTheme}: IUSPsSlideProps ) => {

  return (
    <View className='flex-1'>
      <View className='flex-1'>
        <BackgroundTheme />
      </View>
      <View style={{gap: 20}} className='items-center'>
        <CustomText fontWeight={600} className='text-white text-[17px] leading-[25.5px] tracking-[0.85px]'>{title}</CustomText>
        <CustomText style={{textAlign: 'center'}} className='text-theme-content-secondary text-[14px] leading-[21px] tracking-[0.7px] self-center'>{description}</CustomText>
      </View>
    </View>
  )
}

export default USPsSlide;
