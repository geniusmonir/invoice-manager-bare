import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, View, Text, TextInput } from 'react-native';
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

  useEffect(() => {
    setPassword('');
  }, []);

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
        <View style={{ marginLeft: 10, marginBottom: 30 }}>
          <Text style={styles.textStyle}>Please Verify admin password</Text>
        </View>

        <View style={{ marginLeft: 10, marginBottom: 20 }}>
          <TextInput
            underlineColorAndroid={Colors.primaryColor}
            style={{
              width: '100%',
              maxWidth: isLarge ? 300 : 200,
              ...styles.textStyle,
              padding: 10,
            }}
            placeholder='Admin password'
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>

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
