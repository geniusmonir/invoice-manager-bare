import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { isAndroid, isLarge } from '../utils/utils';
import HeaderTitle from './../components/HeaderTitle/HeaderTitle';
import FontNames from '../constants/FontNames';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { resetAuth } from '../store/reducer/admin';
import { StatusBar, Text, View } from 'react-native';

// Navigation Types
import {
  MainDrawerParamList,
  CartStackParamList,
  ProductsStackParamList,
  InvoicesStackParamList,
  CustomersStackParamList,
  HomeStackParamList,
} from '../types/mainNavigatorTypes';

import { SettingsNavigatorParamList } from '../types/settingsNavigatorTypes';

// Drawer Navigation
import GuestStackNavigator from './GuestNavigator';
import SettingsStackNavigator from './SettingNavigator';

// CART
import HomeScreen from '../screens/admin/home/HomeScreen';
import AddCustomerTOScreen from '../screens/admin/cart/AddCustomerTOScreen';
import CartScreen from '../screens/admin/cart/CartScreen';
import FinalInvoiceScreen from '../screens/admin/cart/FinalInvoiceScreen';
import ShareInvoieScreen from '../screens/admin/cart/ShareInvoiceScreen';

// PRODUCTS
import AllProductScreen from '../screens/admin/products/AllProductScreen';
import AddProductScreen from '../screens/admin/products/AddProductScreen';
import EditProductScreen from '../screens/admin/products/EditProductScreen';
import ProductHomeScreen from '../screens/admin/products/ProductHomeScreen';
import EditSingleProductScreen from '../screens/admin/products/EditSingleProductScreen';

// CUSTOMERS
import AddCustomerScreen from '../screens/admin/customers/AddCustomerScreen';
import AllCustomersScreen from '../screens/admin/customers/AllCustomerScreen';
import ViewSingleCustomerScreen from '../screens/admin/customers/ViewSingleCustomerScreen';
import EditCustomerScreen from '../screens/admin/customers/EditCustomerScreen';
import CustomerHomeScreen from '../screens/admin/customers/CustomerHomeScreen';
import EditSingleCustomerScreen from '../screens/admin/customers/EditSingleCustomerScreen';

// INVOICES
import AllInvoiceScreen from '../screens/admin/invoices/AllInvoiceScreen';
import EditInvoiceScreen from '../screens/admin/invoices/EditInvoiceScreen';
import SingleInvoiceScreen from '../screens/admin/invoices/SingleInvoiceScreen';

// SETTINGS
import SettingScreen from '../screens/settings/SettingScreen';
import React, { useEffect, useState } from 'react';
import { Icon } from 'react-native-elements';
import AdminSettingsDialog from '../components/Dialog/AdminSettingsDialog';

const HomeStack = createStackNavigator<HomeStackParamList>();
const CartStack = createStackNavigator<CartStackParamList>();
const ProductStack = createStackNavigator<ProductsStackParamList>();
const InvoicesStack = createStackNavigator<InvoicesStackParamList>();
const CustomersStack = createStackNavigator<CustomersStackParamList>();
const SettingStack = createStackNavigator<SettingsNavigatorParamList>();

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      initialRouteName='Home'
      screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name='Home' component={HomeScreen} />
    </HomeStack.Navigator>
  );
};

const CartStackNavigator = () => {
  return (
    <CartStack.Navigator
      initialRouteName='Cart'
      screenOptions={{ headerShown: false }}>
      <CartStack.Screen name='Cart' component={CartScreen} />
      <CartStack.Screen name='AddCustomerTO' component={AddCustomerTOScreen} />
      <CartStack.Screen name='FinalInvoice' component={FinalInvoiceScreen} />
      <CartStack.Screen name='ShareInvoice' component={ShareInvoieScreen} />
    </CartStack.Navigator>
  );
};

