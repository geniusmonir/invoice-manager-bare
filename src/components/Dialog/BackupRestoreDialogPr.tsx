import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import Dialog from 'react-native-dialog';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { Button } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { isLarge } from '../../utils/utils';
import ConfirmationDialog from './ConfirmationDialog';

const BackupRestoreDialogPr: React.FC<{
  visible: boolean;
  setVisible: (command: boolean) => void;
  handleExport: (owner_name: string) => void;
  handleImport: (owner_name: string) => void;
  handleDelete: (owner_name: string) => void;
  title: string;
}> = ({
  visible,
  setVisible,
  title,
  handleExport,
  handleDelete,
  handleImport,
}) => {
  const dispatch = useDispatch();
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const { owner_name } = useSelector((state: RootState) => state.settings);

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <View>
      <Dialog.Container
        contentStyle={{
          width: 520,
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomEndRadius: 30,
          borderTopStartRadius: 30,
        }}
        visible={visible}
        onBackdropPress={handleCancel}>
        <Dialog.Title
          style={{
            ...styles.textStyle,
            fontSize: isLarge ? 25 : 18,
            fontFamily: FontNames.MyriadProBold,
            letterSpacing: 3,
            marginBottom: isLarge ? 30 : 24,
            textTransform: 'uppercase',
          }}>
          {`MANAGE ${title}`}
        </Dialog.Title>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            marginBottom: isLarge ? 30 : 24,
          }}>
          <Button
            icon='code-json'
            style={{
              borderBottomEndRadius: isLarge ? 15 : 10,
              borderTopStartRadius: isLarge ? 15 : 10,
            }}
            mode='contained'
            loading={isExporting}
            labelStyle={{
              fontFamily: FontNames.MyriadProRegular,
              fontSize: isLarge ? 20 : 15,
              color: Colors.accentColor,
            }}
            color={Colors.xalight}
            onPress={() => {
              setIsExporting(true);
              setTimeout(() => {
                setIsExporting(false);
                handleExport(owner_name);
              }, 500);
            }}>
            EXPORT PRODUCT
          </Button>

          <Button
            icon='code-json'
            mode='contained'
            style={{
              borderBottomEndRadius: isLarge ? 15 : 10,
              borderTopStartRadius: isLarge ? 15 : 10,
            }}
            labelStyle={{
              fontFamily: FontNames.MyriadProRegular,
              fontSize: isLarge ? 20 : 15,
              color: Colors.tertiaryColor,
            }}
            color={Colors.xtlight}
            loading={isImporting}
            onPress={() => {
              setIsImporting(true);
              setTimeout(() => {
                setIsImporting(false);
                handleImport(owner_name);
              }, 500);
            }}>
            IMPORT PRODUCT
          </Button>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Button
            icon='delete-forever'
            mode='contained'
            style={{
              borderBottomEndRadius: isLarge ? 15 : 10,
              borderTopStartRadius: isLarge ? 15 : 10,
            }}
            labelStyle={{
              fontFamily: FontNames.MyriadProRegular,
              fontSize: isLarge ? 20 : 15,
              color: Colors.primaryColor,
            }}
            loading={isDeleting}
            color={Colors.xplight}
            onPress={() => {
              setIsDialogVisible(true);
            }}>
            DELETE ALL PRODUCTS
          </Button>
        </View>

        <Dialog.Button
          style={styles.textStyle}
          color={Colors.accentColor}
          label='Cancel'
          onPress={handleCancel}
        />

        <ConfirmationDialog
          setVisible={setIsDialogVisible}
          visible={isDialogVisible}
          submitAns={() => {
            setIsDeleting(true);
            setTimeout(() => {
              setIsDeleting(false);
              handleDelete(owner_name);
              setIsDialogVisible(false);
            }, 500);
          }}
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

export default BackupRestoreDialogPr;
