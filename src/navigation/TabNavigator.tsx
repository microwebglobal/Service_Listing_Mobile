import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../utils/Colors';
import {CartScreen} from '../screens/cart/CartScreen';
import {NotificationScreen} from '../screens/notification/NotificationScreen';
import {TicketScreen} from '../screens/ticket/TicketScreen';
import {HomeScreen} from '../screens/home/HomeScreen';
import {ServiceNavigator} from './RootNavigator';

const screenHeight = Dimensions.get('window').height;

const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.Primary,
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
          } else if (route.name === 'ServiceNavigator') {
            iconName = focused ? 'duplicate' : 'duplicate-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Notification') {
            iconName = focused
              ? 'notifications'
              : 'notifications-outline';
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
      <Tab.Screen name={'Home'} component={HomeScreen} />
      <Tab.Screen name={'Ticket'} component={TicketScreen} />
      <Tab.Screen
        name={'ServiceNavigator'}
        component={ServiceNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen name={'Cart'} component={CartScreen} />
      <Tab.Screen name={'Notification'} component={NotificationScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: RPH(7),
    position: 'absolute',
    backgroundColor: Colors.White,
    elevation: 2,
  },
  tabBarLabelStyle: {
    marginBottom: 3,
    fontWeight: 'normal',
    fontSize: 14,
    textAlign: 'center',
  },
  tabBarIconStyle: {
    marginTop: RPH(1),
  },
});
