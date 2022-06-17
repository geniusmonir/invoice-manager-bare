import React, { useState, useRef, Ref, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput as RNTextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import Colors from '../../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import GlobalButton from '../../../components/Buttons/GlobalButton';
import { Formik, FormikProps, useFormik } from 'formik';
import * as Yup from 'yup';
import { globalStyles } from '../../../styles/globalStyle';
import Card from '../../../components/Utils/Card';
import TextInput from '../../../components/Utils/TextInput';
import FontNames from '../../../constants/FontNames';
import { AddCustomerScreensProps } from '../../../types/mainNavigatorTypes';
import { addCustomer } from '../../../store/reducer/customer';
import moment from 'moment';
import { isLarge } from '../../../utils/utils';

interface SUFormValues {
  address: string;
  business_name: string;
  phone: string;
  email?: string;
}

const AFValidationSchema = Yup.object().shape({
  business_name: Yup.string()
    .required('Business Name is required')
    .min(3, ({ min }) => `Business Name must be at least ${min} characters`)
    .max(50, ({ max }) => `Business Name must be less than ${max} characters`)
    .label('Business Name'),
  address: Yup.string().required('Address is required.').label('Address'),
  phone: Yup.string().required('Phone is required.').label('Phone'),
  email: Yup.string()
    .optional()
    .email('Please enter valid email')
    .label('Email'),
});

const AddCustomerScreen: React.FC<AddCustomerScreensProps> = ({
  route,
  navigation,
}: AddCustomerScreensProps) => {
  const phoneInputRef = React.useRef<RNTextInput>(null);
  const addressInputRef = React.useRef<RNTextInput>(null);
  const emailInputRef = React.useRef<RNTextInput>(null);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: SUFormValues = {
    phone: '',
    business_name: '',
    address: '',
    email: '',
  };

  let initialIsValid = AFValidationSchema.isValidSync(initialValues);

  const formik = useFormik({
    validationSchema: AFValidationSchema,
    initialValues,
    enableReinitialize: true,
    validateOnMount: initialIsValid,
    onSubmit: async (values, { resetForm, setErrors }) => {
      setIsSubmitting(true);
      const _id = Math.random().toString(36).substring(2);
      const createdAt = moment().format();
      dispatch(addCustomer({ customer: { ...values, _id, createdAt } }));

      setTimeout(() => {
        setIsSubmitting(false);
        resetForm();
        Alert.alert(`${values.business_name} is added successfully.`);
      }, 600);
    },
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    isValid,
    dirty,
  } = formik;

  if (dirty) {
    initialIsValid = true;
  }

  return (
    <SafeAreaView
      style={{ ...globalStyles.screen, ...styles.container, paddingTop: 10 }}>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{ ...styles.container }}>
        <KeyboardAvoidingView
          behavior='padding'
          style={{ ...styles.container, width: '100%' }}>
          <View style={styles.settingsHeaderWrapper}>
            <Text style={styles.settingsHeader}>ADD NEW CUSTOMER</Text>
          </View>

          <Card
            style={{
              ...styles.authContainer,
              marginBottom: isLarge ? 50 : 39,
            }}>
            <View>
              <View
                style={{
                  marginBottom: isLarge ? 16 : 10,
                  width: '100%',
                }}>
                <TextInput
                  icon='cog-outline'
                  error={errors.business_name}
                  touched={touched.business_name}
                  placeholder='Business name'
                  onChangeText={handleChange('business_name')}
                  onBlur={handleBlur('business_name')}
                  value={values.business_name}
                  autoCorrect={false}
                  autoCapitalize='none'
                  keyboardType='default'
                  returnKeyType='next'
                  returnKeyLabel='Next'
                  blurOnSubmit={false}
                  onSubmitEditing={() => phoneInputRef.current?.focus()}
                />

                {errors.business_name && touched.business_name && (
                  <Text style={styles.redColorText}>
                    {errors.business_name}
                  </Text>
                )}
              </View>

              <View
                style={{
                  marginBottom: isLarge ? 16 : 10,
                  width: '100%',
                }}>
                <TextInput
                  icon='call-outline'
                  error={errors.phone}
                  touched={touched.phone}
                  placeholder='Phone number'
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                  autoCapitalize='none'
                  keyboardType='phone-pad'
                  returnKeyType='go'
                  returnKeyLabel='Enter'
                  ref={phoneInputRef}
                  onSubmitEditing={() => addressInputRef.current?.focus()}
                />

                {errors.phone && touched.phone && (
                  <Text style={styles.redColorText}>{errors.phone}</Text>
                )}
              </View>

              <View
                style={{
                  marginBottom: isLarge ? 16 : 10,
                  width: '100%',
                }}>
                <TextInput
                  icon='map-outline'
                  error={errors.address}
                  touched={touched.address}
                  placeholder='Business address'
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  value={values.address}
                  autoCapitalize='none'
                  returnKeyType='next'
                  returnKeyLabel='Next'
                  ref={addressInputRef}
                  onSubmitEditing={() => {
                    emailInputRef.current?.focus();
                  }}
                />

                {errors.address && touched.address && (
                  <Text style={styles.redColorText}>{errors.address}</Text>
                )}
              </View>

              <View
                style={{
                  width: '100%',
                  marginBottom: isLarge ? 16 : 10,
                }}>
                <TextInput
                  icon='mail-outline'
                  error={errors.email}
                  touched={touched.email}
                  placeholder='Business email'
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  autoCorrect={false}
                  autoCapitalize='none'
                  autoCompleteType='email'
                  keyboardType='email-address'
                  textContentType='emailAddress'
                  returnKeyType='go'
                  returnKeyLabel='Enter'
                  blurOnSubmit={false}
                  ref={emailInputRef}
                  onSubmitEditing={() => {
                    handleSubmit();
                  }}
                />

                {errors.email && touched.email && (
                  <Text style={styles.redColorText}>{errors.email}</Text>
                )}
              </View>
            </View>
          </Card>

          <GlobalButton
            width='80%'
            title='ADD CUSTOMER'
            isLoading={isSubmitting}
            disabled={!(isValid && initialIsValid)}
            color={Colors.primaryColor}
            onPress={() => {
              handleSubmit();
            }}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export const screenOptions = (navigator: AddCustomerScreensProps) => {
  return {
    headerTitle: 'SignUp Screen',
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyBackgroundColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    width: '90%',
    padding: isLarge ? 20 : 15,
  },

  redColorText: {
    color: Colors.accentColor,
    fontFamily: FontNames.MyriadProRegular,
  },
  settingsHeaderWrapper: {
    marginBottom: isLarge ? 30 : 24,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsHeader: {
    fontFamily: FontNames.MyriadProBold,
    fontSize: isLarge ? 35 : 28,
    textTransform: 'uppercase',
    marginBottom: isLarge ? 10 : 7,
    color: Colors.primaryColor,
  },
});
export default AddCustomerScreen;
