import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FC, PropsWithChildren} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {SubCategory} from '../screens/category/CategoryScreen';
import {Service} from '../screens/category/ServiceTypeScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Verification: {phone: string};
  LoginSuccess: undefined;
  SelectLocation: undefined;
  Tab: undefined;
  Home: undefined;
  Profile: undefined;
  Category: undefined;
  SubCategory: {subcategoryData: Array<SubCategory>; category: string};
  ServiceType: {subCategoryId: string, subCategory: string};
  ServiceList: {serviceData: Array<Service>};
  ServiceDetails: undefined;
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
