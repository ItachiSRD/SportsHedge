import { StyleSheet } from 'react-native';
import { colors } from '../../../../styles/theme/colors';
import { FONTS } from '@/styles/theme/fonts';

export const textAreaStyles = StyleSheet.create({
  input: {
    color: colors['theme-content-primary'],
    fontFamily: FONTS.urbanist[400]
  }
});