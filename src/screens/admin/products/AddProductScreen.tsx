import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput as RNTextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Text } from '@rneui/themed';
import { AddProductScreensProps } from '../../../types/mainNavigatorTypes';
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
import UploadImage from '../../../components/UploadImage/UploadImage';
import { Checkbox } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { capitalizeFirstWord } from '../../../utils/functions';
import moment from 'moment';
import { addProduct } from '../../../store/reducer/product';
import { isLarge } from '../../../utils/utils';

interface SUFormValues {
  name: string;
  unitPrice: number | '';
  inStock: number | '';

  discount?: number | '';
  description?: string;
  notes?: string;
}

const AFValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, ({ min }) => `Product Name must be at least ${min} characters`)
    .required('Product Name is required')
    .label('Product Name'),
  unitPrice: Yup.number()
    .min(
      1,
      ({ min }) => `You must have to put a number ${min} or greater than that`
    )
    .required('Unit Price is Required')
    .label('UnitPrice'),
  inStock: Yup.number()
    .min(
      1,
      ({ min }) => `You must have to put a number ${min} or greater than that`
    )
    .required('Unit Price is Required')
    .label('InStock'),

  discount: Yup.number().optional().default(0).label('Discount'),
  description: Yup.string().optional().label('Description'),
  notes: Yup.string().optional().label('Notes'),
});

