import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import FontNames from '../../../constants/FontNames';
import { FAB } from 'react-native-paper';
import { SearchBar } from '@rneui/themed';
import { Icon } from 'react-native-elements';
import CustomerListView from '../../../components/ListView/CustomerListView';
import { AllInvoicesScreensProps } from '../../../types/mainNavigatorTypes';
import Colors from '../../../constants/Colors';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import InvoiceListView from '../../../components/ListView/InvoiceListView';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Invoice } from '../../../store/reducer/invoice';
import * as _ from 'lodash';
import moment from 'moment';
import { Product } from '../../../store/reducer/product';
import { isLarge } from '../../../utils/utils';

const AllInvoiceScreen: React.FC<AllInvoicesScreensProps> = ({
  route,
  navigation,
}: AllInvoicesScreensProps) => {
  const [search, setSearch] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [filter, setFilter] = useState(''); // default other
  const [show, setShow] = useState(false);

  const { invoices } = useSelector((state: RootState) => state.invoice);

  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    //code
  }, [refresh]);

  useEffect(() => {
    let timer1 = setTimeout(() => setShow(true), 300);
    return () => {
      clearTimeout(timer1);
    };
  }, []);

  let refreshFix: NodeJS.Timeout;

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  let filterDataArr = [
    { label: 'Paid', value: 'paid' },
    { label: 'Unpaid', value: 'unpaid' },
  ];

  let invoicesArr: Invoice[] = [];

  invoices.forEach((el) => {
    const singleBusinessInvoices = Object.values(el).flat();
    invoicesArr.push(...singleBusinessInvoices);
  });

  let finalList: Invoice[] | [] = [];

  let searchedInvoiceArr = invoicesArr.filter((p) => {
    const regExp = new RegExp(`(${search})\\w*`, 'gi');
    if (p.customer.business_name.match(regExp)) {
      return true;
    } else {
      return false;
    }
  });

  if (filter) {
    finalList = searchedInvoiceArr.filter((p) => {
      if (p.status === filter) {
        return true;
      } else {
        return false;
      }
    });
  } else {
    finalList = searchedInvoiceArr;
  }

  const filteredInvoices = _.orderBy(
    finalList,
    function (p) {
      return moment(p.createdAt).format('YYYYMMDD');
    },
    ['desc']
  );

  return (
    <View style={styles.container}>
      <View style={styles.settingsHeaderWrapper}>
        <Text style={styles.settingsHeader}>
          SEARCH INVOICES FOR A BUSINESS
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
            width: isLarge ? 350 : 280,
            padding: 0,
            height: isLarge ? 50 : 40,
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
              containerStyle={{ marginTop: isLarge ? 0 : -10 }}
              size={isLarge ? 25 : 18}
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
              containerStyle={{ marginTop: isLarge ? 0 : -10 }}
              name='close'
              size={isLarge ? 25 : 18}
              color={Colors.primaryColor}
              type='material-community'
              onPress={() => {
                updateSearch('');
              }}
            />
          }
          placeholderTextColor={Colors.primaryColor}
          inputStyle={{
            padding: isLarge ? 10 : 5,
            fontFamily: FontNames.MyriadProRegular,
            fontSize: isLarge ? 20 : 15,
            color: Colors.primaryColor,
            height: isLarge ? 50 : 40,
            marginTop: isLarge ? 0 : -10,
          }}
          style={{
            backgroundColor: Colors.xplight,
          }}
          placeholder='Search product by name ...'
          onChangeText={updateSearch}
          value={search}
        />

        <View style={styles.dcontainer}>
          <Dropdown
            style={[styles.dropdown, { width: isLarge ? 250 : 195 }]}
            placeholderStyle={{
              ...styles.placeholderStyle,
              color: isFocus
                ? Colors.primaryColor
                : styles.placeholderStyle.color,
            }}
            selectedTextStyle={{
              ...styles.selectedTextStyle,
              color: isFocus
                ? Colors.primaryColor
                : styles.selectedTextStyle.color,
            }}
            activeColor={Colors.xalight}
            iconStyle={styles.iconStyle}
            data={filterDataArr}
            maxHeight={isLarge ? 200 : 155}
            containerStyle={{
              backgroundColor: Colors.white,
              borderRadius: 10,
            }}
            labelField='label'
            valueField='value'
            placeholder={!isFocus ? 'Latest' : '...'}
            value={filter}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setFilter(item.value);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={{ ...styles.icon, marginLeft: 10 }}
                color={isFocus ? Colors.primaryColor : Colors.primaryColor}
                name='Safety'
                size={isLarge ? 25 : 20}
              />
            )}
          />
        </View>
      </View>
      <ScrollView style={{ width: '100%' }}>
        <View style={{ padding: isLarge ? 20 : 15, width: '100%' }}>
          <InvoiceListView
            onItemClick={(invoice: Invoice) => {
              navigation.navigate('SingleInvoice', invoice);
            }}
            onFilterClick={(name: string) => {
              updateSearch(name);
            }}
            invoices={filteredInvoices}
          />
        </View>
      </ScrollView>

      <FAB
        style={styles.fabRefresh}
        icon='refresh'
        loading={loading}
        small={isLarge ? false : true}
        color={Colors.primaryColor}
        onPress={() => {
          setLoading(true);
          setShow(false);
          setSearch('');
          setRefresh((ref) => ref + 1);

          if (refreshFix) {
            clearTimeout(refreshFix);
          }
          refreshFix = setTimeout(() => {
            setLoading(false);
            setShow(true);
          }, 300);
        }}
      />
    </View>
  );
};

export const screenOptions = (navigator: AllInvoicesScreensProps) => {
  return {
    headerTitle: 'All Invoice Screen',
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
    borderBottomEndRadius: isLarge ? 30 : 20,
    borderTopStartRadius: isLarge ? 30 : 20,
  },
  dropdown: {
    height: isLarge ? 50 : 40,

    borderRadius: 4,
    borderBottomEndRadius: isLarge ? 30 : 20,
    borderTopStartRadius: isLarge ? 30 : 20,
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
  fabRefresh: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    color: Colors.primaryColor,
    backgroundColor: Colors.xplight,
  },
});
export default AllInvoiceScreen;
