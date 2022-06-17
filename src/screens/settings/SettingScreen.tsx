import React, { useState, useRef, Ref, useEffect } from 'react';
import { Buffer } from 'buffer';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput as RNTextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Text } from '@rneui/themed';
import Colors from '../../constants/Colors';
import { SettingsScreensProps } from '../../types/settingsNavigatorTypes';
import * as Yup from 'yup';
import { globalStyles } from './../../styles/globalStyle';
import FontNames from '../../constants/FontNames';
import Card from './../../components/Utils/Card';
import TextInput from './../../components/Utils/TextInput';
import { useSelector, useDispatch } from 'react-redux';
import GlobalButton from '../../components/Buttons/GlobalButton';
import { RootState } from '../../store/store';
import { Formik, FormikProps, useFormik } from 'formik';
import UploadImage from '../../components/UploadImage/UploadImage';
import * as ImagePicker from 'expo-image-picker';
import { Checkbox } from 'react-native-paper';
import { updateSettingsState } from '../../store/reducer/settings';
import VerifyAdminDialog from '../../components/Dialog/VerifyAdminDialog';
import ErrorModal from '../../components/Modal/ErrorModal';
import { adminVerification } from '../../store/reducer/admin';
import { isLarge } from '../../utils/utils';

interface SUFormValues {
  business_name: string;
  owner_name: string;
  address: string;
  phone: string;

  website?: string;
  email?: string;
}

const AFValidationSchema = Yup.object().shape({
  business_name: Yup.string()
    .min(3, ({ min }) => `Business Name must be at least ${min} characters`)
    .required('Business Name is required')
    .label('Business Name'),
  owner_name: Yup.string()
    .min(3, ({ min }) => `Owner Name must be at least ${min} characters`)
    .required('Owner Name is required')
    .label('Owner Name'),
  address: Yup.string()
    .min(10, ({ min }) => `Address must be at least ${min} characters`)
    .required('Address is required')
    .label('Address'),
  phone: Yup.string().required('Phone Number is required.').label('Phone'),
  website: Yup.string().optional().label('Website'),
  email: Yup.string()
    .email('Please enter valid email')
    .optional()
    .label('Email'),
});

