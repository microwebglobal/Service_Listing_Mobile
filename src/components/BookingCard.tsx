import {View, Text, Image, TouchableOpacity, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SERVER_BASE} from '@env';
import {Colors} from '../utils/Colors';
import {instance} from '../api/instance';
import {useNav} from '../navigation/RootNavigation';
import Feather from 'react-native-vector-icons/Feather';
import {Booking, Employee} from '../screens/booking/types';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const BookingCard: React.FC<{booking: Booking}> = ({booking}) => {
  const navigation = useNav();
  const [employee, setEmployee] = useState<Employee>();

  useEffect(() => {
    booking.provider &&
      instance
        .get(`/providers/${booking.provider_id}/employees`)
        .then(res => {
          let employees: Array<Employee> = res.data;
          employees.forEach((emp: Employee) => {
            if (emp.employee_id === booking.employee_id) {
              setEmployee(emp);
            }
          });
        })
        .catch(function (e) {
          console.log(e.message);
        });
  }, [booking]);

  function convertTo12HourFormat(timeString: string) {
    const [hour, minute] = timeString.split(':');
    let formattedHour = parseInt(hour, 10);
    if (formattedHour > 12) {
      formattedHour -= 12;
      return `${formattedHour}:${minute} pm`;
    }
    return `${formattedHour}:${minute} am`;
  }

  const makeCall = (phone: string) => {
    let formattedPhoneNumber = `tel:${phone}`;
    Linking.openURL(formattedPhoneNumber);
  };

  return (
    <View className="my-2 mx-1 bg-white rounded-lg border border-lightGrey shadow-sm shadow-black">
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('BookingDetails', {booking});
        }}>
        <View className="p-3 rounded-lg">
          {booking.provider &&
            (booking.provider.business_type === 'business' &&
            employee !== undefined ? (
              <View>
                <View className="flex flex-row justify-between items-center">
                  <View className="flex flex-row justify-start space-x-3">
                    <View>
                      {employee?.User.photo === null ? (
                        <Image
                          source={require('../assets/app-images/emptyProfile.jpg')}
                          className="rounded-full w-12 h-12"
                        />
                      ) : (
                        <Image
                          source={{
                            uri: `${SERVER_BASE}${employee?.User.photo}`,
                          }}
                          className="rounded-full w-14 h-14"
                        />
                      )}
                    </View>
                    <View>
                      <Text className="text-base text-black font-medium">
                        {employee?.User.name}
                      </Text>
                      <View className="flex-row items-center space-x-1">
                        <AntDesign
                          name="star"
                          size={14}
                          color={Colors.Yellow}
                        />
                        <Text className="text-sm font-bold text-SecondaryYellow">
                          {'4.5'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="mr-1">
                    <TouchableOpacity
                      onPress={() => makeCall(employee?.User.mobile)}>
                      <Feather
                        name="phone-call"
                        size={20}
                        color={Colors.Primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : null)}

          <View className="my-2 flex-row justify-between">
            <View className="flex-row items-center">
              <Text className="text-sm text-dark">{'Booking ID: '}</Text>
              <Text className="text-sm text-black">{booking.booking_id}</Text>
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
              <Text className="text-sm text-black first-letter:capitalize">
                {booking.BookingPayment.payment_status === 'advance_only_paid'
                  ? 'Advance Paid'
                  : booking.BookingPayment.payment_status}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
