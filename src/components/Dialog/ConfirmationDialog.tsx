import React, { useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import Dialog from 'react-native-dialog';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { isLarge } from '../../utils/utils';

const ConfirmationDialog: React.FC<{
  visible: boolean;
  setVisible: (command: boolean) => void;
  submitAns: () => void;
  loading?: boolean;
}> = ({ visible, setVisible, submitAns, loading = false }) => {
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
        <Dialog.Title style={styles.textStyle}>
          <Text style={styles.textStyle}>Are you sure?</Text>
        </Dialog.Title>

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
