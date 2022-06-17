import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Header, ListItem, Avatar as RNEAvatar } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';

import { Avatar } from 'react-native-paper';
import { getNameAvatar } from '../../utils/functions';
import { isAndroid, isLarge } from '../../utils/utils';
import { Customer } from '../../store/reducer/customer';

const CustomerListView: React.FC<{
  customers: Customer[];
  isView?: boolean;
  viewSingle: (customer: Customer) => void;
  addCustomer: (customer: Customer) => void;
  isCustomerId?: string;
}> = ({ customers, viewSingle, addCustomer, isView, isCustomerId }) => {
  return (
    <View style={styles.mainbox}>
      {customers.length === 0 && (
        <Text
          style={{
            fontFamily: FontNames.MyriadProRegular,
            fontSize: isLarge ? 20 : 15,
            textAlign: 'center',
            color: Colors.primaryColor,
          }}>
          Oops! No customer found
        </Text>
      )}
      {customers.map((l: Customer) => {
        return (
          <ListItem
            onPress={() => viewSingle(l)}
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
              label={getNameAvatar(l!.business_name)}
              style={{
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.xtlight,
                borderRadius: 4,
                borderTopStartRadius: 20,
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
                  fontSize: isLarge ? 25 : 18,
                  marginBottom: isLarge ? 10 : 7,
                  textTransform: 'uppercase',
                }}>
                {l.business_name}
              </ListItem.Title>

              <ListItem.Subtitle
                style={{
                  fontFamily: FontNames.MyriadProRegular,
                  color: Colors.primaryColor,
                  fontSize: isLarge ? 20 : 15,
                  paddingBottom: isLarge ? 10 : 7,
                  width: '100%',
                }}>
                PHONE NUMBER: +1 {l.phone}
              </ListItem.Subtitle>

              <ListItem.Subtitle
                style={{
                  fontFamily: FontNames.MyriadProRegular,
                  color: Colors.primaryColor,
                  borderBottomColor: Colors.primaryColor,
                  borderBottomWidth: 1,
                  fontSize: isLarge ? 20 : 15,
                  paddingBottom: isLarge ? 10 : 7,
                  width: '100%',
                }}>
                EMAIL: {l.email}
              </ListItem.Subtitle>

              <ListItem.Subtitle
                style={{
                  fontFamily: FontNames.MyriadProRegular,
                  marginTop: isLarge ? 10 : 7,
                  color: Colors.primaryColor,
                  fontSize: isLarge ? 20 : 15,
                }}>
                Address: {l.address}
              </ListItem.Subtitle>
            </ListItem.Content>

            {isView ? (
              <Icon
                tvParallaxProperties={Icon}
                name={'chevron-right'}
                size={isLarge ? 40 : 32}
                color={Colors.primaryColor}
                type='material-community'
                onPress={() => viewSingle(l)}
              />
            ) : isCustomerId && isCustomerId === l._id ? (
              <Icon
                tvParallaxProperties={Icon}
                name={'check'}
                size={isLarge ? 40 : 32}
                color={Colors.primaryColor}
                type='material-community'
                onPress={() => {}}
              />
            ) : (
              <Icon
                tvParallaxProperties={Icon}
                name={'plus'}
                size={isLarge ? 40 : 32}
                color={Colors.primaryColor}
                type='material-community'
                onPress={() => addCustomer(l)}
              />
            )}
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
    fontSize: 17,
  },
  mainbox: {
    width: '100%',
    marginTop: 5,
  },
});

export default CustomerListView;
