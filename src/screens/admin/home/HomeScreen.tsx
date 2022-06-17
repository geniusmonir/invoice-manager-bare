import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { HomeScreensProps } from '../../../types/mainNavigatorTypes';
import Colors from '../../../constants/Colors';
import CardButton from '../../../components/Buttons/CardButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import * as _ from 'lodash';
import moment from 'moment';
import { addCart, CartItem } from '../../../store/reducer/cart';
import { Invoice } from '../../../store/reducer/invoice';
import { isLarge } from '../../../utils/utils';
import { CommonActions } from '@react-navigation/native';

const HomeScreen: React.FC<HomeScreensProps> = ({
  route,
  navigation,
}: HomeScreensProps) => {
  const { logo, hideFromInvoice } = useSelector(
    (state: RootState) => state.settings
  );

  const dispatch = useDispatch();

  const { products } = useSelector((state: RootState) => state.product);
  const { customers } = useSelector((state: RootState) => state.customer);
  const { invoices } = useSelector((state: RootState) => state.invoice);
  const itemInCart = _.filter(products, (p) => {
    const qty = p.quantity || 0;
    return qty > 0;
  });

  let invoicesArr: Invoice[] = [];

  invoices.forEach((el) => {
    const singleBusinessInvoices = Object.values(el).flat();
    invoicesArr.push(...singleBusinessInvoices);
  });

  const cartItems: CartItem[] = _.map(itemInCart, (i) => {
    const _id = Math.random().toString(36).substring(2);
    const createdAt = moment().format();

    const cartItem: CartItem = {
      _id,
      createdAt,
      discount: i.discount || 0,
      inStock: i.inStock,
      itemId: i._id,
      itemTotal: i.itemTotal || 0,
      quantity: i.quantity || 0,
      name: i.name,
      unitPrice: i.unitPrice,
    };

    return cartItem;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        {logo && !hideFromInvoice ? (
          <Image
            style={styles.logo}
            source={{ uri: `data:image/jpeg;base64,${logo}` }}
          />
        ) : (
          <Image
            style={styles.logo}
            source={require('../../../../assets/images/demo.png')}
          />
        )}
      </View>

      <View style={{ marginBottom: isLarge ? 100 : 50 }}>
        <View style={{ flexDirection: 'row' }}>
          <CardButton
            onPress={() => {
              navigation.getParent()?.navigate('ProductsDr');
            }}
            width={isLarge ? 300 : 230}
            height={isLarge ? 300 : 230}
            bgColor={Colors.xplight}
            text={'PRODUCT -> ORDER'}
            itemCount={products.length || 0}
            icon={'layers-outline'}
            color={Colors.primaryColor}
          />

          <CardButton
            onPress={() => {
              navigation.getParent()?.navigate('CustomersDr');
            }}
            width={isLarge ? 300 : 230}
            itemCount={customers.length || 0}
            icon={'people-outline'}
            height={isLarge ? 300 : 230}
            bgColor={Colors.xalight}
            text={'MANAGE CUSTOMER'}
            color={Colors.accentColor}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <CardButton
            onPress={() => {
              if (cartItems.length === 0) {
                Alert.alert('Please add item to the cart first.');
                return;
              }
              dispatch(addCart({ cart: cartItems }));
              navigation.getParent()?.navigate('CartDr');
            }}
            width={isLarge ? 300 : 230}
            itemCount={itemInCart.length || 0}
            icon={'cart-outline'}
            height={isLarge ? 300 : 230}
            bgColor={Colors.xslight}
            text={'MANAGE CART'}
            color={Colors.secondaryColor}
          />
          <CardButton
            onPress={() => {
              navigation.getParent()?.navigate('InvoicesDr');
            }}
            itemCount={invoicesArr.length || 0}
            width={isLarge ? 300 : 230}
            icon={'document-outline'}
            height={isLarge ? 300 : 230}
            bgColor={Colors.xqlight}
            text={'MANAGE INVOICE'}
            color={Colors.quaternaryColor}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export const screenOptions = (navigator: HomeScreensProps) => {
  return {
    headerTitle: 'Home Action Screen',
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyBackgroundColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: isLarge ? 200 : 155,
    height: isLarge ? 200 : 155,
    borderRadius: 100,
    borderColor: Colors.xplight,
    borderWidth: 5,
  },
});

export default HomeScreen;
