import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { AllCustomersScreensProps } from '../../../types/mainNavigatorTypes';
import Colors from '../../../constants/Colors';
import FontNames from '../../../constants/FontNames';
import { SearchBar } from '@rneui/themed';
import { Icon } from 'react-native-elements';
import CustomerListView from '../../../components/ListView/CustomerListView';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Customer } from './../../../store/reducer/customer';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import * as _ from 'lodash';
import { isLarge } from '../../../utils/utils';

const AllCustomersScreen: React.FC<AllCustomersScreensProps> = ({
  route,
  navigation,
}: AllCustomersScreensProps) => {
  const { customers } = useSelector((state: RootState) => state.customer);

  const [search, setSearch] = useState('');

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
          SEARCH CUSTOMER AND MANAGE THEM
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
          <CustomerListView
            customers={filteredCustomers}
            isView={true}
            addCustomer={(customer: Customer) => {}}
            viewSingle={(customer: Customer) => {
              navigation.navigate('ViewSingleCustomer', customer);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export const screenOptions = (navigator: AllCustomersScreensProps) => {
  return {
    headerTitle: 'All Customers Screen',
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

  dcontainer: {
    backgroundColor: Colors.xplight,
    borderRadius: 4,
    borderBottomEndRadius: 30,
    borderTopStartRadius: 30,
  },
  dropdown: {
    height: isLarge ? 50 : 39,

    borderRadius: 4,
    borderBottomEndRadius: 30,
    borderTopStartRadius: 30,
    paddingHorizontal: 8,
    backgroundColor: Colors.xplight,
    fontFamily: FontNames.MyriadProRegular,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: Colors.xplight,
    fontFamily: FontNames.MyriadProRegular,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: isLarge ? 20 : 15,
    color: Colors.primaryColor,
  },
  placeholderStyle: {
    fontSize: isLarge ? 20 : 15,
    fontFamily: FontNames.MyriadProRegular,
    color: Colors.primaryColor,
  },
  selectedTextStyle: {
    fontSize: isLarge ? 20 : 15,
    color: Colors.primaryColor,
    fontFamily: FontNames.MyriadProRegular,
  },
  iconStyle: {
    width: isLarge ? 20 : 15,
    height: isLarge ? 20 : 15,
  },
});
export default AllCustomersScreen;
