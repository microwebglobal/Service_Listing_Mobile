import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from './user/user.slice';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import addressReducer from './address/address.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import cartReducer from './cart/cart.slice';
import shoppingCartReducer from './shopping_cart/shopping_cart.slice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  user: userReducer,
  address: addressReducer,
  cart: cartReducer,
  shopping_cart: shoppingCartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
