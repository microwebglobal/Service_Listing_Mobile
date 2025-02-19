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
import {ServiceDetails} from '../screens/serviceDetails/ServiceDetails';
import {HomeScreen} from '../screens/home/HomeScreen';
import {EditProfileScreen} from '../screens/profile/EditProfileScreen';
import {EditLocationScreen} from '../screens/profile/EditLocationScreen';
import {NotificationScreen} from '../screens/notification/NotificationScreen';
import {ScheduleScreen} from '../screens/cart/ScheduleScreen';
import {CartScreen} from '../screens/cart/CartScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const CategoryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
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
      }}>
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="SubCategory" component={SubCategoryScreen} />
      <Stack.Screen name="ServiceType" component={ServiceTypeScreen} />
    </Stack.Navigator>
  );
};

export const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
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
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
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
      }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
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
        }}>
        <Stack.Screen
          name="Tab"
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
        <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        <Stack.Screen name="EditLocation" component={EditLocationScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="ServiceSchedule" component={ScheduleScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
