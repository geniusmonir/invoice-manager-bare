import React from 'react';
import FontNames from '../../constants/FontNames';
import { Button } from '@rneui/base';
import Colors from '../../constants/Colors';
import { isLarge } from '../../utils/utils';

const GlobalButton: React.FC<{
  onPress: () => void;
  title: string;
  width: number | string;
  color: string;
  disabled?: boolean;
  isLoading?: boolean;
  disabledColor?: string;
  fontColor?: string;
}> = ({
  onPress,
  title,
  width,
  color,
  isLoading = false,
  disabled = false,
  disabledColor = Colors.white,
  fontColor = Colors.white,
}) => {
  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      loading={isLoading}
      title={title}
      disabledStyle={{ backgroundColor: disabledColor }}
      disabledTitleStyle={{ color: Colors.darkGray }}
      buttonStyle={{
        backgroundColor: color,
        justifyContent: 'center',
        height: isLarge ? 50 : 40,
        borderBottomEndRadius: 20,
        borderTopStartRadius: 20,
      }}
      titleStyle={{
        fontFamily: FontNames.FuturaBook,
        fontSize: isLarge ? 24 : 18,
        paddingHorizontal: isLarge ? 10 : 7,
        color: fontColor ? fontColor : Colors.white,
        textTransform: 'uppercase',
      }}
      containerStyle={{
        width: width,
        paddingVertical: isLarge ? 10 : 7,
      }}
    />
  );
};

export default GlobalButton;
