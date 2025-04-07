import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, PropsWithChildren} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {Address} from '../screens/category/CategoryScreen';
import {NewAddress} from '../screens/address/AddressSelectionScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Verification: {phone: string};
  LoginSuccess: undefined;
  SelectLocation: undefined;
  TabNavigator: undefined;
  HomeScreen: undefined;
  AccountScreen: undefined;
  Profile: undefined;
  Category: undefined;
  SubCategory: {categoryId: string; category: string; imageUrl: string};
  ServiceType: {subCategoryId: string; subCategory: string};
  EditProfile: {itemName: string};
  EditLocation: undefined;
  AddressDetails: {address: Address | NewAddress; isEdit: boolean};
  SelectAddress: {date?: string; time?: string};
  Notification: undefined;
  SelectedItems: undefined;
  ServiceSchedule: undefined;
  Cart: undefined;
  Payment: {amount: string; bookingId: string};
  BookingScreen: undefined;
  BookingDetails: {booking: any};
  BookingHistory: undefined;
  AboutUs: undefined;
  Terms: undefined;
  Privacy: undefined;
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
