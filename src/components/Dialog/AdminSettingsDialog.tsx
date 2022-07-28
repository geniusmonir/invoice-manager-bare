import React, { useState } from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import Dialog from 'react-native-dialog';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { Button, Divider } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AddCategoryDialog from './AddCategoryDialog';
import { addCategory, deleteCategory } from '../../store/reducer/category';
import { getCategoryStr, setCategoryStr } from '../../utils/functions';
import { deleteAllInvoices, importInvoice } from '../../store/reducer/invoice';
import { isLarge } from '../../utils/utils';
import { Dirs, FileSystem as RNFAFileSystem } from 'react-native-file-access';
import ConfirmationDialog from './ConfirmationDialog';

const AdminSettingsDialog: React.FC<{
  visible: boolean;
  setVisible: (command: boolean) => void;
}> = ({ visible, setVisible }) => {
  const dispatch = useDispatch();

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isCatVisible, setIsCatVisible] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefresh, setIsRefresh] = useState(0);

  const { owner_name } = useSelector((state: RootState) => state.settings);
  const { invoices } = useSelector((state: RootState) => state.invoice);

  const handleCancel = () => {
    setVisible(false);
  };

  // Checks if gif directory exists. If not, creates it
  const ensureDirExists = async (backupDir: string) => {
    const dirInfo = await FileSystem.getInfoAsync(backupDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(backupDir, {
        intermediates: true,
      });
    }
  };

  const saveToPhone = async (owner_name: string) => {
    const fileName = `invoices_backup_${moment().format('DD-MM-YYYY')}`;
    const backupDir = FileSystem.cacheDirectory + 'InvoiceManager';
    const backupDirFile = `${backupDir}/${fileName}.json`;

    await ensureDirExists(backupDir);

    const allInvoices = invoices.filter(
      (inv) => Object.values(inv)[0].length !== 0
    );

    await FileSystem.writeAsStringAsync(
      backupDirFile,
      JSON.stringify(allInvoices),
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );

    const permission = await MediaLibrary.requestPermissionsAsync();

    if (permission.granted) {
      try {
        await RNFAFileSystem.cpExternal(
          backupDirFile,
          `${fileName}.json`,
          'downloads'
        );
        Alert.alert(`Congratulations ${owner_name}! \nExport Success!.`);
      } catch (error) {
        Alert.alert('Unknown Error Occured!');
      }
    } else {
      Alert.alert('Need Storage permission to export JSON file');
    }
  };

  const importFromPhone = async (owner_name: string) => {
    const pickerResult = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (pickerResult.type === 'success') {
      const jsonInvoices = await FileSystem.readAsStringAsync(pickerResult.uri);
      const invoices = JSON.parse(jsonInvoices);

      try {
        if (!invoices[0][Object.keys(invoices[0])[0]][0].invoiceNumber) {
          Alert.alert('Double check the JSON file for Invoice');
          return;
        }

        dispatch(importInvoice({ invoices }));

        Alert.alert(`Congratulations ${owner_name}! \nImport Success!`);
      } catch (error) {
        Alert.alert('Double check the JSON file for Invoice');
      }
    } else {
      Alert.alert('You have to pick JSON file to import Invoices');
    }
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
          }}>
          <Text
            style={{
              ...styles.textStyle,
              fontSize: isLarge ? 25 : 18,
              fontFamily: FontNames.MyriadProBold,
              letterSpacing: 3,
              marginBottom: isLarge ? 30 : 24,
            }}>
            MANAGE INVOICES / MORE
          </Text>
        </Dialog.Title>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            marginBottom: isLarge ? 30 : 24,
          }}>
          <Button
            icon='zip-box'
            mode='contained'
            style={{
              borderBottomEndRadius: isLarge ? 15 : 10,
              borderTopStartRadius: isLarge ? 15 : 10,
            }}
            loading={isExporting}
            labelStyle={{
              fontFamily: FontNames.MyriadProRegular,
              fontSize: isLarge ? 20 : 15,
              color: Colors.accentColor,
            }}
            color={Colors.xalight}
            onPress={async () => {
              setIsExporting(true);
              await saveToPhone(owner_name);
              setTimeout(() => {
                setIsExporting(false);
              }, 500);
            }}>
            EXPORT INVOICES
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
            onPress={async () => {
              setIsImporting(true);
              await importFromPhone(owner_name);
              setTimeout(() => {
                setIsImporting(false);
              }, 500);
            }}>
            IMPORT INVOICES
          </Button>
        </View>

        <View
          style={{
            marginBottom: isLarge ? 30 : 24,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
          }}>
          <Button
            icon='delete-forever'
            style={{
              borderBottomEndRadius: isLarge ? 15 : 10,
              borderTopStartRadius: isLarge ? 15 : 10,
            }}
            mode='contained'
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
            DELETE INVOICES
          </Button>

          <Button
            icon='plus-circle-multiple-outline'
            style={{
              borderBottomEndRadius: isLarge ? 15 : 10,
              borderTopStartRadius: isLarge ? 15 : 10,
            }}
            mode='contained'
            labelStyle={{
              fontFamily: FontNames.MyriadProRegular,
              fontSize: isLarge ? 20 : 15,
              color: Colors.tertiaryColor,
            }}
            loading={isDeleting}
            color={Colors.xqlight}
            onPress={() => {
              setIsCatVisible(true);
            }}>
            ADD CATEGORY
          </Button>
        </View>

        <Dialog.Button
          style={styles.textStyle}
          color={Colors.accentColor}
          label='Cancel'
          onPress={handleCancel}
        />
        <AddCategoryDialog
          refresh={isRefresh}
          visible={isCatVisible}
          setVisible={setIsCatVisible}
          submitCategory={(category: string) => {
            const newCat = setCategoryStr(category);
            dispatch(addCategory({ name: newCat }));
            setIsRefresh((prev) => prev + 1);
            Alert.alert(
              `Successfully added ${getCategoryStr(category)} to the list.`
            );
          }}
          deleteCategory={(category: string) => {
            dispatch(deleteCategory({ name: category }));
            setIsRefresh((prev) => prev - 1);
            Alert.alert(
              `Successfully deleted ${getCategoryStr(category)} from the list.`
            );
          }}
        />
      </Dialog.Container>

      <ConfirmationDialog
        setVisible={setIsDialogVisible}
        visible={isDialogVisible}
        submitAns={() => {
          setIsDeleting(true);
          setTimeout(() => {
            setIsDeleting(false);
            dispatch(deleteAllInvoices());
            Alert.alert(
              `Hey ${owner_name}, You have successfully deleted all invoices.`
            );
            setIsDialogVisible(false);
          }, 500);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 20 : 15,
  },
});

export default AdminSettingsDialog;
