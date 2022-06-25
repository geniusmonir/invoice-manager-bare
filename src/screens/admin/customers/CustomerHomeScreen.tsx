import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView, Alert } from 'react-native';
import { CustomerHomeScreensProps } from '../../../types/mainNavigatorTypes';
import Colors from '../../../constants/Colors';
import CardButton from '../../../components/Buttons/CardButton';
import BackupRestoreDialog from '../../../components/Dialog/BackupRestoreDialog';
import VerifyAdminDialog from '../../../components/Dialog/VerifyAdminDialog';
import { useSelector, useDispatch } from 'react-redux';
import { adminVerification } from '../../../store/reducer/admin';
import { RootState } from '../../../store/store';
import ErrorModal from '../../../components/Modal/ErrorModal';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import {
  deleteAllCustomer,
  importCustomer,
} from '../../../store/reducer/customer';
import moment from 'moment';
import { isLarge } from '../../../utils/utils';
import { Dirs, FileSystem as RNFAFileSystem } from 'react-native-file-access';

const CustomerHomeScreen: React.FC<CustomerHomeScreensProps> = ({
  route,
  navigation,
}: CustomerHomeScreensProps) => {
  const { password } = useSelector((state: RootState) => state.adminAuth);
  const { customers } = useSelector((state: RootState) => state.customer);

  const [visible, setVisible] = useState(false);
  const [isSubmittingP, setIsSubmittingP] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const dispatch = useDispatch();
  const [errorIsVisible, setErrorIsVisible] = useState(false);

  useEffect(() => {
    dispatch(adminVerification({ verified: isVerified }));
  });

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
    const fileName = `customers_backup_${moment().format('DD-MM-YYYY')}`;
    const backupDir = FileSystem.cacheDirectory + 'InvoiceManager';
    const backupDirFile = `${backupDir}/${fileName}.json`;

    await ensureDirExists(backupDir);

    await FileSystem.writeAsStringAsync(
      backupDirFile,
      JSON.stringify(customers),
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );

    const permission = await MediaLibrary.requestPermissionsAsync();

    if (permission.granted) {
      try {
        await RNFAFileSystem.cpExternal(backupDirFile, fileName, 'downloads');
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
      const jsonCustomer = await FileSystem.readAsStringAsync(pickerResult.uri);
      const customers = JSON.parse(jsonCustomer);

      if (!customers[0].business_name) {
        Alert.alert('Double check the JSON file for Customer');
        return;
      }

      dispatch(importCustomer({ customers }));

      Alert.alert(`Congratulations ${owner_name}! Import Success!`);
    } else {
      Alert.alert('You have to pick JSON file to import Customers');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginBottom: isLarge ? 100 : 0 }}>
        <View style={{ flexDirection: 'row' }}>
          <CardButton
            onPress={() => {
              navigation.navigate('AllCustomers');
            }}
            width={isLarge ? 300 : 230}
            height={isLarge ? 300 : 230}
            bgColor={Colors.xplight}
            text={'ALL CUSTOMERS'}
            icon={'people-outline'}
            color={Colors.primaryColor}
          />

          <CardButton
            onPress={() => {
              navigation.navigate('AddCustomer');
            }}
            width={isLarge ? 300 : 230}
            icon={'add-outline'}
            height={isLarge ? 300 : 230}
            bgColor={Colors.xalight}
            text={'ADD CUSTOMER'}
            color={Colors.accentColor}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <CardButton
            onPress={() => {
              navigation.navigate('EditCustomer');
            }}
            width={isLarge ? 300 : 230}
            icon={'create-outline'}
            height={isLarge ? 300 : 230}
            bgColor={Colors.xslight}
            text={'EDIT CUSTOMER'}
            color={Colors.secondaryColor}
          />
          <CardButton
            onPress={() => {
              setIsDialogVisible(true);
            }}
            width={isLarge ? 300 : 230}
            icon={'sync-outline'}
            height={isLarge ? 300 : 230}
            bgColor={Colors.xqlight}
            text={'BACKUP / RESTORE'}
            color={Colors.quaternaryColor}
          />
        </View>

        <BackupRestoreDialog
          handleDelete={(owner_name: string) => {
            setTimeout(() => {
              dispatch(deleteAllCustomer());
              Alert.alert(`Hey, ${owner_name}! Deletion Success!`);
            }, 600);
          }}
          handleImport={async (owner_name: string) => {
            await importFromPhone(owner_name);
          }}
          handleExport={async (owner_name: string) =>
            await saveToPhone(owner_name)
          }
          visible={visible}
          setVisible={setVisible}
          title={'Customers'}
        />

        <VerifyAdminDialog
          setVisible={() => setIsDialogVisible(false)}
          visible={isDialogVisible}
          loading={isSubmittingP}
          submitPassword={(p: string) => {
            setIsSubmittingP(true);

            if (password === p) {
              dispatch(adminVerification({ verified: true }));
              setIsDialogVisible(false);
              setVisible(true);
              setIsVerified(true);
            } else {
              setErrorIsVisible(true);
            }

            setIsSubmittingP(false);
          }}
        />

        <ErrorModal
          isVisible={errorIsVisible}
          onPress={() => setErrorIsVisible(false)}
          message='Password is not correct'
        />
      </View>
    </SafeAreaView>
  );
};

export const screenOptions = (navigator: CustomerHomeScreensProps) => {
  return {
    headerTitle: 'Customer Home Screen',
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyBackgroundColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default CustomerHomeScreen;
