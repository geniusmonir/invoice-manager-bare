import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';
import { deviceHeight, deviceWidth, isLarge } from '../../utils/utils';
import { Text, View } from 'react-native';
import CloseModalButton from '../Buttons/CloseModalButton';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import FontNames from '../../constants/FontNames';
import { Button } from '@rneui/themed';

const InfoModal: React.FC<{
  onPress: () => any;
  isVisible: boolean;
  message?: string;
}> = ({ onPress, isVisible, message = 'Some unknown error Occured.' }) => {
  return (
    <Modal
      testID={'modal'}
      isVisible={isVisible}
      backdropColor={Colors.dark}
      deviceHeight={deviceHeight}
      deviceWidth={deviceWidth}
      backdropOpacity={0.8}
      animationIn='zoomInDown'
      animationOut='zoomOutUp'
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 4,
          padding: isLarge ? 10 : 7,
          borderBottomEndRadius: 30,
          borderTopStartRadius: 30,
        }}>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: FontNames.MyriadProRegular,
              textAlign: 'center',
              padding: isLarge ? 20 : 15,
              fontSize: isLarge ? 20 : 15,
              color: Colors.greyTextColorB70,
            }}>
            {message}
          </Text>
        </View>
        <Button
          onPress={onPress}
          title='CLOSE'
          buttonStyle={{
            backgroundColor: Colors.xplight,
            borderRadius: 4,
            justifyContent: 'center',
            height: isLarge ? 45 : 35,
            borderBottomEndRadius: 15,
            borderTopStartRadius: 15,
          }}
          titleStyle={{
            fontFamily: FontNames.FuturaBook,
            fontSize: isLarge ? 20 : 15,
            paddingHorizontal: isLarge ? 10 : 7,
            color: Colors.primaryColor,
          }}
          containerStyle={{
            paddingTop: isLarge ? 20 : 15,
            width: isLarge ? 100 : 78,
            alignSelf: 'center',
          }}
        />
      </View>
    </Modal>
  );
};

export default InfoModal;
