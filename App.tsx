import 'react-native-gesture-handler';
import { useState } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { enableScreens } from 'react-native-screens';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import { Provider, useDispatch } from 'react-redux';
import MainNavigator from './src/navigator/MainNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

enableScreens();

const fetchFonts = () => {
  return Font.loadAsync({
    'futura-book': require('./assets/fonts/FuturaBook.ttf'),
    'futura-book-italic': require('./assets/fonts/FuturaBookItalic.ttf'),
    'myriad-pro-bold': require('./assets/fonts/MyriadProBold.ttf'),
    'myriad-pro-regular': require('./assets/fonts/MyriadProRegular.ttf'),
  });
};

const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <SafeAreaProvider>
          <MainNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
