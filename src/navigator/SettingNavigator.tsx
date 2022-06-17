import { createStackNavigator } from '@react-navigation/stack';
import { SettingsNavigatorParamList } from '../types/SettingsNavigatorTypes';

import SettingsScreen from '../screens/settings/SettingScreen';

const SettingsStack = createStackNavigator<SettingsNavigatorParamList>();

const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator
      initialRouteName='Settings'
      screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name='Settings' component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
};

export default SettingsStackNavigator;
