import React from 'react';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { Text, View } from 'react-native';
import { isLarge } from '../../utils/utils';

const HeaderTitle: React.FC<{ title: string }> = ({ title }) => {
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
          fontSize: isLarge ? 23 : 18,
          color: Colors.primaryColor,
          textTransform: 'uppercase',
          width: '100%',
          textAlign: 'center',
          marginRight: title == 'ADMIN SETTINGS' ? 0 : 20,
        }}>
        {title}
      </Text>
    </View>
  );
};

export default HeaderTitle;
