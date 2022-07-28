import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import customerReducer from './reducer/customer';
import adminAuthReducer from './reducer/admin';
import settingsReducer from './reducer/settings';
import categoryReducer from './reducer/category';
import cartReducer from './reducer/cart';
import productReducer from './reducer/product';
import invoiceReducer from './reducer/invoice';
// @ts-ignore
import FSStorage from 'redux-persist-fs-storage';
//import AsyncStorage from '@react-native-async-storage/async-storage';

const reducers = combineReducers({
  customer: customerReducer,
  product: productReducer,
  cart: cartReducer,
  invoice: invoiceReducer,
  adminAuth: adminAuthReducer,
  settings: settingsReducer,
  category: categoryReducer,
});

const persistConfig = {
  key: 'root',
  keyPrefix: '',
  storage: FSStorage(),
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
