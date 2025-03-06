import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, PropsWithChildren} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {Address} from '../screens/category/CategoryScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Verification: {phone: string};
  LoginSuccess: undefined;
  SelectLocation: undefined;
  TabsNavigator: undefined;
  Home: undefined;
  Profile: undefined;
  Category: undefined;
  SubCategory: {categoryId: string; category: string; imageUrl: string};
  ServiceType: {subCategoryId: string; subCategory: string};
  ServiceDetails: undefined;
  EditProfile: {itemName: string};
  EditLocation: undefined;
  AddressDetails: {address: Address};
  SelectAddress: undefined;
  Notification: undefined;
  SelectedItems: undefined;
  ServiceSchedule: {address?: string};
  Cart: undefined;
  Payment: {amount: string; bookingId: string};
  Booking: undefined;
  BookingDetails: {booking: any};
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
