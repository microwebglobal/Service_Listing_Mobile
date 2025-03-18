import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Employee} from './types';
import {ScrollView} from 'react-native';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {Screen} from '../../navigation/RootNavigation';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {ServiceItem} from '../category/ServiceTypeScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export interface BookingItem {
  id: number;
  booking_id: string;
  item_id: string;
  item_type: string;
  quantity: number;
  unit_price: string;
  special_price: number;
  total_price: number;
  serviceItem: ServiceItem;
  packageItem: PackageItem;
}

interface PackageItem {
  item_id: string;
  section_id: string;
  name: string;
  description: string;
  price: string;
  is_default: boolean;
  is_none_option: boolean;
  display_order: number;
  icon_url: string;
  PackageSection: PackageSection;
}

interface PackageSection {
  section_id: string;
  package_id: string;
  name: string;
  description: string;
  display_order: number;
  icon_url: string;
  Package: Package;
}

interface Package {
  package_id: string;
  type_id: string;
  name: string;
  description: string;
  duration_hours: number;
  duration_minutes: number;
  display_order: number;
  icon_url: string;
}

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const BookingDetailsScreen: Screen<'BookingDetails'> = ({route}) => {
  const {booking} = route.params;
  const [employee, setEmployee] = useState<Employee>();
  const [isChecked, setIsChecked] = useState<boolean>(false);

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

  function calculateDuration(startTime: string, endTime: string) {
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');

    return (
      (parseInt(endHour, 10) - parseInt(startHour, 10)) * 60 +
      Math.abs(parseInt(endMinute, 10) - parseInt(startMinute, 10))
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="Booking Details" />
      <ScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}>
        <View
          className="mt-5 flex-row justify-between items-center"
          style={{paddingHorizontal: RPW(4)}}>
          <View className="space-y-1">
            <Text className="text-base text-dark">Booking ID</Text>
            <Text className="text-base text-primary font-medium">
              {booking.booking_id}
            </Text>
          </View>
          <View className="items-end space-y-1">
            <Text className="text-base text-dark">Status</Text>
            <Text className="text-base text-primary font-medium first-letter:capitalize">
              {booking.status === 'payment_pending'
                ? 'Confirmed'
                : booking.status === 'in_progress'
                ? 'In Progress'
                : booking.status}
            </Text>
          </View>
        </View>

        <View className="my-4 h-1 bg-lightGrey" />

        {booking.provider && (
          <View className="mb-2">
            <View
              className="flex-row space-x-2 items-center"
              style={{paddingHorizontal: RPW(4)}}>
              <Feather name="user-check" size={18} color={Colors.Primary} />
              <Text className="text-base text-black font-medium">
                Provider Details
              </Text>
            </View>
            {booking.provider.business_type === 'business' ? (
              <>
                <View className="mt-3 mb-2" style={{paddingHorizontal: RPW(4)}}>
                  <View className="p-2 space-y-1">
                    <View className="flex-row items-center space-x-2">
                      <Text className="text-base text-dark">
                        Business Name:{' '}
                      </Text>
                      <Text className="text-base text-black">
                        {booking.provider.business_name}
                      </Text>
                    </View>
                    <View className="flex-row items-center space-x-2">
                      <Text className="text-base text-dark">Whatsapp:</Text>
                      <Text className="text-base text-black">
                        {booking.provider.whatsapp_number}
                      </Text>
                    </View>

                    <View>
                      <TouchableOpacity
                        className="flex-row space-x-2"
                        onPress={() => {
                          setIsChecked(!isChecked);
                        }}>
                        {booking.employee_id !== null && !isChecked && (
                          <Text className="text-base text-primary">
                            View more...
                          </Text>
                        )}
                      </TouchableOpacity>

                      {booking.employee_id !== null &&
                        employee !== undefined &&
                        isChecked && (
                          <View className="my-2">
                            <Text className="text-base text-black font-medium">
                              Employee Details
                            </Text>
                            <View className="mt-2 space-y-1">
                              <View className="flex-row items-center space-x-2">
                                <Text className="text-base text-dark">
                                  Name:{' '}
                                </Text>
                                <Text className="text-base text-black">
                                  {employee.User.name}
                                </Text>
                              </View>

                              <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center space-x-2">
                                  <Text className="text-base text-dark">
                                    Mobile:
                                  </Text>
                                  <Text className="text-base text-black">
                                    {employee.User.mobile}
                                  </Text>
                                </View>
                              </View>
                              <View className="flex-row items-center space-x-2">
                                <Text className="text-base text-dark">
                                  Email:
                                </Text>
                                <Text className="text-base text-black">
                                  {employee.User.email}
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                setIsChecked(!isChecked);
                              }}>
                              <Text className="mt-2 text-base text-primary">
                                View less
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                    </View>
                  </View>
                </View>
                <View className="h-1 bg-lightGrey" />
              </>
            ) : (
              <View className="mt-3 mb-2" style={{paddingHorizontal: RPW(4)}}>
                <View className="p-2 rounded-lg space-y-1 border border-primaryBlackRGBA">
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-base text-dark">Name: </Text>
                    <Text className="text-base text-black">
                      {booking.provider.User.name}
                    </Text>
                  </View>
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-base text-dark">Mobile:</Text>
                    <Text className="text-base text-black">
                      {booking.provider.User.mobile}
                    </Text>
                  </View>
                </View>
                <View className="h-1 bg-lightGrey" />
              </View>
            )}
          </View>
        )}

        <View className="my-2">
          <View
            className="flex-row space-x-2 items-center"
            style={{paddingHorizontal: RPW(4)}}>
            <Icon name="clock" size={16} color={Colors.Primary} />
            <Text className="text-base text-black font-medium">
              Service Schedule
            </Text>
          </View>
          <View className="mt-3 mb-2" style={{paddingHorizontal: RPW(4)}}>
            <View className="p-2 space-y-1">
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-dark">Date</Text>
                <Text className="text-base text-black">
                  {booking.booking_date}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-dark">Start Time</Text>
                <Text className="text-base text-black">
                  {convertTo12HourFormat(booking.start_time)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-dark">Duration</Text>
                <Text className="text-base text-black">
                  {calculateDuration(booking.start_time, booking.end_time)}{' '}
                  minutes
                </Text>
              </View>
            </View>
          </View>
          <View className="h-1 bg-lightGrey" />
        </View>

        <View className="my-2">
          <View
            className="flex-row space-x-1 items-center"
            style={{paddingHorizontal: RPW(4)}}>
            <SimpleLineIcons
              name="location-pin"
              size={18}
              color={Colors.Primary}
            />
            <Text className="text-base text-black font-medium">
              Service Location
            </Text>
          </View>
          <View className="mt-3 mb-2" style={{paddingHorizontal: RPW(4)}}>
            <View className="p-2 space-y-1">
              <View className="flex-row items-center space-x-2">
                <Text className="text-base text-dark">City:</Text>
                <Text className="text-base text-black">
                  {booking.service_address.split(',')[1]}
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Text className="text-base text-dark">Address:</Text>
                <Text className="text-base text-black">
                  {booking.service_address}
                </Text>
              </View>
              {booking.customer_notes !== '' && (
                <View className="flex-row items-center space-x-2 flex-wrap">
                  <Text className="text-base text-dark">Customer Notes:</Text>
                  <Text className="text-base text-black">
                    {booking.customer_notes}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View className="h-1 bg-lightGrey" />
        </View>

        <View className="my-2">
          <View
            className="flex-row space-x-2 items-baseline"
            style={{paddingHorizontal: RPW(4)}}>
            <FontAwesome5 name="tasks" size={16} color={Colors.Primary} />
            <Text className="mb-2 text-base text-black font-medium">
              Service Details
            </Text>
          </View>

          <View className="mt-1" style={{paddingHorizontal: RPW(4)}}>
            <View className="p-2 space-y-1">
              {booking.BookingItems.map(
                (bookingItem: BookingItem, index: number) =>
                  bookingItem.serviceItem ? (
                    <View
                      key={index}
                      className="mb-2 flex-row justify-between items-center">
                      <View>
                        <Text className="text-base text-black">
                          {bookingItem.serviceItem.name}
                        </Text>
                        <Text className="text-sm text-dark">
                          {'Quantity: '}
                          {bookingItem.quantity}
                        </Text>
                      </View>
                      <Text className="text-base text-black">
                        {'₹'}
                        {bookingItem.total_price}
                      </Text>
                    </View>
                  ) : (
                    <View
                      key={index}
                      className="my-2 flex-row justify-between items-center">
                      <View>
                        <Text className="text-base text-black">
                          {bookingItem.packageItem.name}
                        </Text>
                        <Text className="text-sm text-dark">
                          {'Quantity: 1'}
                        </Text>
                      </View>
                      <Text className="text-base text-primary">
                        {'₹'}
                        {bookingItem.packageItem.price}
                      </Text>
                    </View>
                  ),
              )}
            </View>
          </View>
          <View className="h-1 bg-lightGrey" />
        </View>

        <View className="mt-2" style={{paddingHorizontal: RPW(4)}}>
          <View className="flex-row items-center">
            <MaterialIcons
              name="attach-money"
              size={20}
              color={Colors.Primary}
            />
            <Text className="text-base text-black font-medium">
              Payment Details
            </Text>
          </View>
          <View className="mt-3 mb-2">
            <View className="p-2 space-y-1">
              <View className="mb-1 flex-row justify-between items-center">
                <Text className="text-base text-dark">Subtotal:</Text>
                <Text className="text-base text-black">
                  {'₹'}
                  {booking.BookingPayment.subtotal}
                </Text>
              </View>
              <View className="mb-1 flex-row justify-between items-center">
                <Text className="text-base text-dark">Tax (18%):</Text>
                <Text className="text-base text-black">
                  {'₹'}
                  {booking.BookingPayment.tax_amount}
                </Text>
              </View>
              <View className="mb-1 flex-row justify-between">
                <View>
                  <Text className="text-base text-dark font-bold">Total:</Text>
                </View>
                <Text className="text-base text-black font-bold">
                  {'₹'}
                  {booking.BookingPayment.total_amount}
                </Text>
              </View>
              <View className="mb-2 h-0.5 bg-lightGrey" />
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-dark">Paid by:</Text>
                <Text className="text-base text-black first-letter:capitalize">
                  {booking.BookingPayment.payment_method === 'net_banking'
                    ? 'Net Banking'
                    : booking.BookingPayment.payment_method}
                </Text>
              </View>
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-base text-dark">Payment Status:</Text>
                <Text className="text-base text-black first-letter:capitalize">
                  {booking.BookingPayment.payment_status}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="h-1 bg-lightGrey" />
      </ScrollView>
    </SafeAreaView>
  );
};
