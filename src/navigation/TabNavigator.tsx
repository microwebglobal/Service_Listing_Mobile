import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from '../utils/Colors';
import {CartScreen} from '../screens/cart/CartScreen';
import {NotificationScreen} from '../screens/notification/NotificationScreen';
import {TicketScreen} from '../screens/ticket/TicketScreen';
import {HomeScreen} from '../screens/home/HomeScreen';
import {CategoryScreen} from '../screens/category/CategoryScreen';

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
        headerShown: true,
        headerTitleAlign: 'center',
        tabBarStyle: styles.tabBarStyle,
        tabBarIconStyle: styles.tabBarIconStyle,

        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused, color}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
            return <AntDesign name={iconName} size={30} color={color} />;
          } else if (route.name === 'Ticket') {
            iconName = focused ? 'ticket-outline' : 'ticket-outline';
          } else if (route.name === 'Category') {
            iconName = focused ? 'duplicate-outline' : 'duplicate-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'shoppingcart' : 'shoppingcart';
            return <AntDesign name={iconName} size={30} color={color} />;
          } else if (route.name === 'Notification') {
            iconName = focused
              ? 'notifications-outline'
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
      <Tab.Screen
        name={'Home'}
        component={HomeScreen}
        // options={{
        //   tabBarLabel: 'Home',
        // }}
      />
      <Tab.Screen
        name={'Ticket'}
        component={TicketScreen}
        // options={{
        //   tabBarLabel: 'Ticket',
        // }}
      />
      <Tab.Screen
        name={'Category'}
        component={CategoryScreen}
        // options={{
        //   tabBarLabel: 'Category',
        // }}
      />
      <Tab.Screen
        name={'Cart'}
        component={CartScreen}
        // options={{
        //   tabBarLabel: 'Cart',
        // }}
      />
      <Tab.Screen
        name={'Notification'}
        component={NotificationScreen}
        // options={{
        //   tabBarLabel: 'Notification',
        //   headerShown: false,
        // }}
      />
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
