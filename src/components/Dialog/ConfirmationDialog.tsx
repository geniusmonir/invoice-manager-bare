import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Dialog from 'react-native-dialog';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { isLarge } from '../../utils/utils';

const ConfirmationDialog: React.FC<{
  visible: boolean;
  setVisible: (command: boolean) => void;
  submitAns: () => void;
  loading?: boolean;
  message?: string;
}> = ({
  visible,
  setVisible,
  submitAns,
  loading = false,
  message = 'Are you sure you to save changes?',
}) => {
  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = () => {
    submitAns();
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
        <Dialog.Title style={styles.textStyle}>{message}</Dialog.Title>

        <Dialog.Button
          style={styles.textStyle}
          color={Colors.primaryColor}
          label='NO'
          onPress={handleCancel}
        />
        <Dialog.Button
          style={styles.textStyle}
          color={Colors.primaryColor}
          label='YES'
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

export default ConfirmationDialog;
