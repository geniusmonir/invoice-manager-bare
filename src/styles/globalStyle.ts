import { StyleSheet } from 'react-native';
import FontNames from '../constants/FontNames';

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    fontFamily: FontNames.MyriadProRegular,
  },

  buttonStyle: {
    width: 250,
    marginVertical: 5,
  },

  buttonLabel: {
    fontFamily: FontNames.MyriadProRegular,
    fontWeight: 'normal',
  },

  cardTitle: {
    fontFamily: FontNames.MyriadProRegular,
    textAlign: 'center',
    marginBottom: 10,
  },

  fontStyle: {
    fontFamily: FontNames.MyriadProRegular,
    fontWeight: 'normal',
  },
});
