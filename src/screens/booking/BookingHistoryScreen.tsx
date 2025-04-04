import {
  View,
  Text,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {styled} from 'nativewind';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {useFocusEffect} from '@react-navigation/native';
import {Booking, BookingCard} from '../../components/BookingCard';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LottieView from 'lottie-react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const Tab = createMaterialTopTabNavigator();

export const BookingHistoryScreen = () => {
  const completedCountRef = useRef<number>(0);
  const cancelledCountRef = useRef<number>(0);
  const refundedCountRef = useRef<number>(0);
  const [bookings, setBookings] = useState<Array<Booking>>([]);

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
          <StyledView className="z-10 bg-primary w-5 h-5 rounded-full items-center justify-center absolute top-2 right-2">
            <StyledText className="text-sm text-white font-PoppinsRegular">
              {badgeCountRef.current}
            </StyledText>
          </StyledView>
        )}
      </>
    );
  };

  const screenOptions: any = {
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
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="Booking History" />
      <Tab.Navigator initialRouteName="Completed" screenOptions={screenOptions}>
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
    </StyledSafeAreaView>
  );
};

interface FetchBookingProps {
  status: string;
  badgeCountRef: React.MutableRefObject<number>;
}

const FetchBooking: React.FC<FetchBookingProps> = ({status, badgeCountRef}) => {
  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBookings = useCallback(async () => {
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
      fetchBookings();
    }, [fetchBookings]),
  );

  const _renderBookings = (booking: Booking) => {
    return <BookingCard booking={booking} />;
  };

  if (isLoading) {
    return (
      <StyledView className="items-center justify-center flex-1 bg-white">
        <LottieView
          source={require('../../assets/animations/loading.json')}
          autoPlay
          loop
          style={{width: '60%', height: '10%'}}
        />
      </StyledView>
    );
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView
        className="flex-grow py-1"
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: RPW(4)}}>
        <StyledView className="mb-5">
          {bookings.length === 0 ? (
            <StyledView className="justify-center" style={{height: RPH(50)}}>
              <StyledView className="items-center">
                <StyledImage
                  source={require('../../assets/app-images/no_booking.png')}
                  className="w-12 h-12"
                />
                <StyledText className="mt-1 text-base text-gray font-PoppinsRegular">
                  No booking found.
                </StyledText>
              </StyledView>
            </StyledView>
          ) : (
            <FlatList
              data={bookings}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={booking => booking.booking_id}
              renderItem={({item}) => _renderBookings(item)}
              ListFooterComponent={
                isLoading ? (
                  <LottieView
                    source={require('../../assets/animations/loading.json')}
                    autoPlay
                    loop
                    style={{width: '60%', height: '10%'}}
                  />
                ) : null
              }
            />
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

interface TabProps {
  badgeCountRef: React.MutableRefObject<number>;
}

const Completed: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="completed" badgeCountRef={badgeCountRef} />;
};

const Cancelled: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="cancelled" badgeCountRef={badgeCountRef} />;
};

const Refunded: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="refunded" badgeCountRef={badgeCountRef} />;
};
