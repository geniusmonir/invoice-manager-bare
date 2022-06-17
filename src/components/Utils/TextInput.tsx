import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps,
  View,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { isLarge } from '../../utils/utils';

type TextInputTypeProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  ref?: React.Ref<RNTextInput>;
  touched?: boolean;
} & TextInputProps;

const TextInput: React.FC<TextInputTypeProps> = React.forwardRef(
  ({ icon, error, touched, ...props }, ref) => {
    const [iconEye, setIconEye] =
      useState<keyof typeof Ionicons.glyphMap>('eye-off');
    const [hidePassword, setHidePassword] = useState(true);
    const validationColor = !touched
      ? Colors.primaryColor
      : error
      ? Colors.redColor
      : Colors.primaryColor;

    const _changeIconEye = () => {
      iconEye !== 'eye-off'
        ? (setIconEye('eye-off'), setHidePassword(true))
        : (setIconEye('eye'), setHidePassword(false));
    };

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: isLarge ? 58 : 45,
          borderRadius: 4,
          borderBottomEndRadius: isLarge ? 30 : 24,
          borderTopStartRadius: isLarge ? 30 : 24,
          borderColor: validationColor,
          borderWidth: StyleSheet.hairlineWidth,
          backgroundColor: Colors.xplight,
          padding: isLarge ? 8 : 5,
        }}>
        <View style={{ padding: 8 }}>
          <Ionicons
            name={icon}
            color={validationColor}
            size={isLarge ? 25 : 18}
          />
        </View>

        <View style={{ flex: 1 }}>
          <RNTextInput
            underlineColorAndroid='transparent'
            style={{
              fontFamily: FontNames.MyriadProBold,
              color: Colors.primaryColor,
              fontSize: isLarge ? 20 : 15,
            }}
            placeholderTextColor={Colors.primaryColor}
            {...props}
            ref={ref}
            secureTextEntry={props.secureTextEntry ? hidePassword : false}
          />
        </View>

        {props.secureTextEntry && (
          <View style={{ padding: 8 }}>
            <Ionicons
              onPress={_changeIconEye}
              name={iconEye}
              color='#223e4b'
              size={isLarge ? 25 : 20}
            />
          </View>
        )}
      </View>
    );
  }
);

export default TextInput;
