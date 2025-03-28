import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {SERVER_BASE} from '@env';
import {styled} from 'nativewind';
import classNames from 'classnames';
import {useNav} from '../navigation/RootNavigation';
import {BookingPayment} from '../screens/booking/types';
import {BookingItem} from '../screens/booking/BookingDetailsScreen';

export interface Booking {
  booking_id: string;
  user_id: number;
  provider_id: string;
  employee_id: number;
  city_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  service_address: string;
  customer_notes: string;
  BookingItems: Array<BookingItem>;
  BookingPayment: BookingPayment;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const BookingCard: React.FC<{booking: Booking}> = ({booking}) => {
  const navigation = useNav();

  function convertTo12HourFormat(timeString: string) {
    const [hour, minute] = timeString.split(':');
    let formattedHour = parseInt(hour, 10);
    if (formattedHour > 12) {
      formattedHour -= 12;
      return `${formattedHour}:${minute} PM`;
    }
    return `${formattedHour}:${minute} AM`;
  }

  if (
    booking.status === 'payment_pending' ||
    booking.status === 'confirmed' ||
    booking.status === 'accepted' ||
    booking.status === 'assigned' ||
    booking.status === 'in_progress'
  ) {
    return (
      <StyledView className="my-1 mx-1 bg-white rounded-lg border border-lightGrey shadow-sm shadow-black">
        <StyledTouchableOpacity
          onPress={() => {
            navigation.navigate('BookingDetails', {booking});
          }}>
          <StyledView className="p-3 rounded-lg">
            <StyledView className="">
              <StyledView className="flex-row items-center space-x-4">
                <StyledView className="bg-lightGrey rounded-lg">
                  {booking.BookingItems[0]?.serviceItem ? (
                    <StyledImage
                      source={{
                        uri: `${SERVER_BASE}${booking.BookingItems[0].serviceItem.icon_url}`,
                      }}
                      className="w-12 h-12 rounded-lg"
                    />
                  ) : (
                    <StyledImage
                      source={{
                        uri: `${SERVER_BASE}${booking.BookingItems[0].packageItem.icon_url}`,
                      }}
                      className="w-12 h-12 rounded-lg"
                    />
                  )}
                </StyledView>
                <StyledView>
                  <StyledText
                    numberOfLines={1}
                    className="text-base text-black font-medium">
                    Saloon for women
                  </StyledText>

                  <StyledText className="text-sm text-dark">
                    {new Date(booking.booking_date).toLocaleString('en-us', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    {' at '}
                    {convertTo12HourFormat(booking.start_time)}
                  </StyledText>
                </StyledView>
              </StyledView>

              <StyledView className="mt-1 flex-row justify-between items-center">
                <StyledText className="text-sm text-black">
                  Payment status
                </StyledText>
                <StyledView
                  className={classNames(
                    `px-2 , ${
                      booking.BookingPayment.payment_status === 'completed'
                        ? 'bg-lime-100 rounded-2xl'
                        : booking.BookingPayment.payment_status === 'pending'
                        ? 'bg-blue-100 rounded-2xl'
                        : booking.BookingPayment.payment_status ===
                          'advance_only_paid'
                        ? 'bg-yellow-200 rounded-2xl'
                        : 'bg-red-100'
                    }`,
                  )}>
                  <StyledText className="text-sm text-black first-letter:capitalize">
                    {booking.BookingPayment.payment_status ===
                    'advance_only_paid'
                      ? 'Advance Paid'
                      : booking.BookingPayment.payment_status}
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    );
  } else {
    // Booking Card for cancelled, completed, refunded, rejected
    return (
      <StyledView className="my-1 mx-1 bg-white rounded-lg border border-lightGrey shadow-sm shadow-black">
        <StyledTouchableOpacity
          onPress={() => {
            navigation.navigate('BookingDetails', {booking});
          }}>
          <StyledView className="p-3 rounded-lg">
            <StyledView className="flex-row items-center space-x-4">
              <StyledView className="bg-lightGrey rounded-lg">
                <StyledImage
                  source={{
                    uri: `${SERVER_BASE}${booking.BookingItems[0].serviceItem.icon_url}`,
                  }}
                  className="w-12 h-12 rounded-lg"
                />
              </StyledView>
              <StyledView className="basis-3/4 space-y-1">
                <StyledText
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-base text-black font-medium">
                  {booking.BookingItems[0].serviceItem.name}
                </StyledText>

                <StyledView className="flex-row items-center">
                  <StyledText className="text-base text-dark first-letter:capitalize">
                    {booking.status}
                    {' . '}
                  </StyledText>
                  <StyledText className="text-base text-dark">
                    {new Date(booking.booking_date).toLocaleString('en-us', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    );
  }
};
