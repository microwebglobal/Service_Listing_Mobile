import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../utils/Colors';
import {TicketScreen} from '../screens/ticket/TicketScreen';
import {
  BookingNavigator,
  CategoryNavigator,
  HomeNavigator,
  ProfileNavigator,
} from './RootNavigator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.Primary,
        tabBarInactiveTintColor: Colors.Dark,
        headerShown: false,
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {fontSize: 20},
        tabBarStyle: styles.tabBarStyle,
        tabBarIconStyle: styles.tabBarIconStyle,

        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused, color}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Ticket') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Service') {
            iconName = focused ? 'duplicate' : 'duplicate-outline';
          } else if (route.name === 'Account') {
            return focused ? (
              <FontAwesome name={'user'} size={30} color={color} />
            ) : (
              <FontAwesome name={'user-o'} size={26} color={color} />
            );
          } else if (route.name === 'Booking') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          }

          return (
            <Ionicons
              name={iconName ?? 'defaultIcon'}
              size={30}
              color={color}
            />
          );
        },
      })}>
      <Tab.Screen name={'Home'} component={HomeNavigator} />
      <Tab.Screen name={'Ticket'} component={TicketScreen} />
      <Tab.Screen
        name={'Service'}
        component={CategoryNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen name={'Booking'} component={BookingNavigator} />
      <Tab.Screen name={'Account'} component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 65,
    position: 'absolute',
    backgroundColor: Colors.White,
    elevation: 2,
  },
  tabBarLabelStyle: {
    marginBottom: 3,
    fontWeight: 'normal',
    fontSize: 12,
    textAlign: 'center',
  },
  tabBarIconStyle: {
    marginVertical: 3,
  },
});