const ProductStackNavigator = () => {
  return (
    <ProductStack.Navigator
      initialRouteName='ProductHome'
      screenOptions={{ headerShown: false }}>
      <ProductStack.Screen name='ProductHome' component={ProductHomeScreen} />
      <ProductStack.Screen name='AllProducts' component={AllProductScreen} />
      <ProductStack.Screen name='AddProduct' component={AddProductScreen} />
      <ProductStack.Screen name='EditProduct' component={EditProductScreen} />
      <ProductStack.Screen
        name='EditSingleProduct'
        component={EditSingleProductScreen}
      />
    </ProductStack.Navigator>
  );
};

const CustomersStackNavigator = () => {
  return (
    <CustomersStack.Navigator
      initialRouteName='CustomerHome'
      screenOptions={{ headerShown: false }}>
      <CustomersStack.Screen
        name='CustomerHome'
        component={CustomerHomeScreen}
      />
      <CustomersStack.Screen
        name='AllCustomers'
        component={AllCustomersScreen}
      />

      <CustomersStack.Screen
        name='ViewSingleCustomer'
        component={ViewSingleCustomerScreen}
      />
      <CustomersStack.Screen name='AddCustomer' component={AddCustomerScreen} />
      <CustomersStack.Screen
        name='EditCustomer'
        component={EditCustomerScreen}
      />

      <CustomersStack.Screen
        name='EditSingleCustomer'
        component={EditSingleCustomerScreen}
      />
    </CustomersStack.Navigator>
  );
};

const InvoicesStackNavigator = () => {
  return (
    <InvoicesStack.Navigator
      initialRouteName='AllInvoices'
      screenOptions={{ headerShown: false }}>
      <InvoicesStack.Screen name='AllInvoices' component={AllInvoiceScreen} />
      <InvoicesStack.Screen name='EditInvoice' component={EditInvoiceScreen} />
      <InvoicesStack.Screen
        name='SingleInvoice'
        component={SingleInvoiceScreen}
      />
    </InvoicesStack.Navigator>
  );
};

const SettingStackNavigator = () => {
  return (
    <SettingStack.Navigator
      initialRouteName='Settings'
      screenOptions={{ headerShown: false }}>
      <SettingStack.Screen name='Settings' component={SettingScreen} />
    </SettingStack.Navigator>
  );
};

