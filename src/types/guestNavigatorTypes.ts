import { StackScreenProps } from '@react-navigation/stack';

// Navigation Params

// Guest Screen Params
export type GuestNavigatorParamList = {
  Landing: undefined;
  Login: undefined;
};

export type GuestNavigatorParamType = keyof GuestNavigatorParamList;

// Screen List
export type LandingScreensProps = StackScreenProps<
  GuestNavigatorParamList,
  'Landing'
>;

export type LoginScreensProps = StackScreenProps<
  GuestNavigatorParamList,
  'Login'
>;
