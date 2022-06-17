import { Dimensions, Platform } from 'react-native';
import Colors from '../constants/Colors';

export const isAndroid = Platform.OS === 'android';
export const isLarge = Dimensions.get('window').height > 1000;

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;

export const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : '',
  },
  headerTitleStyle: {
    fontFamily: 'myriad-pro-regular',
  },
  headerBackTitleStyle: {
    fontFamily: 'myriad-pro-regular',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primaryColor,
};
