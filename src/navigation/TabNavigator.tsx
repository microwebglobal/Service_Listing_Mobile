import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
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

const screenHeight = Dimensions.get('window').height;

const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
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

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Ticket') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'CategoryTab') {
            iconName = focused ? 'duplicate' : 'duplicate-outline';
          } else if (route.name === 'ProfileTab') {
            return focused ? (
              <FontAwesome name={'user'} size={30} color={color} />
            ) : (
              <FontAwesome name={'user-o'} size={26} color={color} />
            );
          } else if (route.name === 'BookingTab') {
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
      <Tab.Screen name={'HomeTab'} component={HomeNavigator} />
      <Tab.Screen name={'Ticket'} component={TicketScreen} />
      <Tab.Screen
        name={'CategoryTab'}
        component={CategoryNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen name={'BookingTab'} component={BookingNavigator} />
      <Tab.Screen name={'ProfileTab'} component={ProfileNavigator} />
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
