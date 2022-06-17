import { StackScreenProps } from '@react-navigation/stack';

// Navigation Params

// Settings Screen Params
export type SettingsNavigatorParamList = {
  Settings: undefined;
};

export type SettingsNavigatorParamType = keyof SettingsNavigatorParamList;

// Screen List
export type SettingsScreensProps = StackScreenProps<
  SettingsNavigatorParamList,
  'Settings'
>;
