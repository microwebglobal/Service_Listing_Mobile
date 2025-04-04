import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {styled} from 'nativewind';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import LottieView from 'lottie-react-native';
import {Button} from '../../components/rneui';
// import AppHeader from '../../components/AppHeader';
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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
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
          <StyledView className="z-10 bg-primary w-5 h-5 rounded-full items-center justify-center absolute top-2 right-2">
            <StyledText className="text-sm text-white font-PoppinsRegular">
              {badgeCountRef.current}
            </StyledText>
          </StyledView>
        )}
      </>
    );
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      {/* <AppHeader back={false} title="Your Activities" historyIcon={true}  /> */}
      <StyledView className="flex-row items-center pt-8 pb-2 bg-white ">
        <StyledView className="basis-1/4" />
        <StyledView className="basis-1/2 items-center">
          <StyledText className="text-base text-black font-PoppinsMedium">
            {'My Activities'}
          </StyledText>
        </StyledView>
        <StyledView className="basis-1/4 items-center">
          <Button
            size="sm"
            title={'History'}
            onPress={() => navigation.navigate('BookingHistory')}
          />
        </StyledView>
      </StyledView>

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
          name={'Accepted'}
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
        className="flex-grow"
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: RPW(4), marginBottom: tabBarHeight}}>
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
              renderItem={({item}) => <BookingCard booking={item} />}
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

const Pending: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="confirmed" badgeCountRef={badgeCountRef} />;
};

const Assigned: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="assigned" badgeCountRef={badgeCountRef} />;
};

const InProgress: React.FC<TabProps> = ({badgeCountRef}) => {
  return <FetchBooking status="in_progress" badgeCountRef={badgeCountRef} />;
};
