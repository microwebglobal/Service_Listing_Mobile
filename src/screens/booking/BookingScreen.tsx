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
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
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
            textTransform: 'capitalize',
          },
          tabBarPressOpacity: 0,
          tabBarPressColor: Colors.LightGrey,
          tabBarIndicatorStyle: {
            backgroundColor: Colors.Primary,
            height: 2,
          },
          tabBarScrollEnabled: true,
          tabBarItemStyle: {width: screenWidth / 3},
        }}>
        <Tab.Screen name={'Pending'} component={Pending} />
        <Tab.Screen name={'Confirmed'} component={Confirmed} />
        <Tab.Screen name={'Assigned'} component={Assigned} />
        <Tab.Screen name={'In Progress'} component={InProgress} />
        <Tab.Screen name={'Completed'} component={Completed} />
        <Tab.Screen name={'Cancelled'} component={Cancelled} />
        <Tab.Screen name={'Refunded'} component={Refunded} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

interface FetchBookingProps {
  status: string;
}

const FetchBooking: React.FC<FetchBookingProps> = ({status}) => {
  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const tabBarHeight = useBottomTabBarHeight();

  const fetchCartItems = useCallback(async () => {
    setIsLoading(true);
    await instance
      .get('/customer/booking')
      .then(res => {
        let temp = res.data.filter((booking: Booking) => {
          return booking.status === status;
        });
        setBookings(temp);
      })
      .catch(function (e) {
        console.log(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [status]);

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
            <View className="justify-center" style={{height: RPH(80)}}>
              <Text className="mt-2 text-dark text-sm text-center text-primaryGrey">
                {`No any ${status} booking`}
              </Text>
              <Text className="mt-2 text-sm text-center text-primaryGrey">
                {''}
              </Text>
            </View>
          ) : (
            <FlatList
              data={bookings}
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

const Pending: React.FC = () => {
  return <FetchBooking status="payment_pending" />;
};

const Confirmed: React.FC = () => {
  return <FetchBooking status="confirmed" />;
};

const Assigned: React.FC = () => {
  return <FetchBooking status="assigned" />;
};

const InProgress: React.FC = () => {
  return <FetchBooking status="in progress" />;
};

const Completed: React.FC = () => {
  return <FetchBooking status="completed" />;
};

const Cancelled: React.FC = () => {
  return <FetchBooking status="cancelled" />;
};

const Refunded: React.FC = () => {
  return <FetchBooking status="refunded" />;
};
