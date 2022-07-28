import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput as RNTextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Text } from '@rneui/themed';
import { AllProductsScreensProps } from '../../../types/mainNavigatorTypes';
import Colors from '../../../constants/Colors';
import ProductListView from './../../../components/ListView/ProductListView';
import FontNames from '../../../constants/FontNames';
import { FAB } from 'react-native-paper';
import { SearchBar } from '@rneui/themed';
import { Icon } from 'react-native-elements';

import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { capitalizeFirstWord } from '../../../utils/functions';
import {
  clearProductFromCart,
  Product,
  updateProductForCart,
} from '../../../store/reducer/product';
import * as _ from 'lodash';
import { addCart, CartItem } from './../../../store/reducer/cart';
import moment from 'moment';
import ImageView from 'react-native-image-viewing';
import { isLarge } from '../../../utils/utils';

const AllProductScreen: React.FC<AllProductsScreensProps> = ({
  route,
  navigation,
}: AllProductsScreensProps) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.product);
  const { categories } = useSelector((state: RootState) => state.category);
  const [search, setSearch] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [category, setCategory] = useState('');
  const [visible, setIsVisible] = useState(false);
  const [productImage, setProductImage] = useState('');

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  const itemInCart = _.filter(products, (p) => {
    const qty = p.quantity || 0;
    return qty > 0;
  });

  const cartItems: CartItem[] = _.map(itemInCart, (i) => {
    const _id = Math.random().toString(36).substring(2);
    const createdAt = moment().format();

    const cartItem: CartItem = {
      _id,
      createdAt,
      inStock: i.inStock,
      itemId: i._id,
      itemTotal: i.itemTotal || 0,
      quantity: i.quantity || 0,
      name: i.name,
      unitPrice: i.unitPrice,
    };

    return cartItem;
  });

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
    if (p.name.match(regExp) && p.isShown && p.inStock > 0) {
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
        <Text style={styles.settingsHeader}>
          SEARCH PRODUCT AND ADD TO CART
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

      <ScrollView style={{ width: '100%' }}>
        <View style={{ padding: isLarge ? 20 : 15, width: '100%' }}>
          <ProductListView
            viewImage={(base64: string) => {
              setProductImage(base64);
              setTimeout(() => {
                setIsVisible(true);
              }, 200);
            }}
            updateProductForCart={(
              _id: string,
              dir: 'up' | 'down' | 'change',
              qty: number
            ) => {
              dispatch(updateProductForCart({ _id, dir, qty }));
            }}
            products={filteredProduct}
          />
        </View>
      </ScrollView>

      <ImageView
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />

      <FAB
        style={styles.fab}
        color={Colors.accentColor}
        small={isLarge ? false : true}
        icon='cart-arrow-down'
        onPress={() => {
          if (cartItems.length === 0) {
            Alert.alert('Please add item to the cart first.');
            return;
          }

          dispatch(addCart({ cart: cartItems }));
          navigation.getParent()?.navigate('CartDr');
        }}
      />
      <FAB
        style={styles.fab2}
        color={Colors.accentColor}
        small
        icon={() => (
          <Text
            style={{
              fontFamily: FontNames.MyriadProRegular,
              fontSize: isLarge ? 20 : 15,
              marginLeft: 7,
              color: Colors.accentColor,
            }}>
            {itemInCart.length}
          </Text>
        )}
        onPress={() => {
          if (cartItems.length === 0) {
            Alert.alert('Please add item to the cart first.');
            return;
          }
          dispatch(addCart({ cart: cartItems }));
          navigation.getParent()?.navigate('CartDr');
        }}
      />

      <FAB
        style={styles.fab3}
        small={isLarge ? false : true}
        color={Colors.redColor}
        icon='cart-remove'
        onPress={() => {
          setCategory('');
          setSearch('');
          dispatch(clearProductFromCart());
        }}
      />
    </View>
  );
};

export const screenOptions = (navigator: AllProductsScreensProps) => {
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
    marginBottom: 10,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.xalight,
  },
  fab2: {
    position: 'absolute',
    marginRight: isLarge ? 10 : 5,
    right: 0,
    bottom: isLarge ? 65 : 45,
    backgroundColor: Colors.xalight,
  },

  fab3: {
    position: 'absolute',
    marginRight: 10,
    left: 0,
    bottom: 0,
    margin: 16,
    backgroundColor: Colors.xalight,
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
});
export default AllProductScreen;
