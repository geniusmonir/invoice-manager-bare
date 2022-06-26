import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { Product } from '../../store/reducer/product';
import * as _ from 'lodash';
import { isLarge } from '../../utils/utils';

const ProductListView: React.FC<{
  products: Product[];
  viewImage: (base64: string) => void;
  updateProductForCart: (
    _id: string,
    dir: 'up' | 'down' | 'change',
    qty: number
  ) => void;
}> = ({ products, updateProductForCart, viewImage }) => {
  return (
    <View style={styles.mainbox}>
      {products.length === 0 && (
        <Text
          style={{
            fontFamily: FontNames.MyriadProRegular,
            fontSize: isLarge ? 20 : 15,
            textAlign: 'center',
            color: Colors.primaryColor,
          }}>
          Oops! No product found
        </Text>
      )}
      {products.map((l: Product) => {
        return (
          <ListItem
            onPress={() => {
              viewImage(l.image);
            }}
            containerStyle={{
              borderRadius: 4,
              borderBottomEndRadius: 30,
              borderTopStartRadius: 30,
              backgroundColor: Colors.xplight,
              shadowColor: Colors.white,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0,
              shadowRadius: 4.65,
              elevation: 8,
            }}
            underlayColor={Colors.greyBackgroundColor}
            key={l._id}
            style={{
              marginVertical: 5,
              borderRadius: 4,
            }}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${l.image}` }}
              height={isLarge ? 150 : 117}
              width={isLarge ? 150 : 117}
              style={{
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.primaryColor,
                borderRadius: 4,
                height: isLarge ? 150 : 117,
                width: isLarge ? 150 : 117,
                borderTopLeftRadius: 20,
              }}
            />

            <ListItem.Content
              style={{
                borderRightWidth: 1,
                borderRightColor: Colors.primaryColor,
              }}>
              <ListItem.Title
                style={{
                  fontFamily: FontNames.MyriadProRegular,
                  color: Colors.primaryColor,
                  fontSize: isLarge ? 25 : 17,
                  marginBottom: isLarge ? 10 : 7,
                  textTransform: 'uppercase',
                }}>
                {l.name}
              </ListItem.Title>
              <ListItem.Subtitle
                style={{
                  fontFamily: FontNames.MyriadProRegular,
                  color: Colors.primaryColor,
                  fontSize: isLarge ? 20 : 15,
                  width: '100%',
                }}>
                CATEGORY:{' '}
                <Text style={{ fontFamily: FontNames.MyriadProBold }}>
                  {l.category.toUpperCase()}
                </Text>{' '}
              </ListItem.Subtitle>

              <ListItem.Subtitle
                style={{
                  fontFamily: FontNames.MyriadProRegular,
                  color: Colors.primaryColor,

                  fontSize: isLarge ? 20 : 15,
                  paddingBottom: isLarge ? 10 : 7,
                  width: '100%',
                }}>
                UNIT PRICE:{' '}
                <Text
                  style={{
                    fontFamily: FontNames.MyriadProBold,
                    fontSize: isLarge ? 35 : 25,
                  }}>
                  ${l.unitPrice} {'   '}
                </Text>
                IN STOCK: {l.inStock} {'   '}
              </ListItem.Subtitle>

              <ListItem.Subtitle
                style={{
                  fontFamily: FontNames.MyriadProRegular,
                  marginTop: isLarge ? 10 : 7,
                  color: Colors.primaryColor,
                  fontSize: isLarge ? 20 : 15,
                }}>
                {l.description}
              </ListItem.Subtitle>
            </ListItem.Content>

            <View>
              <Icon
                tvParallaxProperties={Icon}
                name={'plus'}
                size={isLarge ? 35 : 28}
                color={Colors.primaryColor}
                type='material-community'
                onPress={() => {
                  if (l.quantity && l.quantity >= l.inStock) {
                    Alert.alert('You are out of stock.');
                    return;
                  }
                  updateProductForCart(l._id, 'up', l.quantity || 0);
                }}
              />

              <View
                style={{
                  marginVertical: isLarge ? 30 : 24,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <TextInput
                  onChangeText={(tQty: string) => {
                    if (+tQty > l.inStock) {
                      updateProductForCart(l._id, 'change', +l.inStock);
                      Alert.alert('You are out of stock.');
                      return;
                    }
                    updateProductForCart(l._id, 'change', +tQty);
                  }}
                  style={{
                    textAlign: 'center',
                    fontFamily: FontNames.MyriadProBold,
                    color: Colors.primaryColor,
                    fontSize: isLarge ? 30 : 24,
                  }}>
                  {l.quantity || 0}
                </TextInput>
              </View>

              <Icon
                tvParallaxProperties={Icon}
                name={'minus'}
                size={isLarge ? 35 : 28}
                color={Colors.primaryColor}
                type='material-community'
                onPress={() => {
                  updateProductForCart(l._id, 'down', l.quantity || 0);
                }}
              />
            </View>
          </ListItem>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textinfo: {
    margin: isLarge ? 10 : 7,
    textAlign: 'center',
    fontSize: isLarge ? 17 : 14,
  },
  mainbox: {
    width: '100%',
    marginTop: 5,
  },
});

export default ProductListView;