const SettingsScreen: React.FC<SettingsScreensProps> = ({
  route,
  navigation,
}: SettingsScreensProps) => {
  const {
    address,
    business_name,
    owner_name,
    hideFromInvoice,
    phone,
    email,
    logo,
    website,
  } = useSelector((state: RootState) => state.settings);

  const { isAuthenticated, password } = useSelector(
    (state: RootState) => state.adminAuth
  );

  const ownerNameInputRef = React.useRef<RNTextInput>(null);
  const addressInputRef = React.useRef<RNTextInput>(null);
  const phoneInputRef = React.useRef<RNTextInput>(null);
  const websiteInputRef = React.useRef<RNTextInput>(null);
  const emailInputRef = React.useRef<RNTextInput>(null);

  const [isLogo, setIsLogo] = useState(logo);

  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingP, setIsSubmittingP] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [isHidden, setisHidden] = React.useState(hideFromInvoice);
  const [errorIsVisible, setErrorIsVisible] = useState(false);

  useEffect(() => {
    //code
  }, [refresh]);

  useEffect(() => {
    dispatch(adminVerification({ verified: isVerified }));
  });

  const initialValues: SUFormValues = {
    business_name: business_name ?? '',
    owner_name: owner_name ?? '',
    address: address ?? '',
    phone: phone ?? '',
    website: website ?? '',
    email: email ?? '',
  };

  let initialIsValid = AFValidationSchema.isValidSync(initialValues);

  const formik = useFormik({
    validationSchema: AFValidationSchema,
    initialValues,
    validateOnMount: initialIsValid,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setErrors }) => {
      Keyboard.dismiss();
      setIsSubmitting(true);

      setTimeout(() => {
        const adminSettings = {
          ...values,
          logo: isLogo,
          hideFromInvoice: isHidden,
        };

        dispatch(updateSettingsState(adminSettings));
        setIsSubmitting(false);
        setRefresh(1);
        Alert.alert('Settings saved successfully.');
      }, 500);
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

  const choosePhotoFromLibrary = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      aspect: [4, 4],
    });

    if (pickerResult.cancelled) {
      return;
    }

    if (!pickerResult.cancelled && pickerResult.base64) {
      setIsLogo(pickerResult.base64);
    }
  };

  return (
    <SafeAreaView
      style={{ ...globalStyles.screen, ...styles.container, paddingTop: 10 }}>
      {isAuthenticated && !business_name && !isVerified ? (
        <ScrollView style={{ width: '100%' }}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={{ ...styles.container }}>
            <KeyboardAvoidingView
              behavior='padding'
              style={{ ...styles.container, width: '100%' }}>
              <View style={styles.settingsHeaderWrapper}>
                <Text style={styles.settingsHeader}>ADMIN SETTINGS</Text>
                <Text style={styles.settingsText}>
                  Fill information to get access
                </Text>
              </View>

              <View style={styles.picContainer}>
                <UploadImage
                  onPress={choosePhotoFromLibrary}
                  image={isLogo || ''}
                />

                <Checkbox.Item
                  labelStyle={{
                    fontFamily: FontNames.MyriadProRegular,
                    fontSize: isLarge ? 20 : 15,
                    marginBottom: 3,
                  }}
                  style={{
                    backgroundColor: Colors.greyBackgroundColor,
                  }}
                  label='Hide logo from invoice'
                  status={isHidden ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setisHidden(!isHidden);
                  }}
                  uncheckedColor={Colors.primaryColor}
                  color={Colors.primaryColor}
                />
              </View>

              <Card style={styles.authContainer}>
                <View>
                  <View
                    style={{
                      width: '100%',
                      marginBottom: isLarge ? 16 : 10,
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
                      onSubmitEditing={() => {
                        ownerNameInputRef.current?.focus();
                      }}
                    />

                    {errors.business_name && touched.business_name && (
                      <Text style={styles.redColorText}>
                        {errors.business_name}
                      </Text>
                    )}
                  </View>

                  <View
                    style={{
                      width: '100%',
                      marginBottom: isLarge ? 16 : 10,
                    }}>
                    <TextInput
                      icon='person-outline'
                      error={errors.owner_name}
                      touched={touched.owner_name}
                      placeholder='Owner name'
                      onChangeText={handleChange('owner_name')}
                      onBlur={handleBlur('owner_name')}
                      value={values.owner_name}
                      autoCorrect={false}
                      autoCapitalize='none'
                      keyboardType='default'
                      returnKeyType='next'
                      returnKeyLabel='Next'
                      blurOnSubmit={false}
                      ref={ownerNameInputRef}
                      onSubmitEditing={() => {
                        addressInputRef.current?.focus();
                      }}
                    />

                    {errors.owner_name && touched.owner_name && (
                      <Text style={styles.redColorText}>
                        {errors.owner_name}
                      </Text>
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
                      placeholder='Address'
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      value={values.address}
                      autoCorrect={false}
                      autoCapitalize='none'
                      autoCompleteType='off'
                      keyboardType='default'
                      returnKeyType='next'
                      textContentType='none'
                      ref={addressInputRef}
                      returnKeyLabel='Next'
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        phoneInputRef.current?.focus();
                      }}
                    />

                    {errors.address && touched.address && (
                      <Text style={styles.redColorText}>{errors.address}</Text>
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
                      autoCorrect={false}
                      autoCapitalize='none'
                      autoCompleteType='off'
                      keyboardType='default'
                      returnKeyType='next'
                      textContentType='none'
                      ref={phoneInputRef}
                      returnKeyLabel='Next'
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        websiteInputRef.current?.focus();
                      }}
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
                      icon='earth-outline'
                      error={errors.website}
                      touched={touched.website}
                      placeholder='Website url'
                      onChangeText={handleChange('website')}
                      onBlur={handleBlur('website')}
                      value={values.website}
                      autoCorrect={false}
                      autoCapitalize='none'
                      autoCompleteType='off'
                      keyboardType='default'
                      returnKeyType='next'
                      textContentType='none'
                      ref={websiteInputRef}
                      returnKeyLabel='Next'
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        emailInputRef.current?.focus();
                      }}
                    />

                    {errors.website && touched.website && (
                      <Text style={styles.redColorText}>{errors.website}</Text>
                    )}
                  </View>

                  <View
                    style={{
                      marginBottom: isLarge ? 16 : 10,
                      width: '100%',
                    }}>
                    <TextInput
                      icon='mail-outline'
                      error={errors.email}
                      touched={touched.email}
                      placeholder='Email'
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      autoCorrect={false}
                      autoCapitalize='none'
                      autoCompleteType='email'
                      keyboardType='default'
                      returnKeyType='go'
                      textContentType='none'
                      ref={emailInputRef}
                      returnKeyLabel='Enter'
                      blurOnSubmit={false}
                      onSubmitEditing={() => handleSubmit()}
                    />

                    {errors.email && touched.email && (
                      <Text style={styles.redColorText}>{errors.email}</Text>
                    )}
                  </View>
                </View>
              </Card>

              <GlobalButton
                width='80%'
                title='Save settings'
                isLoading={isSubmitting}
                disabled={!(isValid && initialIsValid)}
                color={Colors.primaryColor}
                onPress={() => handleSubmit()}
              />
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </ScrollView>
      ) : isAuthenticated && business_name && !isVerified ? (
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: FontNames.MyriadProRegular,
              fontSize: isLarge ? 20 : 15,
              marginBottom: isLarge ? 30 : 20,
            }}>
            You need to enter admin password again to change admin settings
          </Text>

          <VerifyAdminDialog
            setVisible={() => setIsDialogVisible(false)}
            visible={isDialogVisible}
            loading={isSubmittingP}
            submitPassword={(p: string) => {
              setIsSubmittingP(true);

              if (password === p) {
                dispatch(adminVerification({ verified: true }));
                setIsDialogVisible(false);
                setIsVerified(true);
              } else {
                setErrorIsVisible(true);
              }

              setIsSubmittingP(false);
            }}
          />

          <ErrorModal
            isVisible={errorIsVisible}
            onPress={() => setErrorIsVisible(false)}
            message='Password is not correct'
          />

          <GlobalButton
            width='55%'
            title='VERIFY PASSWORD'
            color={Colors.xplight}
            fontColor={Colors.primaryColor}
            onPress={() => setIsDialogVisible(true)}
          />
        </View>
      ) : (
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{ ...styles.container }}>
          <ScrollView style={{ width: '100%' }}>
            <KeyboardAvoidingView
              behavior='padding'
              style={{ ...styles.container, width: '100%' }}>
              <View style={styles.settingsHeaderWrapper}>
                <Text style={styles.settingsHeader}>ADMIN SETTINGS</Text>
              </View>

              <View style={styles.picContainer}>
                <UploadImage
                  onPress={choosePhotoFromLibrary}
                  image={isLogo || ''}
                />

                <Checkbox.Item
                  labelStyle={{
                    fontFamily: FontNames.MyriadProRegular,
                    fontSize: isLarge ? 20 : 15,
                    marginBottom: 3,
                  }}
                  style={{
                    backgroundColor: Colors.greyBackgroundColor,
                  }}
                  label='Hide logo from invoice'
                  status={isHidden ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setisHidden(!isHidden);
                  }}
                  uncheckedColor={Colors.primaryColor}
                  color={Colors.primaryColor}
                />
              </View>

              <Card style={styles.authContainer}>
                <View>
                  <View
                    style={{
                      width: '100%',
                      marginBottom: isLarge ? 16 : 10,
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
                      onSubmitEditing={() => {
                        ownerNameInputRef.current?.focus();
                      }}
                    />

                    {errors.business_name && touched.business_name && (
                      <Text style={styles.redColorText}>
                        {errors.business_name}
                      </Text>
                    )}
                  </View>

                  <View
                    style={{
                      width: '100%',
                      marginBottom: isLarge ? 16 : 10,
                    }}>
                    <TextInput
                      icon='person-outline'
                      error={errors.owner_name}
                      touched={touched.owner_name}
                      placeholder='Owner name'
                      onChangeText={handleChange('owner_name')}
                      onBlur={handleBlur('owner_name')}
                      value={values.owner_name}
                      autoCorrect={false}
                      autoCapitalize='none'
                      keyboardType='default'
                      returnKeyType='next'
                      returnKeyLabel='Next'
                      blurOnSubmit={false}
                      ref={ownerNameInputRef}
                      onSubmitEditing={() => {
                        addressInputRef.current?.focus();
                      }}
                    />

                    {errors.owner_name && touched.owner_name && (
                      <Text style={styles.redColorText}>
                        {errors.owner_name}
                      </Text>
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
                      placeholder='Address'
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      value={values.address}
                      autoCorrect={false}
                      autoCapitalize='none'
                      autoCompleteType='off'
                      keyboardType='default'
                      returnKeyType='next'
                      textContentType='none'
                      ref={addressInputRef}
                      returnKeyLabel='Next'
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        phoneInputRef.current?.focus();
                      }}
                    />

                    {errors.address && touched.address && (
                      <Text style={styles.redColorText}>{errors.address}</Text>
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
                      autoCorrect={false}
                      autoCapitalize='none'
                      autoCompleteType='off'
                      keyboardType='default'
                      returnKeyType='next'
                      textContentType='none'
                      ref={phoneInputRef}
                      returnKeyLabel='Next'
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        websiteInputRef.current?.focus();
                      }}
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
                      icon='earth-outline'
                      error={errors.website}
                      touched={touched.website}
                      placeholder='Website url'
                      onChangeText={handleChange('website')}
                      onBlur={handleBlur('website')}
                      value={values.website}
                      autoCorrect={false}
                      autoCapitalize='none'
                      autoCompleteType='off'
                      keyboardType='default'
                      returnKeyType='next'
                      textContentType='none'
                      ref={websiteInputRef}
                      returnKeyLabel='Next'
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        emailInputRef.current?.focus();
                      }}
                    />

                    {errors.website && touched.website && (
                      <Text style={styles.redColorText}>{errors.website}</Text>
                    )}
                  </View>

                  <View
                    style={{
                      marginBottom: isLarge ? 16 : 10,
                      width: '100%',
                    }}>
                    <TextInput
                      icon='mail-outline'
                      error={errors.email}
                      touched={touched.email}
                      placeholder='Email'
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      autoCorrect={false}
                      autoCapitalize='none'
                      autoCompleteType='email'
                      keyboardType='default'
                      returnKeyType='go'
                      textContentType='none'
                      ref={emailInputRef}
                      returnKeyLabel='Enter'
                      blurOnSubmit={false}
                      onSubmitEditing={() => handleSubmit()}
                    />

                    {errors.email && touched.email && (
                      <Text style={styles.redColorText}>{errors.email}</Text>
                    )}
                  </View>
                </View>
              </Card>

              <GlobalButton
                width='80%'
                title='Save settings'
                isLoading={isSubmitting}
                disabled={!(isValid && initialIsValid)}
                color={Colors.primaryColor}
                onPress={() => handleSubmit()}
              />
            </KeyboardAvoidingView>
          </ScrollView>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
};

export const screenOptions = (navigator: SettingsScreensProps) => {
  return {
    headerTitle: 'Settings Screen',
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
    marginVertical: isLarge ? 50 : 40,
  },

  redColorText: {
    color: Colors.redColor,
    fontFamily: FontNames.MyriadProRegular,
  },
  picContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  bottomText: {
    fontFamily: FontNames.MyriadProBold,
    fontSize: isLarge ? 20 : 15,
    color: Colors.primaryColor,
  },
  settingsHeaderWrapper: {
    marginBottom: isLarge ? 30 : 20,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsHeader: {
    fontFamily: FontNames.MyriadProBold,
    fontSize: isLarge ? 40 : 30,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  settingsText: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 20 : 15,
    textTransform: 'uppercase',
  },
});
export default SettingsScreen;
