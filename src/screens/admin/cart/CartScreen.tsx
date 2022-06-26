import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text } from '@rneui/themed';
import { CartScreensProps } from '../../../types/mainNavigatorTypes';
import Colors from '../../../constants/Colors';
import { globalStyles } from '../../../styles/globalStyle';
import FontNames from '../../../constants/FontNames';
import { DataTable } from 'react-native-paper';
import DTHeaderTitle from '../../../components/DataTable/DTHeaderText';
import { FAB } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { RootState } from '../../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCart, updateCart } from '../../../store/reducer/cart';
import { isLarge } from '../../../utils/utils';
import ConfirmationDialog from '../../../components/Dialog/ConfirmationDialog';

const CartScreen: React.FC<CartScreensProps> = ({
  route,
  navigation,
}: CartScreensProps) => {
  const { carts, cartTotal } = useSelector((state: RootState) => state.cart);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [curCartId, setCurCartId] = useState('');

  const dispatch = useDispatch();

  return (
    <View style={{ ...styles.container, width: '100%', paddingTop: 20 }}>
      <View style={styles.settingsHeaderWrapper}>
        <Text style={styles.settingsHeader}>ADJUST/RECHECK CART</Text>
        <Text style={styles.settingsText}>Add customer after revision</Text>
      </View>

      {carts.length === 0 && (
        <Text
          style={{
            fontFamily: FontNames.MyriadProRegular,
            fontSize: 20,
            marginTop: 100,
            textAlign: 'center',
            color: Colors.primaryColor,
          }}>
          Oops! No product added yet
        </Text>
      )}

      {carts.length > 0 && (
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          style={{
            width: '100%',
          }}>
          <View
            style={{
              width: '100%',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <DataTable
              style={{
                backgroundColor: Colors.xplight,
                borderRadius: 4,
                borderBottomEndRadius: 30,
                borderTopStartRadius: 30,
                width: isLarge ? 700 : 550,
              }}>
              <DataTable.Header style={{ paddingHorizontal: 0 }}>
                <DataTable.Title
                  style={{
                    flex: 0.4,
                    ...styles.cellCenter,
                  }}>
                  <DTHeaderTitle title='  ' />
                </DataTable.Title>
                <DataTable.Title style={{ flex: 2 }}>
                  <DTHeaderTitle title='Product' />
                </DataTable.Title>

                <DataTable.Title
                  numeric
                  style={{
                    flex: 1,
                    ...styles.cellCenter,
                  }}>
                  <DTHeaderTitle title='QTY' />
                </DataTable.Title>

                <DataTable.Title
                  numeric
                  style={{
                    flex: 1,
                    ...styles.cellCenter,
                  }}>
                  <DTHeaderTitle title='Price' />
                </DataTable.Title>

                <DataTable.Title
                  numeric
                  style={{
                    flex: 1,
                    ...styles.cellCenter,
                  }}>
                  <DTHeaderTitle title='Total' />
                </DataTable.Title>

                <DataTable.Title
                  numeric
                  style={{
                    flex: 0.4,
                    ...styles.cellCenter,
                  }}>
                  <DTHeaderTitle title='X' />
                </DataTable.Title>
              </DataTable.Header>

              {carts.map((c, i) => {
                return (
                  <View key={c._id}>
                    <DataTable.Row
                      key={c._id}
                      style={{
                        height: isLarge ? 60 : 47,
                        paddingHorizontal: 0,
                      }}>
                      <DataTable.Cell
                        textStyle={styles.cellTextStyle}
                        style={{
                          flex: 0.4,
                          ...styles.cellCenter,
                        }}
                        centered>
                        {i + 1}.
                      </DataTable.Cell>

                      <View style={{ flex: 2, justifyContent: 'center' }}>
                        <Text style={styles.cellTextStyle} numberOfLines={2}>
                          {c.name}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          ...styles.cellCenter,
                          flexDirection: 'row',
                        }}>
                        <View>
                          <Icon
                            tvParallaxProperties={Icon}
                            name={'minus'}
                            size={isLarge ? 25 : 18}
                            color={Colors.primaryColor}
                            type='material-community'
                            onPress={() => {
                              if (c.itemTotal <= 0) {
                                dispatch(
                                  updateCart({
                                    _id: c._id,
                                    dir: 'up',
                                    qty: c.quantity || 0,
                                  })
                                );
                                Alert.alert(
                                  'You can not decrease the quantity'
                                );

                                return;
                              }
                              dispatch(
                                updateCart({
                                  _id: c._id,
                                  dir: 'down',
                                  qty: c.quantity || 0,
                                })
                              );
                            }}
                          />
                        </View>

                        <View
                          style={{
                            justifyContent: 'center',
                            alignContent: 'center',
                          }}>
                          <TextInput
                            keyboardType='numeric'
                            onChangeText={(tQty: string) => {
                              if (+tQty > c.inStock) {
                                dispatch(
                                  updateCart({
                                    _id: c._id,
                                    dir: 'change',
                                    qty: +c.inStock,
                                  })
                                );
                                Alert.alert('You are out of stock.');
                                return;
                              }
                              dispatch(
                                updateCart({
                                  _id: c._id,
                                  dir: 'change',
                                  qty: +tQty,
                                })
                              );
                            }}
                            style={{
                              textAlign: 'center',
                              fontFamily: FontNames.MyriadProBold,
                              color: Colors.primaryColor,
                              fontSize: isLarge ? 20 : 15,
                              marginHorizontal: 5,
                            }}>
                            {c.quantity}
                          </TextInput>
                        </View>

                        <View>
                          <Icon
                            tvParallaxProperties={Icon}
                            name={'plus'}
                            size={isLarge ? 25 : 18}
                            color={Colors.primaryColor}
                            type='material-community'
                            onPress={() => {
                              if (c.quantity && c.quantity >= c.inStock) {
                                Alert.alert('You are out of stock.');
                                return;
                              }

                              dispatch(
                                updateCart({
                                  _id: c._id,
                                  dir: 'up',
                                  qty: c.quantity || 0,
                                })
                              );
                            }}
                          />
                        </View>
                      </View>

                      <DataTable.Cell
                        numeric
                        centered
                        textStyle={styles.cellTextStyle}
                        style={{
                          flex: 1,
                          ...styles.cellCenter,
                        }}>
                        ${c.unitPrice}
                      </DataTable.Cell>

                      <DataTable.Cell
                        numeric
                        centered
                        textStyle={styles.cellTextStyle}
                        style={{
                          flex: 1,
                          ...styles.cellCenter,
                        }}>
                        ${c.itemTotal.toFixed(2)}
                      </DataTable.Cell>

                      <DataTable.Cell
                        numeric
                        centered
                        textStyle={styles.cellTextStyle}
                        style={{
                          flex: 0.4,
                          ...styles.cellCenter,
                        }}>
                        <Icon
                          tvParallaxProperties={Icon}
                          name={'delete-forever'}
                          size={isLarge ? 25 : 18}
                          color={Colors.primaryColor}
                          type='material-community'
                          onPress={() => {
                            setCurCartId(c._id);
                            setIsDialogVisible(true);
                          }}
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  </View>
                );
              })}

              <View
                style={{
                  marginVertical: isLarge ? 10 : 7,
                  paddingHorizontal: isLarge ? 35 : 27,
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    fontFamily: FontNames.MyriadProRegular,
                    fontSize: isLarge ? 22 : 16,
                    color: Colors.primaryColor,
                    textTransform: 'uppercase',
                  }}>
                  Cart Total {'       '}{' '}
                  <Text
                    style={{
                      textAlign: 'right',
                      fontFamily: FontNames.MyriadProBold,
                      fontSize: isLarge ? 22 : 16,
                      color: Colors.primaryColor,
                      textTransform: 'uppercase',
                    }}>
                    ${cartTotal.toFixed(2)}
                  </Text>{' '}
                  {'        '}
                </Text>
              </View>
            </DataTable>

            <ConfirmationDialog
              setVisible={setIsDialogVisible}
              visible={isDialogVisible}
              submitAns={() => {
                dispatch(deleteCart({ _id: curCartId }));
                Alert.alert('Item deleted successfully.');
                setIsDialogVisible(false);
              }}
            />
          </View>
        </ScrollView>
      )}

      {carts.length > 0 && (
        <FAB
          style={styles.fab}
          color={Colors.primaryColor}
          icon='plus'
          small={isLarge ? false : true}
          label='ADD CUSTOMER'
          onPress={() => {
            navigation.navigate('AddCustomerTO');
          }}
        />
      )}
    </View>
  );
};

export const screenOptions = (navigator: CartScreensProps) => {
  return {
    headerTitle: 'Cart Screen',
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
    marginBottom: isLarge ? 30 : 24,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsHeader: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 30 : 24,
    textTransform: 'uppercase',
    color: Colors.primaryColor,
    marginBottom: isLarge ? 10 : 7,
  },
  settingsText: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 20 : 15,
    textTransform: 'uppercase',
  },
  cellCenter: {
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  cellTextStyle: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 20 : 15,
    color: Colors.primaryColor,
    paddingVertical: isLarge ? 10 : 7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.xplight,
    color: Colors.primaryColor,
  },
});
export default CartScreen;
