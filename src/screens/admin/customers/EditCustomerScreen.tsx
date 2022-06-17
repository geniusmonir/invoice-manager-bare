import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { EditCustomerScreensProps } from '../../../types/mainNavigatorTypes';
import Colors from '../../../constants/Colors';
import FontNames from '../../../constants/FontNames';
import { SearchBar } from '@rneui/themed';
import { Icon } from 'react-native-elements';
import EditCustomerListView from '../../../components/ListView/EditCustomerListView';
import { RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Customer, deleteCustomer } from '../../../store/reducer/customer';
import ConfirmationDialog from '../../../components/Dialog/ConfirmationDialog';
import moment from 'moment';
import * as _ from 'lodash';
import { isLarge } from '../../../utils/utils';

const EditCustomerScreen: React.FC<EditCustomerScreensProps> = ({
  route,
  navigation,
}: EditCustomerScreensProps) => {
  const { customers } = useSelector((state: RootState) => state.customer);
  const [search, setSearch] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const dispatch = useDispatch();

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  let searchedCustomerArr = customers.filter((p) => {
    const regExp = new RegExp(`(${search})\\w*`, 'gi');
    if (p.business_name.match(regExp)) {
      return true;
    } else {
      return false;
    }
  });

  const filteredCustomers = _.orderBy(
    searchedCustomerArr,
    function (p) {
      return moment(p.createdAt).format('YYYYMMDD');
    },
    ['desc']
  );

  return (
    <View style={styles.container}>
      <View style={styles.settingsHeaderWrapper}>
        <Text style={styles.settingsHeader}>
          SEARCH CUSTOMER AND EDIT THIER ACCOUNT
        </Text>
      </View>

      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          marginVertical: isLarge ? 20 : 15,
        }}>
        <SearchBar
          lightTheme={true}
          inputContainerStyle={{ backgroundColor: Colors.xplight }}
          containerStyle={{
            width: isLarge ? 500 : 400,
            height: isLarge ? 50 : 40,
            padding: 0,
            borderRadius: 4,
            borderBottomEndRadius: isLarge ? 30 : 20,
            borderTopStartRadius: isLarge ? 30 : 20,
            overflow: 'hidden',
            marginRight: isLarge ? 20 : 15,
          }}
          searchIcon={
            <Icon
              tvParallaxProperties={Icon}
              name='magnify'
              size={isLarge ? 25 : 18}
              containerStyle={{ marginTop: isLarge ? 0 : -10 }}
              color={Colors.primaryColor}
              type='material-community'
              onPress={() => {
                console.log('ADD SUBMIT');
              }}
            />
          }
          clearIcon={
            <Icon
              tvParallaxProperties={Icon}
              name='close'
              size={isLarge ? 25 : 18}
              containerStyle={{ marginTop: isLarge ? 0 : -10 }}
              color={Colors.primaryColor}
              type='material-community'
              onPress={() => {
                updateSearch('');
              }}
            />
          }
          placeholderTextColor={Colors.primaryColor}
          inputStyle={{
            padding: isLarge ? 10 : 7,
            fontFamily: FontNames.MyriadProRegular,
            fontSize: isLarge ? 20 : 15,
            color: Colors.primaryColor,
            marginTop: isLarge ? 0 : -10,
          }}
          style={{
            backgroundColor: Colors.xplight,
          }}
          placeholder='Search by customer ...'
          onChangeText={updateSearch}
          value={search}
        />
      </View>
      <ScrollView style={{ width: '100%' }}>
        <View style={{ padding: 20, width: '100%' }}>
          <EditCustomerListView
            customers={filteredCustomers}
            deleteCustomer={(customer: Customer) => {
              setIsDialogVisible(true);
              setCustomerId(customer._id);
            }}
            editCustomer={(customer: Customer) => {
              navigation.navigate('EditSingleCustomer', customer);
            }}
          />
        </View>
      </ScrollView>

      <ConfirmationDialog
        setVisible={setIsDialogVisible}
        visible={isDialogVisible}
        submitAns={() => {
          dispatch(deleteCustomer({ _id: customerId }));
          Alert.alert('Business deleted!');
          setIsDialogVisible(false);
        }}
      />
    </View>
  );
};

export const screenOptions = (navigator: EditCustomerScreensProps) => {
  return {
    headerTitle: 'Edit Customer Screen',
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyBackgroundColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  settingsHeaderWrapper: {
    marginBottom: isLarge ? 10 : 7,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: isLarge ? 20 : 15,
  },
  settingsHeader: {
    fontFamily: FontNames.MyriadProBold,
    fontSize: isLarge ? 25 : 18,
    color: Colors.primaryColor,
    textTransform: 'uppercase',
  },
});
export default EditCustomerScreen;
