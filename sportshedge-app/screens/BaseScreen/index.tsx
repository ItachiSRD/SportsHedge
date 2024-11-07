import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BaseScreen = ({ children, style, ...props }: ViewProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View {...props} style={[{
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right
    }, style]} className="flex-1 bg-theme-reverse-content-primary">
      {children}
    </View>
  );
};

export default BaseScreen;