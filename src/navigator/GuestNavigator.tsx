import { createStackNavigator } from '@react-navigation/stack';
import { GuestNavigatorParamList } from '../types/guestNavigatorTypes';

import LandingScreen from '../screens/guest/LandingScreen';
import LoginScreen from '../screens/guest/LoginScreen';

const GuestStack = createStackNavigator<GuestNavigatorParamList>();

const GuestStackNavigator = () => {
  return (
    <GuestStack.Navigator
      initialRouteName='Landing'
      screenOptions={{ headerShown: false }}>
      <GuestStack.Screen name='Landing' component={LandingScreen} />
      <GuestStack.Screen name='Login' component={LoginScreen} />
    </GuestStack.Navigator>
  );
};

export default GuestStackNavigator;
