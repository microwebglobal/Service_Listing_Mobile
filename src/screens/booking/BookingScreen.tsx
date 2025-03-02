import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {Booking} from '../cart/SelectedItemsScreen';
import {BookingCard} from '../../components/BookingCard';
import {useFocusEffect} from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import AppHeader from '../../components/AppHeader';

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
  const pendingCountRef = useRef<number>(0);
  const confirmedCountRef = useRef<number>(0);
  const assignedCountRef = useRef<number>(0);
  const inProgressCountRef = useRef<number>(0);
  const completedCountRef = useRef<number>(0);
  const cancelledCountRef = useRef<number>(0);
  const refundedCountRef = useRef<number>(0);
  const [bookings, setBookings] = useState<Array<Booking>>([]);

  pendingCountRef.current = bookings.filter((booking: Booking) => {
    return booking.status === 'payment_pending';
  }).length;
  confirmedCountRef.current = bookings.filter((booking: Booking) => {
    return booking.status === 'confirmed';
  }).length;
  assignedCountRef.current = bookings.filter((booking: Booking) => {
    return booking.status === 'assigned';
  }).length;
  inProgressCountRef.current = bookings.filter((booking: Booking) => {
    return booking.status === 'in progress';
  }).length;
  completedCountRef.current = bookings.filter((booking: Booking) => {
    return booking.status === 'completed';
  }).length;
  cancelledCountRef.current = bookings.filter((booking: Booking) => {
    return booking.status === 'cancelled';
  }).length;
  refundedCountRef.current = bookings.filter((booking: Booking) => {
    return booking.status === 'refunded';
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
      <AppHeader back={false} title="Your Activities" />
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
          name={'Confirmed'}
          children={() => <Confirmed badgeCountRef={confirmedCountRef} />}
          options={{
            tabBarBadge: () => badgeCount(confirmedCountRef),
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
          name={'In Progress'}
          children={() => <InProgress badgeCountRef={inProgressCountRef} />}
          options={{
            tabBarBadge: () => badgeCount(inProgressCountRef),
          }}
        />
        <Tab.Screen
          name={'Completed'}
          children={() => <Completed badgeCountRef={completedCountRef} />}
          options={{
            tabBarBadge: () => badgeCount(completedCountRef),
          }}
        />
        <Tab.Screen
          name={'Cancelled'}
          children={() => <Cancelled badgeCountRef={cancelledCountRef} />}
          options={{
            tabBarBadge: () => badgeCount(cancelledCountRef),
          }}
        />
        <Tab.Screen
          name={'Refunded'}
          children={() => <Refunded badgeCountRef={refundedCountRef} />}
          options={{
            tabBarBadge: () => badgeCount(refundedCountRef),
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

  const fetchCartItems = useCallback(async () => {
    await instance
      .get('/customer/booking')
      .then(res => {
        let temp = res.data.filter((booking: Booking) => {
          return booking.status === status;
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
        <View className="mb-5">
          {bookings.length === 0 ? (
            <View className="justify-center" style={{height: RPH(50)}}>
              <Text className="mt-2 text-dark text-base text-center text-primaryGrey">
                {"You don't have any bookings"}
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

interface TabProps {
  badgeCountRef: React.MutableRefObject<number>;
}

const Pending: React.FC<TabProps> = ({badgeCountRef}) => {
  return (
    <FetchBooking status="payment_pending" badgeCountRef={badgeCountRef} />
  );
};

const Confirmed: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="confirmed" badgeCountRef={badgeCountRef} />;
};

const Assigned: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="assigned" badgeCountRef={badgeCountRef} />;
};

const InProgress: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="in progress" badgeCountRef={badgeCountRef} />;
};

const Completed: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="completed" badgeCountRef={badgeCountRef} />;
};

const Cancelled: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="cancelled" badgeCountRef={badgeCountRef} />;
};

const Refunded: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="refunded" badgeCountRef={badgeCountRef} />;
};
