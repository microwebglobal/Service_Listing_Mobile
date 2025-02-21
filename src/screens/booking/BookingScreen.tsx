import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {Booking} from '../cart/SelectedItemsScreen';
import {BookingCard} from '../../components/BookingCard';
import {useFocusEffect} from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const Tab = createMaterialTopTabNavigator();

export const BookingScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="my-2" />
      <Tab.Navigator
        initialRouteName="Pending"
        screenOptions={{
          tabBarLabelStyle: {
            fontFamily: 'Poppins',
            fontWeight: '500',
            fontSize: 16,
            letterSpacing: 0.5,
            textTransform: 'none',
          },
          tabBarPressOpacity: 0,
          tabBarPressColor: Colors.LightGrey,
        }}>
        <Tab.Screen name={'Pending'} component={Pending} />
        <Tab.Screen name={'Confirmed'} component={Confirmed} />
        <Tab.Screen name={'Assigned'} component={Assigned} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

// Pending Bookings
const Pending: React.FC = () => {
  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const [pendingBookings, setPendingBookings] = useState<Array<Booking>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const tabBarHeight = useBottomTabBarHeight();

  const fetchCartItems = useCallback(async () => {
    setIsLoading(true);
    await instance
      .get('/customer/booking')
      .then(res => {
        setBookings(res.data);

        let temp = res.data.filter((booking: Booking) => {
          return booking.status === 'payment_pending';
        });
        setPendingBookings(temp);
      })
      .catch(function (e) {
        console.log(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [fetchCartItems]),
  );

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color={Colors.Black} />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: RPW(4), marginBottom: tabBarHeight}}>
        <View className="my-5">
          {bookings.length === 0 ? (
            <View>
              <Text className="mt-2 text-sm text-center text-primaryGrey">
                {'no any Accepted booking'}
              </Text>
              <Text className="mt-2 text-sm text-center text-primaryGrey">
                {''}
              </Text>
            </View>
          ) : (
            <FlatList
              data={pendingBookings}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={booking => booking.booking_id}
              renderItem={({item}) => <BookingCard booking={item} />}
              ListFooterComponent={
                isLoading ? (
                  <ActivityIndicator size={'small'} color={Colors.Primary} />
                ) : null
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Confirmed Bookings
const Confirmed: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const tabBarHeight = useBottomTabBarHeight();

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color={Colors.Black} />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: RPW(4), marginBottom: tabBarHeight}}>
        <View className="my-5">
          {/* {bookings.length === 0 ? ( */}
          <View>
            <Text className="mt-2 text-sm text-center text-primaryGrey">
              {'No any Confirmed booking'}
            </Text>
            <Text className="mt-2 text-sm text-center text-primaryGrey">
              {''}
            </Text>
          </View>
          {/* ) : (
              <FlatList
                data={pendingBookings}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={booking => booking.booking_id}
                renderItem={({item}) => <BookingCard booking={item} />}
                ListFooterComponent={
                  isLoading ? (
                    <ActivityIndicator size={'small'} color={Colors.Primary} />
                  ) : null
                }
              />
            )} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Assigned Bookings
const Assigned: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const tabBarHeight = useBottomTabBarHeight();

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color={Colors.Black} />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: RPW(4), marginBottom: tabBarHeight}}>
        <View className="my-5">
          {/* {bookings.length === 0 ? ( */}
          <View>
            <Text className="mt-2 text-sm text-center text-primaryGrey">
              {'No any Assigned booking'}
            </Text>
            <Text className="mt-2 text-sm text-center text-primaryGrey">
              {''}
            </Text>
          </View>
          {/* ) : (
              <FlatList
                data={pendingBookings}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                keyExtractor={booking => booking.booking_id}
                renderItem={({item}) => <BookingCard booking={item} />}
                ListFooterComponent={
                  isLoading ? (
                    <ActivityIndicator size={'small'} color={Colors.Primary} />
                  ) : null
                }
              />
            )} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
