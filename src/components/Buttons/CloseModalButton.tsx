import React from 'react';
import FontNames from '../../constants/FontNames';
import { Button } from '@rneui/base';
import Colors from '../../constants/Colors';
import { isLarge } from '../../utils/utils';

const CloseModalButton: React.FC<{
  onPress: () => void;
  title: string;
  width?: string;
}> = (props) => {
  return (
    <Button
      onPress={props.onPress}
      title={props.title}
      buttonStyle={{
        backgroundColor: Colors.xplight,
        borderRadius: 3,
        justifyContent: 'center',
        height: isLarge ? 45 : 35,
        borderBottomEndRadius: 15,
        borderTopStartRadius: 15,
      }}
      titleStyle={{
        fontFamily: FontNames.FuturaBook,
        fontSize: isLarge ? 20 : 15,
        paddingHorizontal: 10,
        color: Colors.primaryColor,
      }}
      containerStyle={{
        paddingTop: 5,
        borderBottomEndRadius: 30,
        borderTopStartRadius: 30,
      }}
    />
  );
};

export default CloseModalButton;
