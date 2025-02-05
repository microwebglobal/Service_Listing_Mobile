import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './RootNavigation';
import {Colors} from '../utils/Colors';
import {SignInScreen} from '../screens/signin/SignInScreen';
import {SignUpScreen} from '../screens/signup/SignUpScreen';
import {SplashScreen} from '../screens/splash/SplashScreen';
import {OnboardingScreen} from '../screens/splash/OnBoardingScreen';
import VerificationScreen from '../screens/verification/VerificationScreen';
import LoginSuccessScreen from '../screens/signin/LoginSuccess';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
