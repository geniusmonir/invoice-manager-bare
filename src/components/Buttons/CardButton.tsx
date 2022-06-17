import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Badge, Icon } from 'react-native-elements';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { isLarge } from '../../utils/utils';

const CardButton: React.FC<{
  bgColor: string;
  color: string;
  height: number;
  width: number;
  text: string;
  icon: string;
  itemCount?: number;
  onPress: () => void;
}> = ({
  bgColor,
  color,
  height,
  width,
  text,
  icon,
  onPress,
  itemCount = 0,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width,
        height,
        backgroundColor: bgColor,
        margin: isLarge ? 10 : 5,
        padding: isLarge ? 15 : 10,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderBottomEndRadius: 30,
        borderTopStartRadius: 30,
      }}>
      <View>
        <View>
          <Icon
            tvParallaxProperties={Icon}
            size={isLarge ? 100 : 75}
            name={icon}
            type='ionicon'
            color={color}
          />
          {Boolean(itemCount) && itemCount > 0 && (
            <Badge
              status='success'
              badgeStyle={{
                width: isLarge ? 50 : 40,
                height: isLarge ? 50 : 40,
                borderRadius: 100,
                backgroundColor: color,
              }}
              textStyle={{ fontSize: isLarge ? 20 : 15 }}
              value={itemCount}
              containerStyle={{
                position: 'absolute',
                top: -4,
                right: isLarge ? 65 : 50,
              }}
            />
          )}
        </View>

        <Text
          style={{
            color,
            fontFamily: FontNames.MyriadProBold,
            fontSize: isLarge ? 28 : 22,
            marginTop: isLarge ? 30 : 20,
          }}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardButton;
