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
import { SingleInvoiceScreensProps } from '../../../types/mainNavigatorTypes';
import Colors from '../../../constants/Colors';
import { globalStyles } from '../../../styles/globalStyle';
import FontNames from '../../../constants/FontNames';
import { DataTable } from 'react-native-paper';
import DTHeaderTitle from '../../../components/DataTable/DTHeaderText';
import { FAB } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {
  addToCurrentInvoiceFE,
  clearCurrentInvoice,
  deleteInvoiceFromFinalInvoice,
  Invoice,
} from '../../../store/reducer/invoice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';

import { shareAsync } from 'expo-sharing';
import * as Print from 'expo-print';
import {
  getCapitalizeSentence,
  getInvoiceHTML,
} from '../../../utils/functions';
import ConfirmationDialog from '../../../components/Dialog/ConfirmationDialog';
import { isLarge } from '../../../utils/utils';

const SingleInvoiceScreen: React.FC<SingleInvoiceScreensProps> = ({
  route,
  navigation,
}: SingleInvoiceScreensProps) => {
  const invoice = route.params;
  const [isFocus, setIsFocus] = useState(false);
  const [category, setCategory] = useState(invoice.status); // default other

  const settings = useSelector((state: RootState) => state.settings);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const [fabOpen, setFabOpen] = React.useState({ open: false });
  // @ts-ignore
  const onStateChange = ({ open }) => setFabOpen({ open });
  const { open } = fabOpen;

  const dispatch = useDispatch();

  let statusArr = [
    { label: 'Paid', value: 'paid' },
    { label: 'Unpaid', value: 'unpaid' },
  ];

  const sharePDFFile = async (curInv: Invoice) => {
    const html = getInvoiceHTML(curInv, settings);
    const nameStr = getCapitalizeSentence(curInv.customer.business_name);
    const { uri: cachedUri } = await Print.printToFileAsync({
      html,
    });

    const uri = `${cachedUri.slice(
      0,
      cachedUri.lastIndexOf('/') + 1
    )}${nameStr}_${curInv.invoiceNumber}_${moment(curInv.invoiceDate).format(
      'DD-MM-YYYY'
    )}.pdf`;

    await FileSystem.moveAsync({
      from: cachedUri,
      to: uri,
    });

    await shareAsync(uri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
    });
  };

  return (
    <SafeAreaView style={{ ...styles.container }}>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{ ...styles.container }}>
        <KeyboardAvoidingView
          behavior='padding'
          style={{ ...styles.container, width: '100%' }}>
          <View style={{ ...styles.settingsHeaderWrapper, marginTop: 10 }}>
            <Text style={styles.settingsHeader}>VIEW INVOICE</Text>
          </View>

          <View style={{ width: isLarge ? 700 : 550, marginBottom: 30 }}>
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
                {invoice.customer.business_name}
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
                  {invoice.customer.business_name}
                </Text>
                <Text
                  style={{
                    ...styles.normalTextStyle,
                    marginBottom: isLarge ? 20 : 15,
                  }}>
                  {invoice.customer.address}
                </Text>

                <Text style={{ ...styles.normalTextStyle }}>
                  +1 {invoice.customer.phone}
                </Text>
                <Text style={{ ...styles.normalTextStyle }}>
                  {invoice.customer.email}
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
                    #{invoice.invoiceNumber}
                  </Text>
                </Text>
                <Text style={{ ...styles.normalTextStyle }}>
                  Invoice Date:{' '}
                  {moment(invoice.invoiceDate).format('DD MMM, YYYY')}
                </Text>
                <Text
                  style={{
                    ...styles.normalTextStyle,
                    marginBottom: isLarge ? 20 : 15,
                  }}>
                  Payment Status:{' '}
                  <Text
                    style={{
                      ...styles.normalTextStyle,
                      fontFamily: FontNames.MyriadProBold,
                      color: Colors.primaryColor,
                      textTransform: 'uppercase',
                    }}>
                    {invoice.status}
                  </Text>
                </Text>
                <Text style={{ ...styles.normalTextStyle }}>
                  Notes: {invoice.notes}
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
                      flex: 0.3,
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
                      flex: 0.8,
                      ...styles.cellCenter,
                    }}>
                    <DTHeaderTitle title='QTY' />
                  </DataTable.Title>

                  <DataTable.Title
                    numeric
                    style={{
                      flex: 0.7,
                      ...styles.cellCenter,
                    }}>
                    <DTHeaderTitle title='Price' />
                  </DataTable.Title>

                  <DataTable.Title
                    numeric
                    style={{
                      flex: 0.7,
                      ...styles.cellCenter,
                    }}>
                    <DTHeaderTitle title='Disc.' />
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

                {invoice.invoiceItems.map((invItem, i) => {
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
                          flex: 0.3,
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

                      <DataTable.Cell
                        numeric
                        centered
                        textStyle={styles.cellTextStyle}
                        style={{
                          flex: 0.7,
                          ...styles.cellCenter,
                        }}>
                        {invItem.quantity}
                      </DataTable.Cell>

                      <DataTable.Cell
                        numeric
                        centered
                        textStyle={styles.cellTextStyle}
                        style={{
                          flex: 0.7,
                          ...styles.cellCenter,
                        }}>
                        ${invItem.unitPrice}
                      </DataTable.Cell>

                      <DataTable.Cell
                        numeric
                        centered
                        textStyle={styles.cellTextStyle}
                        style={{
                          flex: 0.7,
                          ...styles.cellCenter,
                        }}>
                        ${(+invItem.discount).toFixed(2)}
                      </DataTable.Cell>

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
                    paddingHorizontal: isLarge ? 30 : 24,
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
                      editable={false}
                      value={'$' + invoice.discount?.toFixed(2) || '0.00'}
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
                      editable={false}
                      value={'$' + invoice.shippingCharge?.toFixed(2) || '0.00'}
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
                      editable={false}
                      value={'$' + invoice.subTotal.toFixed(2)}
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
                      editable={false}
                      value={'$' + invoice.tax?.toFixed(2) || '0.00'}
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
                      editable={false}
                      value={'$' + invoice.total.toFixed(2)}
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
                        disable={true}
                        valueField='value'
                        placeholder={!isFocus ? 'Paid' : '...'}
                        value={category}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
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
                      editable={false}
                      value={invoice.notes || '...'}
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
            message='Are you sure about deleting this invoice?'
            visible={isDialogVisible}
            submitAns={() => {
              dispatch(clearCurrentInvoice());
              dispatch(deleteInvoiceFromFinalInvoice({ invoice }));
              navigation.navigate('AllInvoices');
            }}
          />

          <FAB.Group
            open={open}
            visible={true}
            fabStyle={{ backgroundColor: Colors.xplight }}
            color={Colors.primaryColor}
            icon={open ? 'cog' : 'cog-outline'}
            actions={[
              {
                icon: 'circle-edit-outline',
                label: 'Edit',
                labelTextColor: Colors.primaryColor,
                labelStyle: { backgroundColor: Colors.xplight },
                color: Colors.primaryColor,
                style: { backgroundColor: Colors.xplight },
                onPress: () => {
                  dispatch(addToCurrentInvoiceFE({ invoice }));
                  navigation.navigate('EditInvoice');
                },
              },

              {
                icon: 'delete-forever-outline',
                label: 'Delete',
                labelTextColor: Colors.primaryColor,
                labelStyle: { backgroundColor: Colors.xplight },
                color: Colors.primaryColor,
                style: { backgroundColor: Colors.xplight },
                onPress: () => {
                  setIsDialogVisible(true);
                },
              },
              {
                icon: 'share-variant',
                label: 'Share',
                labelTextColor: Colors.primaryColor,
                labelStyle: { backgroundColor: Colors.xplight },
                color: Colors.primaryColor,
                style: { backgroundColor: Colors.xplight },
                onPress: () => {
                  sharePDFFile(invoice);
                },
                small: isLarge ? false : true,
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export const screenOptions = (navigator: SingleInvoiceScreensProps) => {
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
    marginBottom: isLarge ? 20 : 15,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsHeader: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 30 : 24,
    textTransform: 'uppercase',
    color: Colors.primaryColor,
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
});
export default SingleInvoiceScreen;
