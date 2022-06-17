import { DrawerScreenProps } from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Customer } from '../store/reducer/customer';
import { Invoice } from '../store/reducer/invoice';
import { Product } from '../store/reducer/product';
import { SettingsNavigatorParamList } from './settingsNavigatorTypes';

// Navigation Params

// Home Stack Params
// Main Stack Params
export type HomeStackParamList = {
  Home: undefined;
};

export type HomeScreensProps = StackScreenProps<HomeStackParamList, 'Home'>;

// Main Stack Params
export type CartStackParamList = {
  Cart: undefined;
  AddCustomerTO: undefined;
  FinalInvoice: undefined;
  ShareInvoice: { invoiceNumber: string; business_name: string };
};

export type CartScreensProps = StackScreenProps<CartStackParamList, 'Cart'>;

export type AddCustomerTOScreensProps = StackScreenProps<
  CartStackParamList,
  'AddCustomerTO'
>;

export type FinalInvoiceScreensProps = StackScreenProps<
  CartStackParamList,
  'FinalInvoice'
>;

export type ShareInvoiceScreensProps = StackScreenProps<
  CartStackParamList,
  'ShareInvoice'
>;

// -----------

export type ProductsStackParamList = {
  ProductHome: undefined;
  AllProducts: undefined;
  AddProduct: undefined;
  EditProduct: undefined;
  EditSingleProduct: Product;
};

// List of screens
export type ProductHomeScreensProps = StackScreenProps<
  ProductsStackParamList,
  'ProductHome'
>;

export type AllProductsScreensProps = StackScreenProps<
  ProductsStackParamList,
  'AllProducts'
>;

export type AddProductScreensProps = StackScreenProps<
  ProductsStackParamList,
  'AddProduct'
>;
export type EditProductScreensProps = StackScreenProps<
  ProductsStackParamList,
  'EditProduct'
>;
export type EditSingleProductScreensProps = StackScreenProps<
  ProductsStackParamList,
  'EditSingleProduct'
>;

// -----------

export type CustomersStackParamList = {
  CustomerHome: undefined;
  AllCustomers: undefined;
  ViewSingleCustomer: Customer;
  AddCustomer: undefined;
  EditCustomer: undefined;
  EditSingleCustomer: Customer;
};

// List of screens
export type CustomerHomeScreensProps = StackScreenProps<
  CustomersStackParamList,
  'CustomerHome'
>;

export type AllCustomersScreensProps = StackScreenProps<
  CustomersStackParamList,
  'AllCustomers'
>;

export type ViewSingleCustomerScreensProps = StackScreenProps<
  CustomersStackParamList,
  'ViewSingleCustomer'
>;

export type AddCustomerScreensProps = StackScreenProps<
  CustomersStackParamList,
  'AddCustomer'
>;
export type EditCustomerScreensProps = StackScreenProps<
  CustomersStackParamList,
  'EditCustomer'
>;
export type EditSingleCustomerScreensProps = StackScreenProps<
  CustomersStackParamList,
  'EditSingleCustomer'
>;

// -----------

export type InvoicesStackParamList = {
  AllInvoices: undefined;
  EditInvoice: undefined;
  SingleInvoice: Invoice;
};

// List of screens
export type AllInvoicesScreensProps = StackScreenProps<
  InvoicesStackParamList,
  'AllInvoices'
>;

export type EditInvoiceScreensProps = StackScreenProps<
  InvoicesStackParamList,
  'EditInvoice'
>;

export type SingleInvoiceScreensProps = StackScreenProps<
  InvoicesStackParamList,
  'SingleInvoice'
>;

export type MainDrawerParamList = {
  HomeDr: NavigatorScreenParams<HomeStackParamList>;
  CartDr: NavigatorScreenParams<CartStackParamList>;
  ProductsDr: NavigatorScreenParams<ProductsStackParamList>;
  CustomersDr: NavigatorScreenParams<CustomersStackParamList>;
  InvoicesDr: NavigatorScreenParams<InvoicesStackParamList>;
  SettingsDr: NavigatorScreenParams<SettingsNavigatorParamList>;
};

export type MainDrawerProps = DrawerScreenProps<MainDrawerParamList>;
export type MainDrawerParamType = keyof MainDrawerParamList;
