import React from 'react';
import { StyleSheet, SafeAreaView, Image } from 'react-native';
import { LandingScreensProps } from '../../types/guestNavigatorTypes';
import Colors from '../../constants/Colors';
import { Button } from '@rneui/base';
import FontNames from '../../constants/FontNames';
import { isLarge } from '../../utils/utils';

const LandingScreen: React.FC<LandingScreensProps> = ({
  route,
  navigation,
}: LandingScreensProps) => {
  return (
    <SafeAreaView style={styles.background}>
      <Image
        style={styles.logo}
        source={require('../../../assets/images/demo.png')}
      />
      <Button
        title='LOGIN'
        buttonStyle={{
          backgroundColor: Colors.primaryColor,
          borderRadius: 3,
          justifyContent: 'center',
          height: isLarge ? 70 : 50,
        }}
        titleStyle={{
          fontFamily: FontNames.FuturaBook,
          fontSize: isLarge ? 30 : 20,
        }}
        containerStyle={{
          width: '95%',
          marginHorizontal: 50,
          marginVertical: 20,
          marginBottom: 50,
          borderBottomEndRadius: 30,
          borderTopStartRadius: 30,
        }}
        onPress={() => {
          navigation.navigate('Login');
        }}
      />
    </SafeAreaView>
  );
};

export const screenOptions = (navigator: LandingScreensProps) => {
  return {
    headerTitle: 'Landing Screen',
  };
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.dark,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  logo: {
    width: '45%',
    height: '30%',
    position: 'absolute',
    bottom: '55%',
  },
});
export default LandingScreen;
