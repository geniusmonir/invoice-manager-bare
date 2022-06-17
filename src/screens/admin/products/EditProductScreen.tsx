import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput as RNTextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Text } from '@rneui/themed';
import { EditProductScreensProps } from '../../../types/mainNavigatorTypes';
import Colors from '../../../constants/Colors';
import FontNames from '../../../constants/FontNames';
import { SearchBar } from '@rneui/themed';
import { Icon } from 'react-native-elements';

import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EditProductListView from './../../../components/ListView/EditProductListView';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { capitalizeFirstWord } from '../../../utils/functions';
import { deleteProduct, Product } from './../../../store/reducer/product';
import ConfirmationDialog from '../../../components/Dialog/ConfirmationDialog';
import { FAB } from 'react-native-paper';
import * as _ from 'lodash';
import moment from 'moment';
import ImageView from 'react-native-image-viewing';
import { isLarge } from '../../../utils/utils';

const EditProductScreen: React.FC<EditProductScreensProps> = ({
  route,
  navigation,
}: EditProductScreensProps) => {
  const { products } = useSelector((state: RootState) => state.product);
  const { categories } = useSelector((state: RootState) => state.category);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [category, setCategory] = useState(''); // default other
  const [visible, setIsVisible] = useState(false);
  const [productImage, setProductImage] = useState('');

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [productId, setProductId] = useState('');
  const dispatch = useDispatch();

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

  // "categories": ["pepsi", "ziyad", "california_garden", "other"]
  const categoryDataArr = categories.map((cat: string) => {
    return {
      label: capitalizeFirstWord(cat),
      value: cat,
    };
  });

  let finalList: Product[] | [] = [];

  let searchedProductsArr = products.filter((p) => {
    const regExp = new RegExp(`(${search})\\w*`, 'gi');
    if (p.name.match(regExp)) {
      return true;
    } else {
      return false;
    }
  });

  if (category) {
    finalList = searchedProductsArr.filter((p) => {
      if (p.category === category) {
        return true;
      } else {
        return false;
      }
    });
  } else {
    finalList = searchedProductsArr;
  }

  const filteredProduct = _.orderBy(
    finalList,
    function (p) {
      return moment(p.createdAt).format('YYYYMMDD');
    },
    ['desc']
  );

  const images = [
    {
      uri: `data:image/jpeg;base64,${productImage}`,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.settingsHeaderWrapper}>
        <Text style={styles.settingsHeader}>SEARCH PRODUCT AND EDIT</Text>
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
            data={categoryDataArr}
            maxHeight={isLarge ? 200 : 155}
            containerStyle={{
              backgroundColor: Colors.white,
              borderRadius: 10,
            }}
            labelField='label'
            valueField='value'
            placeholder={!isFocus ? 'All category' : '...'}
            value={category}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setCategory(item.value);
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
      <View style={{ padding: 20, width: '100%' }}>
        {!show && (
          <Text
            style={{
              fontFamily: FontNames.MyriadProRegular,
              fontSize: 20,
              textAlign: 'center',
              color: Colors.primaryColor,
            }}>
            Please wait...
          </Text>
        )}
        {show && (
          <ScrollView style={{ width: '100%' }}>
            <View style={{ padding: 20, width: '100%' }}>
              <EditProductListView
                viewImage={(base64: string) => {
                  setProductImage(base64);
                  setTimeout(() => {
                    setIsVisible(true);
                  }, 200);
                }}
                products={filteredProduct}
                navigateProduct={(product: Product) => {
                  navigation.navigate('EditSingleProduct', product);
                }}
                deleteProduct={(_id: string) => {
                  setIsDialogVisible(true);
                  setProductId(_id);
                }}
              />
            </View>
          </ScrollView>
        )}
      </View>
      <ImageView
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />

      <ConfirmationDialog
        message='Are you sure about deleting your product?'
        setVisible={setIsDialogVisible}
        visible={isDialogVisible}
        submitAns={() => {
          dispatch(deleteProduct({ _id: productId }));
          Alert.alert('Product deleted!');
          setIsDialogVisible(false);
        }}
      />

      <FAB
        style={styles.fabRefresh}
        icon='refresh'
        loading={loading}
        small={isLarge ? false : true}
        color={Colors.primaryColor}
        onPress={() => {
          setLoading(true);
          setShow(false);
          setRefresh((ref) => ref + 1);
          setCategory('');
          setSearch('');

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

export const screenOptions = (navigator: EditProductScreensProps) => {
  return {
    headerTitle: 'All Product Screen',
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
  fabRefresh: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    color: Colors.primaryColor,
    backgroundColor: Colors.xplight,
  },
});
export default EditProductScreen;
