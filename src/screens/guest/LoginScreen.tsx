import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput as RNTextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LoginScreensProps } from '../../types/guestNavigatorTypes';
import Colors from '../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import GlobalButton from '../../components/Buttons/GlobalButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Card from '../../components/Utils/Card';
import TextInput from '../../components/Utils/TextInput';
import FontNames from '../../constants/FontNames';
import { RootState } from '../../store/store';
import ErrorModal from '../../components/Modal/ErrorModal';
import { authenticateAdmin } from '../../store/reducer/admin';
import { isLarge } from '../../utils/utils';

interface SUFormValues {
  username: string;
  password: string;
}

const AFValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required').label('Username'),
  password: Yup.string()
    .required('Admin password is required')
    .label('Password'),
});

const LoginScreen: React.FC<LoginScreensProps> = ({
  route,
  navigation,
}: LoginScreensProps) => {
  const passwordInputRef = React.useRef<RNTextInput>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorIsVisible, setErrorIsVisible] = useState(false);
  const dispatch = useDispatch();
  const { password } = useSelector((state: RootState) => state.adminAuth);

  const initialValues: SUFormValues = {
    username: 'ADMIN',
    password: '',
  };

  let initialIsValid = AFValidationSchema.isValidSync(initialValues);

  const formik = useFormik({
    validationSchema: AFValidationSchema,
    initialValues,
    enableReinitialize: true,
    validateOnMount: initialIsValid,
    onSubmit: async (values, { resetForm, setErrors }) => {
      setIsSubmitting(true);

      if (password !== values.password) {
        setErrorIsVisible(true);
        setErrors({ password: 'Password is not correct' });
      }
      dispatch(authenticateAdmin(values));

      setIsSubmitting(false);
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
    <SafeAreaView style={{ ...styles.container, paddingTop: 10 }}>
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{ ...styles.container }}>
        <KeyboardAvoidingView
          behavior='height'
          style={{ ...styles.container, width: '100%' }}>
          <View style={{ marginBottom: 60 }}>
            <Image
              style={styles.logo}
              source={require('../../../assets/images/demo.png')}
            />
            {errors.password && !(dirty && isValid) && (
              <ErrorModal
                isVisible={errorIsVisible}
                onPress={() => setErrorIsVisible(false)}
                message='Password is not correct'
              />
            )}
          </View>

          <Card style={styles.authContainer}>
            <View>
              <View
                style={{
                  width: '100%',
                  marginBottom: 16,
                }}>
                <TextInput
                  icon='person-outline'
                  error={errors.username}
                  touched={touched.username}
                  placeholder='ADMIN'
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  autoCorrect={false}
                  autoCapitalize='none'
                  returnKeyType='next'
                  editable={false}
                  returnKeyLabel='Next'
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    passwordInputRef.current?.focus();
                  }}
                />

                {errors.username && touched.username && (
                  <Text style={styles.redColorText}>{errors.username}</Text>
                )}
              </View>

              <View
                style={{
                  marginBottom: 16,
                  width: '100%',
                }}>
                <TextInput
                  icon='key-outline'
                  error={errors.password}
                  touched={touched.password}
                  placeholder='ADMIN PASSWORD'
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  autoCapitalize='none'
                  secureTextEntry
                  textContentType='password'
                  autoCompleteType='password'
                  returnKeyType='go'
                  returnKeyLabel='Enter'
                  onSubmitEditing={() => handleSubmit()}
                  blurOnSubmit={false}
                  ref={passwordInputRef}
                />

                {errors.password && touched.password && (
                  <Text style={styles.redColorText}>{errors.password}</Text>
                )}
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <GlobalButton
                  onPress={() => handleSubmit()}
                  title='LOGIN'
                  isLoading={isSubmitting}
                  color={Colors.primaryColor}
                  width='100%'
                  disabled={!(dirty && isValid)}
                  disabledColor={Colors.greyBackgroundColor}
                />
              </View>
            </View>
          </Card>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export const screenOptions = (navigator: LoginScreensProps) => {
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
    color: Colors.redColor,
    fontFamily: FontNames.MyriadProRegular,
  },
  logo: {
    width: isLarge ? 300 : 230,
    height: isLarge ? 300 : 230,
  },
});
export default LoginScreen;
