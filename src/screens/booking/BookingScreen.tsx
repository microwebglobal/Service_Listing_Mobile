import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import {useNav} from '../../navigation/RootNavigation';
import {useFocusEffect} from '@react-navigation/native';
import {Booking, BookingCard} from '../../components/BookingCard';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

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
  const navigation = useNav();
  const pendingCountRef = useRef<number>(0);
  const assignedCountRef = useRef<number>(0);
  const inProgressCountRef = useRef<number>(0);
  const [bookings, setBookings] = useState<Array<Booking>>([]);

  pendingCountRef.current = bookings.filter((booking: Booking) => {
    return (
      booking.status === 'payment_pending' || booking.status === 'confirmed'
    );
  }).length;
  assignedCountRef.current = bookings.filter((booking: Booking) => {
    return booking.status === 'accepted';
  }).length;
  inProgressCountRef.current = bookings.filter((booking: Booking) => {
    return booking.status === 'in progress';
  }).length;

  useEffect(() => {
    instance
      .get('/customer/booking')
      .then(res => {
        setBookings(res.data);
      })
      .catch(function (e) {
        console.log(e.message);
      });
  }, []);

  const badgeCount = (badgeCountRef: any) => {
    return (
      <>
        {badgeCountRef.current > 0 && (
          <View className="z-10 bg-primary w-5 h-5 rounded-full items-center justify-center absolute top-2 right-2">
            <Text className="text-sm text-white font-normal">
              {badgeCountRef.current}
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* <AppHeader back={false} title="Your Activities" /> */}
      <View className="flex-row items-center py-5 bg-white ">
        <View className="basis-1/4" />
        <View className="basis-1/2 items-center">
          <Text className="text-lg text-black font-medium">
            {'My Activities'}
          </Text>
        </View>
        <View className="basis-1/4 items-center">
          <Button
            size="sm"
            title={'History'}
            onPress={() => navigation.navigate('BookingHistory')}
          />
        </View>
      </View>

      <Tab.Navigator
        initialRouteName="Pending"
        screenOptions={{
          tabBarLabelStyle: {
            fontFamily: 'Poppins',
            fontWeight: 'bold',
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
        <Tab.Screen
          name={'Pending'}
          children={() => <Pending badgeCountRef={pendingCountRef} />}
          options={{
            tabBarBadge: () => badgeCount(pendingCountRef),
          }}
        />
        <Tab.Screen
          name={'Assigned'}
          children={() => <Assigned badgeCountRef={assignedCountRef} />}
          options={{
            tabBarBadge: () => badgeCount(assignedCountRef),
          }}
        />
        <Tab.Screen
          name={'Ongoing'}
          children={() => <InProgress badgeCountRef={inProgressCountRef} />}
          options={{
            tabBarBadge: () => badgeCount(inProgressCountRef),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

interface FetchBookingProps {
  status: string;
  badgeCountRef: React.MutableRefObject<number>;
}

const FetchBooking: React.FC<FetchBookingProps> = ({status, badgeCountRef}) => {
  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const tabBarHeight = useBottomTabBarHeight();

  const fetchBookings = useCallback(async () => {
    await instance
      .get('/customer/booking')
      .then(res => {
        let temp = res.data.filter((booking: Booking) => {
          return status === 'confirmed'
            ? booking.status === status || booking.status === 'payment_pending'
            : booking.status === status;
        });
        setBookings(temp);
        badgeCountRef.current = temp.length;
      })
      .catch(function (e) {
        console.log(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [badgeCountRef, status]);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [fetchBookings]),
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
        <View className="mb-5">
          {bookings.length === 0 ? (
            <View className="justify-center" style={{height: RPH(50)}}>
              <View className="items-center">
                <Image
                  source={require('../../assets/app-images/no_booking.png')}
                  className="w-12 h-12"
                />
                <Text className="mt-1 text-base text-gray">
                  No booking found.
                </Text>
              </View>
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

interface TabProps {
  badgeCountRef: React.MutableRefObject<number>;
}

const Pending: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="confirmed" badgeCountRef={badgeCountRef} />;
};

const Assigned: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="assigned" badgeCountRef={badgeCountRef} />;
};

const InProgress: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="in_progress" badgeCountRef={badgeCountRef} />;
};
