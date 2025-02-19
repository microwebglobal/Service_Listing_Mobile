import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {Screen} from '../../navigation/RootNavigation';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

export const BookingScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <View>
      <Text>Booking</Text>
    </View>
  );
};
