import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {} from 'react';
import {SERVER_BASE} from '@env';
import classNames from 'classnames';
import {useNav} from '../navigation/RootNavigation';
import { BookingItem } from '../screens/booking/BookingDetailsScreen';
import { BookingPayment } from '../screens/booking/types';

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
      <View className="my-1 mx-1 bg-white rounded-lg border border-lightGrey shadow-sm shadow-black">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('BookingDetails', {booking});
          }}>
          <View className="p-3 rounded-lg">
            <View className="">
              <View className="flex-row items-center space-x-4">
                <View className="bg-lightGrey rounded-lg">
                  {booking.BookingItems[0]?.serviceItem ? (
                    <Image
                      source={{
                        uri: `${SERVER_BASE}${booking.BookingItems[0].serviceItem.icon_url}`,
                      }}
                      className="w-12 h-12 rounded-lg"
                    />
                  ) : (
                    <Image
                      source={{
                        uri: `${SERVER_BASE}${booking.BookingItems[0].packageItem.icon_url}`,
                      }}
                      className="w-12 h-12 rounded-lg"
                    />
                  )}
                </View>
                <View>
                  <Text
                    numberOfLines={1}
                    className="text-base text-black font-medium">
                    Saloon for women
                  </Text>

                  <Text className="text-sm text-dark">
                    {new Date(booking.booking_date).toLocaleString('en-us', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    {' at '}
                    {convertTo12HourFormat(booking.start_time)}
                  </Text>
                </View>
              </View>

              <View className="mt-1 flex-row justify-between items-center">
                <Text className="text-sm text-black">Payment status</Text>
                <View
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
                  <Text className="text-sm text-black first-letter:capitalize">
                    {booking.BookingPayment.payment_status ===
                    'advance_only_paid'
                      ? 'Advance Paid'
                      : booking.BookingPayment.payment_status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    // Booking Card for cancelled, completed, refunded, rejected
    return (
      <View className="my-1 mx-1 bg-white rounded-lg border border-lightGrey shadow-sm shadow-black">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('BookingDetails', {booking});
          }}>
          <View className="p-3 rounded-lg">
            <View className="flex-row items-center space-x-4">
              <View className="bg-lightGrey rounded-lg">
                <Image
                  source={{
                    uri: `${SERVER_BASE}${booking.BookingItems[0].serviceItem.icon_url}`,
                  }}
                  className="w-12 h-12 rounded-lg"
                />
              </View>
              <View className="basis-3/4 space-y-1">
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-base text-black font-medium">
                  {booking.BookingItems[0].serviceItem.name}
                </Text>

                <View className="flex-row items-center">
                  <Text className="text-base text-dark first-letter:capitalize">
                    {booking.status}
                    {' . '}
                  </Text>
                  <Text className="text-base text-dark">
                    {new Date(booking.booking_date).toLocaleString('en-us', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
};
