import React, { useEffect, useState } from 'react';
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
import { EditInvoiceScreensProps } from '../../../types/mainNavigatorTypes';
import Colors from '../../../constants/Colors';
import { globalStyles } from '../../../styles/globalStyle';
import FontNames from '../../../constants/FontNames';
import { DataTable } from 'react-native-paper';
import DTHeaderTitle from '../../../components/DataTable/DTHeaderText';
import { FAB } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ConfirmationDialog from '../../../components/Dialog/ConfirmationDialog';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import * as Print from 'expo-print';
import moment from 'moment';
import {
  formatMoney,
  getCapitalizeSentence,
  getInvoiceHTML,
} from '../../../utils/functions';
import {
  deleteInvoiceItemFE,
  Invoice,
  pushUpdateToFinalInvoice,
  setCurrentPdfUri,
  updateCurrentInvoice,
  updateInvoiceItemFE,
  updateInvoiceItemPriceFE,
} from '../../../store/reducer/invoice';
import { isLarge } from '../../../utils/utils';
import { Dirs, FileSystem as RNFAFileSystem } from 'react-native-file-access';

const EditInvoiceScreen: React.FC<EditInvoiceScreensProps> = ({
  route,
  navigation,
}: EditInvoiceScreensProps) => {
  const { currentInvoice } = useSelector((state: RootState) => state.invoice);
  const settings = useSelector((state: RootState) => state.settings);
  const [isFocus, setIsFocus] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
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

  if (!currentInvoice) {
    return (
      <View style={{ ...styles.container }}>
        <Text
          style={{
            fontFamily: FontNames.MyriadProRegular,
            fontSize: 20,
            marginTop: 100,
            textAlign: 'center',
            color: Colors.primaryColor,
          }}>
          Refresh/Reinitiate process or Plase wait....
        </Text>

        <FAB
          style={styles.fabRefresh}
          icon='refresh'
          loading={loading}
          color={Colors.primaryColor}
          onPress={() => {
            setLoading(true);
            setShow(false);
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
  }

  const saveToFolderStructure = async (
    backupDirFile: string,
    fileName: string
  ) => {
    const permission = await MediaLibrary.requestPermissionsAsync();

    if (permission.granted) {
      try {
        await RNFAFileSystem.cpExternal(
          backupDirFile,
          `${fileName}.pdf`,
          'downloads'
        );
      } catch (error) {
        Alert.alert('Unknown Error Occured!');
      }
    } else {
      Alert.alert('Need Storage permission to export JSON file');
    }
  };

  const saveToPDFFile = async (curInv: Invoice) => {
    const html = getInvoiceHTML(curInv, settings);
    const nameStr = getCapitalizeSentence(curInv.customer.business_name);
    const fileName = `${nameStr}_${curInv.invoiceNumber}_${moment(
      curInv.invoiceDate
    ).format('DD-MM-YYYY')}.pdf`;

    const { uri: cachedUri } = await Print.printToFileAsync({
      html,
    });

    const uri = `${cachedUri.slice(
      0,
      cachedUri.lastIndexOf('/') + 1
    )}${fileName}`;

    await FileSystem.moveAsync({
      from: cachedUri,
      to: uri,
    });

    dispatch(setCurrentPdfUri({ uri }));

    await saveToFolderStructure(uri, fileName);
  };

  const {
    invoiceNumber,
    invoiceDate,
    invoiceItems,
    total,
    subTotal,
    status,
    discount,
    notes,
    shippingCharge,
    customer,
    tax,
  } = currentInvoice;

  const { address, business_name, phone, email } = customer;

  const [category, setCategory] = useState<'paid' | 'unpaid'>(status);
  const [iDiscount, setIDiscount] = useState(
    formatMoney(String(discount)) || ''
  );
  const [iShipping, setIShipping] = useState(
    formatMoney(String(shippingCharge)) || ''
  );
  const [iTax, setITax] = useState(formatMoney(String(tax)) || '');
  const [iNotes, setINotes] = useState(notes || '');

  let statusArr = [
    { label: 'Paid', value: 'paid' },
    { label: 'Unpaid', value: 'unpaid' },
  ];

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{ ...styles.container }}>
        <KeyboardAvoidingView
          behavior='padding'
          style={{ ...styles.container, width: '100%' }}>
          <View style={styles.settingsHeaderWrapper}>
            <Text style={styles.settingsHeader}>EDIT INVOICE</Text>
          </View>

          <View
            style={{
              width: isLarge ? 700 : 550,
              marginBottom: isLarge ? 30 : 24,
            }}>
            <View>
              <Text
                style={{
                  ...styles.normalTextStyle,
                  fontSize: isLarge ? 30 : 24,
                  textTransform: 'uppercase',
                  color: Colors.primaryColor,
                  marginBottom: isLarge ? 15 : 10,
                  textAlign: 'center',
                }}>
                {currentInvoice.customer.business_name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-around',
              }}>
              <View>
                <Text
                  style={{
                    ...styles.normalTextStyle,
                    fontSize: isLarge ? 22 : 17,
                    textTransform: 'uppercase',
                    color: Colors.primaryColor,
                    marginBottom: isLarge ? 10 : 7,
                  }}>
                  Bill to
                </Text>
                <Text style={{ ...styles.normalTextStyle }}>
                  {currentInvoice.customer.business_name}
                </Text>
                <Text style={{ ...styles.normalTextStyle, marginBottom: 20 }}>
                  {currentInvoice.customer.address}
                </Text>

                <Text style={{ ...styles.normalTextStyle }}>
                  +1 {currentInvoice.customer.phone}
                </Text>
                <Text style={{ ...styles.normalTextStyle }}>
                  {currentInvoice.customer.email}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    ...styles.normalTextStyle,
                    fontSize: isLarge ? 22 : 17,
                    textTransform: 'uppercase',
                    color: Colors.primaryColor,
                    marginBottom: isLarge ? 10 : 7,
                  }}>
                  Invoice Details
                </Text>
                <Text style={{ ...styles.normalTextStyle }}>
                  Invoice Number{' '}
                  <Text
                    style={{
                      ...styles.normalTextStyle,
                      fontFamily: FontNames.MyriadProBold,
                      color: Colors.primaryColor,
                    }}>
                    #{currentInvoice.invoiceNumber}
                  </Text>
                </Text>
                <Text style={{ ...styles.normalTextStyle }}>
                  Invoice Date:{' '}
                  {moment(currentInvoice.invoiceDate).format('DD MMM, YYYY')}
                </Text>
                <Text style={{ ...styles.normalTextStyle, marginBottom: 20 }}>
                  Payment Status:{' '}
                  <Text
                    style={{
                      ...styles.normalTextStyle,
                      fontFamily: FontNames.MyriadProBold,
                      color: Colors.primaryColor,
                      textTransform: 'uppercase',
                    }}>
                    {currentInvoice.status}
                  </Text>
                </Text>
                <Text style={{ ...styles.normalTextStyle }}>
                  Notes: {currentInvoice.notes}
                </Text>
              </View>
            </View>
          </View>

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
                </DataTable.Header>

                {currentInvoice.invoiceItems.map((invItem, i) => {
                  return (
                    <DataTable.Row
                      key={invItem._id}
                      style={{
                        height: isLarge ? 60 : 50,
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
                          {invItem.name}
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
                              if (invItem.quantity == 0) {
                                dispatch(
                                  deleteInvoiceItemFE({ _id: invItem._id })
                                );
                                return;
                              }

                              if (invItem.itemTotal <= 0) {
                                dispatch(
                                  deleteInvoiceItemFE({ _id: invItem._id })
                                );
                                return;
                              }

                              dispatch(
                                updateInvoiceItemFE({
                                  _id: invItem._id,
                                  dir: 'down',
                                  qty: invItem.quantity || 0,
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
                              if (+tQty > invItem.inStock) {
                                dispatch(
                                  updateInvoiceItemFE({
                                    _id: invItem._id,
                                    dir: 'change',
                                    qty: +invItem.inStock,
                                  })
                                );
                                Alert.alert('You are out of stock.');
                                return;
                              }
                              dispatch(
                                updateInvoiceItemFE({
                                  _id: invItem._id,
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
                            {invItem.quantity}
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
                              if (
                                invItem.quantity &&
                                invItem.quantity >= invItem.inStock
                              ) {
                                Alert.alert('You are out of stock.');
                                return;
                              }

                              dispatch(
                                updateInvoiceItemFE({
                                  _id: invItem._id,
                                  dir: 'up',
                                  qty: invItem.quantity || 0,
                                })
                              );
                            }}
                          />
                        </View>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          ...styles.cellCenter,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignContent: 'center',
                        }}>
                        <TextInput
                          keyboardType='numeric'
                          onChangeText={(prc: string) => {
                            if (+prc >= 0) {
                              dispatch(
                                updateInvoiceItemPriceFE({
                                  _id: invItem._id,
                                  price: +prc,
                                })
                              );
                            } else {
                              Alert.alert(
                                'Price can not be negative or string'
                              );
                            }
                          }}
                          style={{
                            textAlign: 'center',
                            fontFamily: FontNames.MyriadProBold,
                            color: Colors.primaryColor,
                            fontSize: isLarge ? 20 : 15,
                            marginHorizontal: 5,
                          }}>
                          {+invItem.unitPrice}
                        </TextInput>
                      </View>

                      <DataTable.Cell
                        numeric
                        centered
                        textStyle={styles.cellTextStyle}
                        style={{
                          flex: 1,
                          ...styles.cellCenter,
                        }}>
                        ${invItem.itemTotal.toFixed(2)}
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                })}

                <View
                  style={{
                    marginVertical: isLarge ? 10 : 7,
                    paddingHorizontal: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      marginBottom: 5,
                    }}>
                    <Text
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        fontSize: isLarge ? 20 : 15,
                        color: Colors.primaryColor,
                        textTransform: 'uppercase',
                        marginVertical: 2,
                        marginRight: isLarge ? 50 : 39,
                        marginTop: 3,
                      }}>
                      DISCOUNT
                    </Text>
                    <TextInput
                      placeholder='$0.00'
                      onFocus={() => {
                        setIDiscount((dis) => dis.replace('$', ''));
                      }}
                      onBlur={() => {
                        setIDiscount((dis) => `$${Number(dis).toFixed(2)}`);
                        dispatch(
                          updateCurrentInvoice({
                            updates: {
                              discount: +iDiscount.replace('$', ''),
                              status: category,
                              notes: notes || '',
                              shippingCharge: shippingCharge || 0,
                              tax: tax || 0,
                            },
                          })
                        );
                      }}
                      value={iDiscount}
                      onChangeText={(t: string) => {
                        setIDiscount(t);
                      }}
                      keyboardType='numeric'
                      placeholderTextColor={Colors.primaryColor}
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        color: Colors.primaryColor,
                        fontSize: isLarge ? 20 : 15,
                        paddingHorizontal: isLarge ? 10 : 7,
                        fontWeight: 'normal',
                        padding: 2,
                        width: isLarge ? 150 : 117,
                        textAlign: 'right',
                        borderRadius: 4,
                        borderBottomEndRadius: 30,
                        borderTopStartRadius: 30,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        fontSize: isLarge ? 20 : 15,
                        color: Colors.primaryColor,
                        textTransform: 'uppercase',
                        marginVertical: 2,
                        marginRight: isLarge ? 50 : 39,
                        marginTop: 3,
                      }}>
                      Shipping Charge
                    </Text>
                    <TextInput
                      placeholder='$0.00'
                      onFocus={() => {
                        setIShipping((dis) => dis.replace('$', ''));
                      }}
                      onBlur={() => {
                        setIShipping((dis) => `$${Number(dis).toFixed(2)}`);
                        dispatch(
                          updateCurrentInvoice({
                            updates: {
                              discount: discount || 0,
                              status: category,
                              notes: notes || '',
                              shippingCharge: +iShipping.replace('$', ''),
                              tax: tax || 0,
                            },
                          })
                        );
                      }}
                      value={iShipping}
                      onChangeText={(t: string) => {
                        setIShipping(t);
                      }}
                      keyboardType='numeric'
                      placeholderTextColor={Colors.primaryColor}
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        color: Colors.primaryColor,
                        fontSize: isLarge ? 20 : 15,
                        paddingHorizontal: isLarge ? 10 : 7,
                        fontWeight: 'normal',
                        padding: 2,
                        borderRadius: 4,
                        width: isLarge ? 150 : 117,
                        textAlign: 'right',
                        borderBottomEndRadius: 30,
                        borderTopStartRadius: 30,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        fontSize: isLarge ? 20 : 15,
                        color: Colors.primaryColor,
                        textTransform: 'uppercase',
                        marginVertical: 2,
                        marginRight: isLarge ? 50 : 39,
                        marginTop: 3,
                      }}>
                      Sub total
                    </Text>
                    <TextInput
                      placeholder={formatMoney(String(subTotal))}
                      value={formatMoney(String(subTotal))}
                      editable={false}
                      placeholderTextColor={Colors.primaryColor}
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        color: Colors.primaryColor,
                        fontSize: isLarge ? 20 : 15,
                        paddingHorizontal: isLarge ? 10 : 7,
                        fontWeight: 'normal',
                        width: isLarge ? 150 : 117,
                        textAlign: 'right',
                        padding: 2,
                        borderRadius: 4,
                        borderBottomEndRadius: 30,
                        borderTopStartRadius: 30,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        fontSize: isLarge ? 20 : 15,
                        color: Colors.primaryColor,
                        textTransform: 'uppercase',
                        marginVertical: 2,
                        marginRight: isLarge ? 50 : 39,
                        marginTop: 3,
                      }}>
                      Tax
                    </Text>
                    <TextInput
                      placeholder='$0.00'
                      onFocus={() => {
                        setITax((dis) => dis.replace('$', ''));
                      }}
                      onBlur={() => {
                        setITax((dis) => `$${Number(dis).toFixed(2)}`);
                        dispatch(
                          updateCurrentInvoice({
                            updates: {
                              discount: discount || 0,
                              status: category,
                              notes: notes || '',
                              shippingCharge: shippingCharge || 0,
                              tax: +iTax.replace('$', ''),
                            },
                          })
                        );
                      }}
                      value={iTax}
                      onChangeText={(t: string) => {
                        setITax(t);
                      }}
                      keyboardType='numeric'
                      placeholderTextColor={Colors.primaryColor}
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        color: Colors.primaryColor,
                        fontSize: isLarge ? 20 : 15,
                        paddingHorizontal: isLarge ? 10 : 7,
                        fontWeight: 'normal',
                        width: isLarge ? 150 : 117,
                        textAlign: 'right',
                        padding: 2,
                        borderRadius: 4,
                        borderBottomEndRadius: 30,
                        borderTopStartRadius: 30,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        fontSize: isLarge ? 20 : 15,
                        color: Colors.primaryColor,
                        textTransform: 'uppercase',
                        marginVertical: 2,
                        marginRight: isLarge ? 50 : 39,
                        marginTop: 3,
                      }}>
                      Total
                    </Text>
                    <TextInput
                      placeholder={formatMoney(String(total))}
                      value={formatMoney(String(total))}
                      editable={false}
                      placeholderTextColor={Colors.primaryColor}
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        color: Colors.primaryColor,
                        fontSize: isLarge ? 20 : 15,
                        paddingHorizontal: isLarge ? 10 : 7,
                        width: isLarge ? 150 : 117,
                        textAlign: 'right',
                        fontWeight: 'normal',
                        padding: 2,
                        borderRadius: 4,
                        borderBottomEndRadius: 30,
                        borderTopStartRadius: 30,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        fontSize: isLarge ? 20 : 15,
                        color: Colors.primaryColor,
                        textTransform: 'uppercase',
                        marginVertical: 2,
                        marginRight: isLarge ? 50 : 39,
                        marginTop: 3,
                      }}>
                      Payment Status
                    </Text>

                    <View style={{ width: isLarge ? 150 : 117 }}>
                      <Dropdown
                        style={[
                          styles.dropdown,
                          isFocus && { borderColor: Colors.primaryColor },
                        ]}
                        placeholderStyle={{
                          ...styles.placeholderStyle,
                          textAlign: 'right',
                          color: isFocus
                            ? Colors.primaryColor
                            : styles.placeholderStyle.color,
                        }}
                        selectedTextStyle={{
                          ...styles.selectedTextStyle,
                          textAlign: 'right',
                          color: isFocus
                            ? Colors.primaryColor
                            : styles.selectedTextStyle.color,
                        }}
                        activeColor={Colors.xplight}
                        data={statusArr}
                        maxHeight={isLarge ? 100 : 78}
                        containerStyle={{
                          backgroundColor: Colors.white,
                          borderRadius: isLarge ? 10 : 7,
                        }}
                        labelField='label'
                        valueField='value'
                        placeholder={!isFocus ? 'Paid' : '...'}
                        value={status}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => {
                          setIsFocus(false);
                          dispatch(
                            updateCurrentInvoice({
                              updates: {
                                discount: discount || 0,
                                status: category,
                                notes: notes || '',
                                shippingCharge: shippingCharge || 0,
                                tax: tax || 0,
                              },
                            })
                          );
                        }}
                        onChange={(item) => {
                          setCategory(item.value);
                          setIsFocus(false);
                        }}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        fontSize: isLarge ? 20 : 15,
                        color: Colors.primaryColor,
                        textTransform: 'uppercase',
                        marginVertical: 2,
                        marginRight: isLarge ? 50 : 39,
                        marginTop: 3,
                      }}>
                      Notes
                    </Text>
                    <TextInput
                      placeholder='Write Notes'
                      value={iNotes}
                      onBlur={() => {
                        dispatch(
                          updateCurrentInvoice({
                            updates: {
                              discount: discount || 0,
                              status: category,
                              notes: iNotes,
                              shippingCharge: shippingCharge || 0,
                              tax: tax || 0,
                            },
                          })
                        );
                      }}
                      onChangeText={(t) => {
                        setINotes(t);
                      }}
                      placeholderTextColor={Colors.primaryColor}
                      style={{
                        fontFamily: FontNames.MyriadProRegular,
                        color: Colors.primaryColor,
                        fontSize: isLarge ? 20 : 15,
                        paddingHorizontal: isLarge ? 10 : 7,
                        fontWeight: 'normal',
                        width: isLarge ? 150 : 117,
                        textAlign: 'right',
                        padding: 2,
                        borderRadius: 4,
                        borderBottomEndRadius: 30,
                        borderTopStartRadius: 30,
                      }}
                    />
                  </View>
                </View>
              </DataTable>
            </View>
          </ScrollView>

          <ConfirmationDialog
            setVisible={setIsDialogVisible}
            visible={isDialogVisible}
            submitAns={() => {
              dispatch(pushUpdateToFinalInvoice({ invoice: currentInvoice }));
              Alert.alert('Changes saved!');
              saveToPDFFile(currentInvoice);
              navigation.navigate('SingleInvoice', currentInvoice);
            }}
          />

          <FAB
            style={styles.fab}
            color={Colors.primaryColor}
            icon='content-save-outline'
            label='SAVE CHANGES'
            small={isLarge ? false : true}
            onPress={() => {
              setIsDialogVisible(true);
            }}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export const screenOptions = (navigator: EditInvoiceScreensProps) => {
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
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isLarge ? 20 : 15,
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

  dcontainer: {
    backgroundColor: Colors.xplight,
  },
  dropdown: {
    paddingHorizontal: 8,
    backgroundColor: Colors.xplight,
    fontFamily: FontNames.MyriadProBold,
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

  normalTextStyle: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 20 : 15,
    color: Colors.dark,
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
export default EditInvoiceScreen;
