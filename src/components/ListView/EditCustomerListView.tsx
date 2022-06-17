import React from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { Header, ListItem, Avatar as RNEAvatar } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { Avatar } from 'react-native-paper';
import { getNameAvatar } from '../../utils/functions';
import { isAndroid, isLarge } from '../../utils/utils';
import { Customer } from '../../store/reducer/customer';

const EditCustomerListView: React.FC<{
  editCustomer: (customer: Customer) => void;
  deleteCustomer: (customer: Customer) => void;
  customers: Customer[];
}> = ({ customers, editCustomer, deleteCustomer }) => {
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
      {customers.map((l: Customer, i: any) => {
        return (
          <ListItem
            onPress={() => editCustomer(l)}
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
                borderTopStartRadius: isLarge ? 20 : 15,
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

            <View>
              <Icon
                tvParallaxProperties={Icon}
                name={'account-edit-outline'}
                size={isLarge ? 35 : 28}
                color={Colors.primaryColor}
                type='material-community'
                onPress={() => editCustomer(l)}
              />

              <View style={{ marginBottom: isLarge ? 50 : 39 }} />

              <Icon
                tvParallaxProperties={Icon}
                name={'delete-forever-outline'}
                size={isLarge ? 35 : 28}
                color={Colors.redColor}
                type='material-community'
                onPress={() => deleteCustomer(l)}
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

export default EditCustomerListView;
