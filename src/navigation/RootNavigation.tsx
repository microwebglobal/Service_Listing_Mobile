import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, PropsWithChildren} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {Address} from '../screens/category/CategoryScreen';
import { Booking } from '../screens/booking/types';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Verification: {phone: string; method: 'sms' | 'whatsapp'};
  LoginSuccess: undefined;
  SelectLocation: undefined;
  TabNavigator: undefined;
  HomeScreen: undefined;
  AccountScreen: undefined;
  Profile: {completedCount: number; totalCount: number};
  Category: undefined;
  SubCategory: {categoryId: string; category: string; imageUrl: string};
  ServiceType: {subCategoryId: string; subCategory: string};
  EditProfile: {itemName: string; itemValue?: string};
  EditLocation: undefined;
  AddressDetails: {address: Address; isEdit: boolean};
  ChangeLocation: undefined;
  Notification: undefined;
  SelectedItems: undefined;
  ServiceSchedule: undefined;
  Cart: undefined;
  Payment: {amount: string; bookingId: string};
  BookingScreen: undefined;
  BookingDetails: {bookingId: string};
  BookingHistory: undefined;
  AboutUs: undefined;
  Terms: undefined;
  Privacy: undefined;
  Wallet: {accBalance: string};
  PGScreen: {url: string; bookingId: string; orderId: string};
  PaymentSuccess: {bookingId: string; merchantOrderId: string};
  Receipt: {booking: Booking};
};

export type NavigationHookType = NativeStackNavigationProp<RootStackParamList>;

export type ScreenProps<RouteName extends keyof RootStackParamList> =
  PropsWithChildren<{
    route: RouteProp<RootStackParamList, RouteName>;
  }>;

export type Screen<RouteName extends keyof RootStackParamList> = FC<
  ScreenProps<RouteName>
>;

export const useNav = () => useNavigation<NavigationHookType>();