const AddProductScreen: React.FC<AddProductScreensProps> = ({
  route,
  navigation,
}: AddProductScreensProps) => {
  const { categories } = useSelector((state: RootState) => state.category);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFocus, setIsFocus] = useState(false);

  const unitPriceInputRef = React.useRef<RNTextInput>(null);
  const discountInputRef = React.useRef<RNTextInput>(null);
  const inStockInputRef = React.useRef<RNTextInput>(null);
  const descriptionInputRef = React.useRef<RNTextInput>(null);
  const notesInputRef = React.useRef<RNTextInput>(null);

  const [isImage, setIsImage] = useState('');
  const [isHidden, setIsHidden] = React.useState(false);
  const [category, setCategory] = useState(''); // default other
  const dispatch = useDispatch();

  const initialValues: SUFormValues = {
    name: '',
    unitPrice: '',
    inStock: '',
    discount: '',
    description: '',
    notes: '',
  };

  let initialIsValid = AFValidationSchema.isValidSync(initialValues);

  const formik = useFormik({
    validationSchema: AFValidationSchema,
    initialValues,
    enableReinitialize: true,
    validateOnMount: initialIsValid,
    onSubmit: async (values, { resetForm, setErrors }) => {
      if (isImage === '') {
        Alert.alert('Please add product image to procced');
        return;
      }

      if (category === '') {
        setCategory('others');
      }

      setIsSubmitting(true);
      const _id = Math.random().toString(36).substring(2);
      const createdAt = moment().format();

      dispatch(
        addProduct({
          product: {
            ...values,
            _id,
            createdAt,
            category: category,
            image: isImage,
            isShown: !isHidden,
            discount: values.discount || 0,
          },
        })
      );
      setTimeout(() => {
        resetForm();
        setIsImage('');
        setCategory('others');
        setIsSubmitting(false);
        Alert.alert('Product added successfully.');
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
      setIsImage(pickerResult.base64);
    }
  };

  // "categories": ["pepsi", "ziyad", "california_garden", "other"]

  const categoryDataArr = categories.map((cat: string) => {
    return {
      label: capitalizeFirstWord(cat),
      value: cat,
    };
  });

  return (
    <SafeAreaView
      style={{ ...globalStyles.screen, ...styles.container, paddingTop: 10 }}>
      <ScrollView style={{ width: '100%' }}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{ ...styles.container }}>
          <KeyboardAvoidingView
            behavior='padding'
            style={{ ...styles.container, width: '100%' }}>
            <View style={styles.settingsHeaderWrapper}>
              <Text style={styles.settingsHeader}>ADD NEW PRODUCT</Text>
            </View>

            <View style={styles.picContainer}>
              <UploadImage
                onPress={choosePhotoFromLibrary}
                image={isImage || ''}
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
                label='Hide product from listing'
                status={isHidden ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsHidden(!isHidden);
                }}
                uncheckedColor={Colors.primaryColor}
                color={Colors.primaryColor}
              />
            </View>

            <Card
              style={{
                ...styles.authContainer,
                marginBottom: isLarge ? 70 : 55,
              }}>
              <View>
                <View
                  style={{
                    marginBottom: isLarge ? 16 : 10,
                    width: '100%',
                  }}>
                  <TextInput
                    icon='layers-outline'
                    error={errors.name}
                    touched={touched.name}
                    placeholder='Product name'
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    autoCorrect={false}
                    autoCapitalize='none'
                    keyboardType='default'
                    returnKeyType='next'
                    returnKeyLabel='Next'
                    blurOnSubmit={false}
                    onSubmitEditing={() => unitPriceInputRef.current?.focus()}
                  />

                  {errors.name && touched.name && (
                    <Text style={styles.redColorText}>{errors.name}</Text>
                  )}
                </View>

                <View style={styles.dcontainer}>
                  <Dropdown
                    style={[
                      styles.dropdown,
                      isFocus && { borderColor: Colors.primaryColor },
                    ]}
                    placeholderStyle={{
                      ...styles.placeholderStyle,
                      color: isFocus
                        ? Colors.primaryColor
                        : styles.placeholderStyle.color,
                    }}
                    selectedTextStyle={{
                      ...styles.selectedTextStyle,
                      color: isFocus
                        ? Colors.primaryColor
                        : styles.selectedTextStyle.color,
                    }}
                    activeColor={Colors.xalight}
                    iconStyle={styles.iconStyle}
                    data={categoryDataArr}
                    maxHeight={isLarge ? 200 : 155}
                    containerStyle={{
                      backgroundColor: Colors.white,
                      borderRadius: 10,
                    }}
                    labelField='label'
                    valueField='value'
                    placeholder={!isFocus ? 'Select category' : '...'}
                    value={category}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setCategory(item.value);
                      setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                        style={{ ...styles.icon, marginLeft: 10 }}
                        color={
                          isFocus ? Colors.primaryColor : Colors.primaryColor
                        }
                        name='Safety'
                        size={isLarge ? 25 : 18}
                      />
                    )}
                  />
                </View>

                <View
                  style={{
                    marginBottom: isLarge ? 16 : 10,
                    width: '100%',
                  }}>
                  <TextInput
                    icon='pricetag-outline'
                    error={errors.unitPrice}
                    touched={touched.unitPrice}
                    placeholder='Unit price'
                    onChangeText={handleChange('unitPrice')}
                    onBlur={handleBlur('unitPrice')}
                    value={values.unitPrice + ''}
                    autoCapitalize='none'
                    keyboardType='number-pad'
                    returnKeyType='next'
                    returnKeyLabel='Next'
                    ref={unitPriceInputRef}
                    onSubmitEditing={() => inStockInputRef.current?.focus()}
                  />

                  {errors.unitPrice && touched.unitPrice && (
                    <Text style={styles.redColorText}>{errors.unitPrice}</Text>
                  )}
                </View>

                <View
                  style={{
                    marginBottom: isLarge ? 16 : 10,
                    width: '100%',
                  }}>
                  <TextInput
                    icon='grid-outline'
                    error={errors.inStock}
                    touched={touched.inStock}
                    placeholder='Amount in stock'
                    keyboardType='number-pad'
                    onChangeText={handleChange('inStock')}
                    onBlur={handleBlur('inStock')}
                    value={values.inStock + ''}
                    autoCapitalize='none'
                    returnKeyType='next'
                    returnKeyLabel='Next'
                    ref={inStockInputRef}
                    onSubmitEditing={() => {
                      discountInputRef.current?.focus();
                    }}
                  />

                  {errors.inStock && touched.inStock && (
                    <Text style={styles.redColorText}>{errors.inStock}</Text>
                  )}
                </View>

                <View
                  style={{
                    marginBottom: isLarge ? 16 : 10,
                    width: '100%',
                  }}>
                  <TextInput
                    icon='megaphone-outline'
                    error={errors.discount}
                    touched={touched.discount}
                    placeholder='Product discount'
                    keyboardType='number-pad'
                    onChangeText={handleChange('discount')}
                    onBlur={handleBlur('discount')}
                    value={values.discount + ''}
                    autoCapitalize='none'
                    returnKeyType='next'
                    returnKeyLabel='Next'
                    ref={discountInputRef}
                    onSubmitEditing={() => {
                      descriptionInputRef.current?.focus();
                    }}
                  />

                  {errors.discount && touched.discount && (
                    <Text style={styles.redColorText}>{errors.discount}</Text>
                  )}
                </View>

                <View
                  style={{
                    marginBottom: isLarge ? 16 : 10,
                    width: '100%',
                  }}>
                  <TextInput
                    icon='document-text-outline'
                    error={errors.description}
                    touched={touched.description}
                    placeholder='Product description'
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                    autoCapitalize='none'
                    returnKeyType='next'
                    returnKeyLabel='Next'
                    ref={descriptionInputRef}
                    onSubmitEditing={() => {
                      notesInputRef.current?.focus();
                    }}
                  />

                  {errors.description && touched.description && (
                    <Text style={styles.redColorText}>
                      {errors.description}
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    width: '100%',
                    marginBottom: isLarge ? 16 : 10,
                  }}>
                  <TextInput
                    icon='document-outline'
                    error={errors.notes}
                    touched={touched.notes}
                    placeholder='Notes'
                    onChangeText={handleChange('notes')}
                    onBlur={handleBlur('notes')}
                    value={values.notes}
                    autoCorrect={false}
                    autoCapitalize='none'
                    returnKeyType='go'
                    returnKeyLabel='Enter'
                    blurOnSubmit={false}
                    ref={notesInputRef}
                    onSubmitEditing={() => {
                      handleSubmit();
                    }}
                  />

                  {errors.notes && touched.notes && (
                    <Text style={styles.redColorText}>{errors.notes}</Text>
                  )}
                </View>
              </View>
            </Card>

            <GlobalButton
              width='80%'
              title='ADD PRODUCT'
              isLoading={isSubmitting}
              disabled={!(isValid && initialIsValid)}
              color={Colors.primaryColor}
              onPress={() => {
                handleSubmit();
              }}
            />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export const screenOptions = (navigator: AddProductScreensProps) => {
  return {
    headerTitle: 'Add Product Screen',
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
  picContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: isLarge ? 20 : 15,
  },
  bottomText: {
    fontFamily: FontNames.MyriadProBold,
    fontSize: isLarge ? 20 : 15,
    color: Colors.primaryColor,
  },
  settingsHeaderWrapper: {
    marginBottom: 10,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: isLarge ? 20 : 15,
  },
  settingsHeader: {
    fontFamily: FontNames.MyriadProBold,
    fontSize: isLarge ? 30 : 24,
    color: Colors.primaryColor,
    textTransform: 'uppercase',
  },
  settingsText: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 20 : 15,
    textTransform: 'uppercase',
  },
  dcontainer: {
    backgroundColor: Colors.xplight,
    borderRadius: 4,
    borderBottomEndRadius: 30,
    borderTopStartRadius: 30,
    marginBottom: 15,
  },
  dropdown: {
    height: isLarge ? 50 : 39,
    borderColor: Colors.primaryColor,
    borderWidth: 0.5,
    borderRadius: 4,
    borderBottomEndRadius: 30,
    borderTopStartRadius: 30,
    paddingHorizontal: 8,
    backgroundColor: Colors.xplight,
    fontFamily: FontNames.MyriadProBold,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: Colors.xplight,
    fontFamily: FontNames.MyriadProBold,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: isLarge ? 20 : 15,
    color: Colors.primaryColor,
  },
  placeholderStyle: {
    fontSize: isLarge ? 20 : 15,
    fontFamily: FontNames.MyriadProBold,
    color: Colors.primaryColor,
  },
  selectedTextStyle: {
    fontSize: isLarge ? 20 : 15,
    color: Colors.primaryColor,
    fontFamily: FontNames.MyriadProBold,
  },
  iconStyle: {
    width: isLarge ? 20 : 15,
    height: isLarge ? 20 : 15,
  },
});

export default AddProductScreen;
