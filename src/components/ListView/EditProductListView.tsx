import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { ListItem, Avatar as RNEAvatar } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { isLarge } from '../../utils/utils';
import { Product } from './../../store/reducer/product';

const EditProductListView: React.FC<{
  products: Product[];
  viewImage: (base64: string) => void;
  navigateProduct: (product: Product) => void;
  deleteProduct: (_id: string) => void;
}> = ({ products, navigateProduct, deleteProduct, viewImage }) => {
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
            onPress={() => {}}
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
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                viewImage(l.image);
              }}>
              <Image
                //source={require(`../../../files/amr/pics/honey.jpg`)}
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
            </TouchableOpacity>

            <ListItem.Content
              style={{
                borderRightWidth: 1,
                borderRightColor: Colors.primaryColor,
              }}>
              <ListItem.Title
                style={{
                  fontFamily: FontNames.MyriadProRegular,
                  color: Colors.primaryColor,
                  fontSize: isLarge ? 25 : 18,
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
                    fontSize: isLarge ? 35 : 28,
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
                NOTES: {l.notes}
              </ListItem.Subtitle>
            </ListItem.Content>

            <View>
              <Icon
                tvParallaxProperties={Icon}
                name={'file-edit-outline'}
                size={isLarge ? 35 : 28}
                color={Colors.primaryColor}
                type='material-community'
                onPress={() => navigateProduct(l)}
              />

              <View style={{ marginBottom: isLarge ? 50 : 39 }} />

              <Icon
                tvParallaxProperties={Icon}
                name={'delete-forever-outline'}
                size={isLarge ? 35 : 28}
                color={Colors.redColor}
                type='material-community'
                onPress={() => deleteProduct(l._id)}
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
    margin: 10,
    textAlign: 'center',
    fontSize: isLarge ? 17 : 10,
  },
  mainbox: {
    width: '100%',
    marginTop: 5,
  },
});

export default EditProductListView;
