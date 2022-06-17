import React from 'react';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { Text, View } from 'react-native';
import { isLarge } from '../../utils/utils';

const DTHeaderTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '100%',
      }}>
      <Text
        style={{
          fontFamily: FontNames.MyriadProBold,
          fontSize: isLarge ? 22 : 17,
          color: Colors.primaryColor,
          textTransform: 'uppercase',
          width: '100%',
          textAlign: 'center',
        }}>
        {title}
      </Text>
    </View>
  );
};

export default DTHeaderTitle;
