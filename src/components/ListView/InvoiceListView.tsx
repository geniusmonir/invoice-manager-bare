import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Header, ListItem, Avatar as RNEAvatar } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';

import { Avatar } from 'react-native-paper';
import { getNameAvatar } from '../../utils/functions';
import { isAndroid, isLarge } from '../../utils/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Invoice, InvoiceItemSingle } from '../../store/reducer/invoice';
import moment from 'moment';

const InvoiceListView: React.FC<{
  invoices: Invoice[] | [];
  onItemClick: (invoice: Invoice) => void;
  onFilterClick: (name: string) => void;
}> = ({ invoices, onItemClick, onFilterClick }) => {
  const { logo, hideFromInvoice } = useSelector(
    (state: RootState) => state.settings
  );

  return (
    <View style={styles.mainbox}>
      {invoices.length === 0 && (
        <Text
          style={{
            fontFamily: FontNames.MyriadProRegular,
            fontSize: isLarge ? 20 : 15,
            textAlign: 'center',
            color: Colors.primaryColor,
          }}>
          Oops! No invoice found
        </Text>
      )}

      {invoices.map((l) => {
        return (
          <ListItem
            onPress={() => {
              onItemClick(l);
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
            <Avatar.Text
              labelStyle={{
                fontFamily: FontNames.MyriadProRegular,
                alignItems: 'center',
                justifyContent: 'center',
                textAlignVertical: 'center',
                marginTop: isAndroid ? 0 : 6,
                color: Colors.tertiaryColor,
              }}
              size={isLarge ? 150 : 117}
              label={getNameAvatar(l!.customer.business_name)}
              style={{
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.xtlight,
                borderRadius: 4,
                borderTopStartRadius: isLarge ? 20 : 15,
              }}
            />

            <ListItem.Content
              style={{
                borderRightWidth: 1,
                borderRightColor: Colors.primaryColor,
              }}>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  alignContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginBottom: isLarge ? 10 : 7,
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: FontNames.MyriadProRegular,
                      color: Colors.primaryColor,
                      fontSize: isLarge ? 25 : 18,
                      textTransform: 'uppercase',
                      marginRight: -5,
                    }}>
                    {l.customer.business_name} #{l.invoiceNumber}
                  </Text>
                </View>
                <View style={{ marginRight: isLarge ? 10 : 7 }}>
                  <Icon
                    tvParallaxProperties={Icon}
                    name='filter-plus-outline'
                    size={isLarge ? 25 : 18}
                    iconStyle={{ paddingLeft: 5 }}
                    color={Colors.primaryColor}
                    type='material-community'
                    onPress={() => {
                      onFilterClick(l.customer.business_name);
                    }}
                  />
                </View>
              </View>

              <ListItem.Subtitle
                style={{
                  fontFamily: FontNames.MyriadProRegular,
                  color: Colors.primaryColor,
                  fontSize: isLarge ? 20 : 15,
                  width: '100%',
                }}>
                Invoice Date: {moment(l.invoiceDate).format('DD MMM, YYYY')}
              </ListItem.Subtitle>

              <ListItem.Subtitle
                style={{
                  fontFamily: FontNames.MyriadProRegular,
                  color: Colors.primaryColor,
                  borderBottomColor: Colors.primaryColor,
                  borderBottomWidth: 1,

                  paddingBottom: isLarge ? 10 : 7,
                  fontSize: isLarge ? 20 : 15,
                  width: '100%',
                }}>
                Status:{' '}
                <Text
                  style={{
                    ...styles.normalTextStyle,
                    color: Colors.primaryColor,
                    fontFamily: FontNames.MyriadProBold,
                    textTransform: 'uppercase',
                  }}>
                  {l.status}
                </Text>
                {'         '} Total:{'   '}
                <Text
                  style={{
                    ...styles.normalTextStyle,
                    fontFamily: FontNames.MyriadProBold,
                    fontSize: isLarge ? 30 : 24,
                    color: Colors.primaryColor,
                  }}>
                  ${l.total}
                </Text>
              </ListItem.Subtitle>

              <ListItem.Subtitle
                style={{
                  fontFamily: FontNames.MyriadProRegular,
                  marginTop: isLarge ? 10 : 7,
                  color: Colors.primaryColor,
                  fontSize: isLarge ? 20 : 15,
                }}>
                Notes: {l.notes}
              </ListItem.Subtitle>
            </ListItem.Content>

            <Icon
              tvParallaxProperties={Icon}
              name={'chevron-right'}
              size={isLarge ? 40 : 32}
              color={Colors.primaryColor}
              type='material-community'
              onPress={() => {
                onItemClick(l);
              }}
            />
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
    fontSize: isLarge ? 17 : 12,
  },
  mainbox: {
    width: '100%',
    marginTop: 5,
  },
  normalTextStyle: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 20 : 15,
    color: Colors.dark,
  },
});

export default InvoiceListView;
