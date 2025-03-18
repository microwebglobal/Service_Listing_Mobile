import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './RootNavigation';
import {Colors} from '../utils/Colors';
import {SignInScreen} from '../screens/signin/SignInScreen';
import {SplashScreen} from '../screens/splash/SplashScreen';
import {OnboardingScreen} from '../screens/splash/OnBoardingScreen';
import {VerificationScreen} from '../screens/verification/VerificationScreen';
import {LoginSuccessScreen} from '../screens/signin/LoginSuccess';
import {SignUpScreen} from '../screens/signup/SignUpScreen';
import {SelectLocation} from '../screens/location/SelectLocation';
import {TabNavigator} from './TabNavigator';
import {ProfileScreen} from '../screens/profile/ProfileScreen';
import {SubCategoryScreen} from '../screens/category/SubCategoryScreen';
import {CategoryScreen} from '../screens/category/CategoryScreen';
import {ServiceTypeScreen} from '../screens/category/ServiceTypeScreen';
import {HomeScreen} from '../screens/home/HomeScreen';
import {EditProfileScreen} from '../screens/profile/EditProfileScreen';
import {EditLocationScreen} from '../screens/profile/EditLocationScreen';
import {NotificationScreen} from '../screens/notification/NotificationScreen';
import {ScheduleScreen} from '../screens/cart/ScheduleScreen';
import {CartScreen} from '../screens/cart/CartScreen';
import {SelectedItemsScreen} from '../screens/cart/SelectedItemsScreen';
import {PaymentScreen} from '../screens/cart/PaymentScreen';
import {BookingDetailsScreen} from '../screens/booking/BookingDetailsScreen';
import {BookingScreen} from '../screens/booking/BookingScreen';
import linking from './linking';
import {ActivityIndicator} from 'react-native';
import {AddressDetailsScreen} from '../screens/address/AddressDetailsScreen';
import {AddressSelectionScreen} from '../screens/address/AddressSelectionScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions: any = {
  headerShown: false,
  headerStyle: {
    backgroundColor: Colors.White,
  },
  headerShadowVisible: false,
  headerTintColor: Colors.Dark,
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontWeight: '500',
    color: Colors.Dark,
  },
};

export const CategoryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="SubCategory" component={SubCategoryScreen} />
      <Stack.Screen name="ServiceType" component={ServiceTypeScreen} />
    </Stack.Navigator>
  );
};

export const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export const BookingNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Booking" component={BookingScreen} />
    </Stack.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer
      linking={linking}
      fallback={<ActivityIndicator animating />}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={screenOptions}>
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} />
        <Stack.Screen name="SelectLocation" component={SelectLocation} />
        <Stack.Screen name="EditLocation" component={EditLocationScreen} />
        <Stack.Screen name="AddressDetails" component={AddressDetailsScreen} />
        <Stack.Screen name="SelectAddress" component={AddressSelectionScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="ServiceSchedule" component={ScheduleScreen} />
        <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="SelectedItems" component={SelectedItemsScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
