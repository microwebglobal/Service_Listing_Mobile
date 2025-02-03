import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './RootNavigation';
import { Colors } from '../utils/Colors';
import SignInScreen from '../screens/signin/SignInScreen';
import SignUpScreen from '../screens/signup/SignUpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.PrimaryWhite,
          },
          headerShadowVisible: true,
          headerTintColor: Colors.PrimaryBlack,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: '500',
            color: Colors.PrimaryBlack,
          },
        }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
