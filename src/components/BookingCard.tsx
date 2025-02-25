import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {useNav} from '../navigation/RootNavigation';
import {BookingItem} from '../screens/booking/BookingDetailsScreen';
import {SERVER_BASE} from '@env';

export const BookingCard: React.FC<{booking: any}> = ({booking}) => {
  const navigation = useNav();

  function convertTo12HourFormat(timeString: string) {
    const [hour, minute] = timeString.split(':');
    let formattedHour = parseInt(hour, 10);
    if (formattedHour > 12) {
      formattedHour -= 12;
      return `${formattedHour}:${minute} pm`;
    }
    return `${formattedHour}:${minute} am`;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('BookingDetails', {booking});
      }}>
      <View className="my-2 p-3 bg-white rounded-lg border-2 border-lightGrey">
        <View>
          {booking.BookingItems.map(
            (bookingItem: BookingItem, index: number) => (
              <View key={index}>
                {bookingItem.serviceItem ? (
                  <View className="flex-row items-center space-x-4 mb-2">
                    <View className="bg-lightGrey rounded-lg p-2 flex-row items-center">
                      <Image
                        source={{
                          uri: `${SERVER_BASE}${bookingItem.serviceItem.icon_url}`,
                        }}
                        style={{width: 40, height: 40}}
                      />
                    </View>
                    <Text className="text-base text-black font-medium">
                      {bookingItem.serviceItem.name}
                    </Text>
                  </View>
                ) : (
                  <>
                    <View className="flex-row items-center space-x-4 mb-2">
                      <View className="bg-lightGrey rounded-lg p-2 flex-row items-center">
                        <Image
                          source={{
                            uri: `${SERVER_BASE}${bookingItem.packageItem.icon_url}`,
                          }}
                          style={{width: 40, height: 40}}
                        />
                      </View>
                      <Text className="text-base text-black font-medium">
                        {bookingItem.packageItem.name}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            ),
          )}
        </View>

        <View className="my-2 flex-row justify-between">
          <View className="flex-row items-center">
            <Text className="text-sm text-dark">{'Booking ID: '}</Text>
            <Text className="text-sm text-gray">{booking.booking_id}</Text>
          </View>
          <View>
            <Text className="text-base text-primary font-medium">
              {'₹'}
              {booking.BookingPayment.total_amount}
            </Text>
          </View>
        </View>

        <View className="p-2 bg-lightGrey rounded-lg">
          <View className="mb-1 flex-row justify-between items-center">
            <Text className="text-sm text-dark">Date</Text>
            <Text className="text-sm text-black">{booking.booking_date}</Text>
          </View>
          <View className="mb-1 flex-row justify-between items-center">
            <Text className="text-sm text-dark">Start Time</Text>
            <Text className="text-sm text-black">
              {convertTo12HourFormat(booking.start_time)}
            </Text>
          </View>
          <View className="mb-1 flex-row justify-between items-center">
            <Text className="text-sm text-dark">Payment Status</Text>
            <Text className="text-sm text-black">
              {booking.BookingPayment.payment_status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