const MainNavigator = () => {
  const { isAuthenticated, verified } = useSelector(
    (state: RootState) => state.adminAuth
  );

  useEffect(() => {
    //
  }, [verified]);

  const { business_name } = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={Colors.xplight} barStyle='dark-content' />
      {!isAuthenticated ? (
        <GuestStackNavigator />
      ) : isAuthenticated && business_name ? (
        <Drawer.Navigator
          useLegacyImplementation={true}
          initialRouteName='HomeDr'
          drawerContent={(props) => {
            return (
              <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem
                  label='Logout'
                  labelStyle={{
                    marginLeft: -20,
                    fontFamily: FontNames.MyriadProRegular,
                    fontSize: isLarge ? 20 : 15,
                  }}
                  icon={({ focused, color, size }) => (
                    <Ionicons
                      name={
                        Platform.OS === 'android'
                          ? 'md-log-out-outline'
                          : 'ios-log-out-outline'
                      }
                      size={size}
                      color={color}
                    />
                  )}
                  onPress={() => {
                    dispatch(resetAuth());
                  }}
                />
              </DrawerContentScrollView>
            );
          }}
          screenOptions={({ route, navigation }) => ({
            drawerActiveTintColor: Colors.primaryColor,
            unmountOnBlur: true,
            headerTintColor: Colors.primaryColor,
            drawerLabelStyle: {
              fontFamily: FontNames.MyriadProRegular,
              marginLeft: -20,
              fontSize: isLarge ? 20 : 15,
            },
            headerLeftContainerStyle: {},
            headerTitleStyle: {
              marginLeft: isAndroid ? -20 : 0,
            },
          })}>
          <Drawer.Screen
            name='HomeDr'
            options={{
              title: 'Home',
              unmountOnBlur: true,
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors.greyHeaderColorB80,
              },
              headerTitle: () => <HeaderTitle title={business_name} />,
              drawerLabel: 'Home',
              drawerIcon: (config) => (
                <Ionicons
                  name={
                    Platform.OS === 'android'
                      ? 'home-outline'
                      : 'ios-home-outline'
                  }
                  size={config.size}
                  color={config.color}
                />
              ),
            }}
            component={HomeStackNavigator}
          />

          <Drawer.Screen
            name='ProductsDr'
            options={{
              title: 'Products',
              headerShown: true,
              unmountOnBlur: true,
              headerStyle: {
                backgroundColor: Colors.greyHeaderColorB80,
              },
              headerTitle: () => <HeaderTitle title={`MANAGE PRODUCT`} />,
              drawerLabel: 'Products',
              drawerIcon: (config) => (
                <Ionicons
                  name={
                    Platform.OS === 'android'
                      ? 'layers-outline'
                      : 'ios-layers-outline'
                  }
                  size={config.size}
                  color={config.color}
                />
              ),
            }}
            component={ProductStackNavigator}
          />

          <Drawer.Screen
            name='CustomersDr'
            options={{
              title: 'Customers',
              headerShown: true,
              unmountOnBlur: true,
              headerStyle: {
                backgroundColor: Colors.greyHeaderColorB80,
              },
              headerTitle: () => <HeaderTitle title={`MANAGE CUSTOMER`} />,
              drawerLabel: 'Customers',
              drawerIcon: (config) => (
                <Ionicons
                  name={
                    Platform.OS === 'android'
                      ? 'people-outline'
                      : 'ios-people-outline'
                  }
                  size={config.size}
                  color={config.color}
                />
              ),
            }}
            component={CustomersStackNavigator}
          />

          <Drawer.Screen
            name='CartDr'
            options={{
              title: 'Cart',
              headerShown: true,
              unmountOnBlur: true,
              headerStyle: {
                backgroundColor: Colors.greyHeaderColorB80,
              },
              headerTitle: () => <HeaderTitle title={`CART -> INVOICE`} />,
              drawerLabel: 'Cart',
              drawerIcon: (config) => (
                <Ionicons
                  name={
                    Platform.OS === 'android'
                      ? 'cart-outline'
                      : 'ios-cart-outline'
                  }
                  size={config.size}
                  color={config.color}
                />
              ),
            }}
            component={CartStackNavigator}
          />

          <Drawer.Screen
            name='InvoicesDr'
            options={{
              title: 'Invoices',
              headerShown: true,
              unmountOnBlur: true,
              headerStyle: {
                backgroundColor: Colors.greyHeaderColorB80,
              },
              headerTitle: () => <HeaderTitle title={`INVOICES`} />,
              drawerLabel: 'Invoices',
              drawerIcon: (config) => (
                <Ionicons
                  name={
                    Platform.OS === 'android'
                      ? 'document-outline'
                      : 'ios-document-outline'
                  }
                  size={config.size}
                  color={config.color}
                />
              ),
            }}
            component={InvoicesStackNavigator}
          />

          <Drawer.Screen
            name='SettingsDr'
            options={{
              title: 'Settings',
              unmountOnBlur: true,
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors.greyHeaderColorB80,
              },
              headerRight: () => (
                <View style={{ position: 'absolute', right: 10 }}>
                  {verified && (
                    <>
                      <Icon
                        tvParallaxProperties={Icon}
                        size={30}
                        name='more-vert'
                        type='material-icons'
                        color={Colors.primaryColor}
                        onPress={() => {
                          setVisible((visibility) => !visibility);
                        }}
                      />

                      <AdminSettingsDialog
                        visible={visible}
                        setVisible={setVisible}
                      />
                    </>
                  )}
                </View>
              ),
              headerTitle: () => <HeaderTitle title={`ADMIN SETTINGS`} />,
              drawerLabel: 'Settings',
              drawerIcon: (config) => (
                <Ionicons
                  name={
                    Platform.OS === 'android'
                      ? 'settings-outline'
                      : 'ios-settings-outline'
                  }
                  size={config.size}
                  color={config.color}
                />
              ),
            }}
            component={SettingStackNavigator}
          />
        </Drawer.Navigator>
      ) : (
        <SettingsStackNavigator />
      )}
    </NavigationContainer>
  );
};

export default MainNavigator;
