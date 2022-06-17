import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Dialog from 'react-native-dialog';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { isLarge } from '../../utils/utils';

const VerifyAdminDialog: React.FC<{
  visible: boolean;
  setVisible: (command: boolean) => void;
  submitPassword: (password: string) => void;
  loading?: boolean;
}> = ({ visible, setVisible, submitPassword, loading = false }) => {
  const [password, setPassword] = React.useState('');

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = () => {
    submitPassword(password);
  };

  return (
    <View>
      <Dialog.Container
        visible={visible}
        contentStyle={{
          width: 400,
          borderBottomEndRadius: 30,
          borderTopStartRadius: 30,
        }}
        onBackdropPress={handleCancel}>
        <Dialog.Title style={styles.textStyle}>
          {loading ? 'Please wait....' : 'Please Verify admin password'}
        </Dialog.Title>

        <Dialog.Input
          underlineColorAndroid={Colors.primaryColor}
          style={{
            width: '100%',
            maxWidth: isLarge ? 200 : 155,
            ...styles.textStyle,
          }}
          placeholder='Admin password'
          secureTextEntry
          onChangeText={(text) => setPassword(text)}></Dialog.Input>

        <Dialog.Button
          style={styles.textStyle}
          color={Colors.primaryColor}
          label='Cancel'
          onPress={handleCancel}
        />
        <Dialog.Button
          style={styles.textStyle}
          color={Colors.primaryColor}
          label='Submit'
          onPress={handleSubmit}
        />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 20 : 15,
  },
});

export default VerifyAdminDialog;
