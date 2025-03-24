import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Employee} from './types';
import {SERVER_BASE} from '@env';
import classNames from 'classnames';
import {ScrollView} from 'react-native';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import AppHeader from '../../components/AppHeader';
import {Screen} from '../../navigation/RootNavigation';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {ServiceItem} from '../category/ServiceTypeScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
  // const [isChecked, setIsChecked] = useState<boolean>(false);

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
      return `${formattedHour}:${minute} PM`;
    }
    return `${formattedHour}:${minute} AM`;
  }

  // function calculateDuration(startTime: string, endTime: string) {
  //   const [startHour, startMinute] = startTime.split(':');
  //   const [endHour, endMinute] = endTime.split(':');

  //   return (
  //     (parseInt(endHour, 10) - parseInt(startHour, 10)) * 60 +
  //     Math.abs(parseInt(endMinute, 10) - parseInt(startMinute, 10))
  //   );
  // }

  const makeCall = (phone: string) => {
    let formattedPhoneNumber = `tel:${phone}`;
    Linking.openURL(formattedPhoneNumber);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="Booking Details" />
      <ScrollView className="flex-grow" showsVerticalScrollIndicator={false}>
        {booking.status === 'completed' && (
          <>
            <View
              className="my-6 flex-row justify-start items-center"
              style={{paddingHorizontal: RPW(4)}}>
              <Image
                source={require('../../assets/app-images/task_complete.png')}
                className="w-16 h-16"
              />
              <View>
                <Text className="text-lg text-black font-medium">
                  Job Complete
                </Text>
                <Text className="text-base text-dark">
                  Thanks for taking service from us.
                </Text>
              </View>
            </View>
          </>
        )}

        {booking.status === 'cancelled' && (
          <>
            <View
              className="my-6 flex-row justify-start items-center space-x-5"
              style={{paddingHorizontal: RPW(4)}}>
              <Image
                source={require('../../assets/app-images/task_cancel.png')}
                className="w-12 h-12"
              />
              <View>
                <Text className="text-lg text-black font-medium">
                  Booking cancelled
                </Text>
                <Text className="text-base text-dark">
                  We hope to see you again in the future.
                </Text>
              </View>
            </View>
          </>
        )}

        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <>
            <View
              className="my-5 flex-row justify-between items-center"
              style={{paddingHorizontal: RPW(4)}}>
              <View className="space-y-1">
                <View className="flex-row items-center space-x-1">
                  <Text className="text-base text-dark">Booking ID:</Text>
                  <Text className="text-base text-black font-medium">
                    {booking.booking_id}
                  </Text>
                </View>
                <View className="flex-row items-center space-x-1">
                  <Text className="text-base text-dark">Booking status:</Text>
                  <Text className="text-base text-primary font-medium first-letter:capitalize">
                    {booking.status === 'payment_pending'
                      ? 'Confirmed'
                      : booking.status === 'in_progress'
                      ? 'In Progress'
                      : booking.status}
                  </Text>
                </View>
                <View className="flex-row items-center space-x-1">
                  <Text className="text-base text-dark">Payment status:</Text>
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
                    <Text className="text-base text-black first-letter:capitalize">
                      {booking.BookingPayment.payment_status ===
                      'advance_only_paid'
                        ? 'Advance Paid'
                        : booking.BookingPayment.payment_status}
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                {(booking.status === 'payment_pending' ||
                  booking.status === 'confirmed' ||
                  booking.status === 'accepted' ||
                  booking.status === 'assigned' ||
                  booking.status === 'in_progress') && (
                  <View>
                    <Button size="sm" title="Cancel" />
                  </View>
                )}
              </View>
            </View>
          </>
        )}
        <View className="h-1 bg-lightGrey" />

        {booking.provider && (
          <View className="my-5">
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
                <View className="mt-3" style={{paddingHorizontal: RPW(4)}}>
                  <View className="space-y-1">
                    {/* <View className="flex-row items-center space-x-2">
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
                    </View> */}

                    <View>
                      {/* <TouchableOpacity
                        className="flex-row space-x-2"
                        onPress={() => {
                          setIsChecked(!isChecked);
                        }}>
                        {booking.employee_id !== null && !isChecked && (
                          <Text className="text-base text-primary">
                            View more...
                          </Text>
                        )}
                      </TouchableOpacity> */}

                      {booking.employee_id !== null &&
                        employee !== undefined && (
                          <View>
                            <View className="flex-row items-center space-x-4">
                              <View>
                                {employee.User.photo !== null ? (
                                  <Image
                                    source={{
                                      uri: `${SERVER_BASE}${booking.employee.User.photo}`,
                                    }}
                                    className="w-16 h-16"
                                  />
                                ) : (
                                  <Image
                                    source={require('../../assets/app-images/emptyProfile.png')}
                                    className="w-16 h-16"
                                  />
                                )}
                              </View>

                              <View className="flex-1 space-y-1">
                                <View className="flex-row items-center space-x-2">
                                  <Text className="text-base text-black">
                                    {employee.User.name}
                                  </Text>
                                </View>
                                <View className="flex-row items-center space-x-2">
                                  <Text className="text-base text-black">
                                    {booking.provider.business_name}
                                  </Text>
                                </View>

                                <View className="flex-row items-center justify-between">
                                  <View>
                                    <Text className="text-base text-dark">
                                      {employee.User.mobile}
                                    </Text>
                                  </View>
                                  <View className="mr-1">
                                    <TouchableOpacity
                                      onPress={() =>
                                        makeCall(employee.User.mobile)
                                      }>
                                      <Feather
                                        name="phone-call"
                                        size={20}
                                        color={Colors.Primary}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                            {/* <TouchableOpacity
                              onPress={() => {
                                setIsChecked(!isChecked);
                              }}>
                              <Text className="mt-2 text-base text-primary">
                                View less
                              </Text>
                            </TouchableOpacity> */}
                          </View>
                        )}
                    </View>
                  </View>
                </View>
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
              </View>
            )}
          </View>
        )}
        <View className="h-1 bg-lightGrey" />

        <View className="my-5">
          <View className="space-y-3" style={{paddingHorizontal: RPW(4)}}>
            <View className="flex-row items-baseline space-x-2">
              <Icon name="clock" size={16} color={Colors.Primary} />
              <View>
                <Text className="text-base text-black">
                  {new Date(booking.booking_date).toLocaleString('en-us', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
                <Text className="text-base text-dark">
                  {'Started on '}
                  {new Date(booking.booking_date).toLocaleString('en-us', {
                    weekday: 'short',
                  })}
                  {', '}
                  {convertTo12HourFormat(booking.start_time)}
                  {' . Ended  on '}
                  {convertTo12HourFormat(booking.end_time)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center space-x-2">
              <SimpleLineIcons
                name="location-pin"
                size={18}
                color={Colors.Primary}
              />
              <Text className="text-base text-black">
                {booking.service_address}
              </Text>
            </View>

            {booking.customer_notes !== '' &&
              booking.customer_notes !== null && (
                <View className="flex-row items-center space-x-2 flex-wrap">
                  <View className="flex-row items-center space-x-2">
                    <AntDesign
                      name="filetext1"
                      size={20}
                      color={Colors.Primary}
                    />
                    <Text className="text-base text-black">Special Note:</Text>
                  </View>
                  <Text className="pl-5 text-base text-dark">
                    {booking.customer_notes}
                  </Text>
                </View>
              )}
          </View>
        </View>
        <View className="h-1 bg-lightGrey" />

        <View className="my-5">
          <View
            className="flex-row space-x-2 items-baseline"
            style={{paddingHorizontal: RPW(4)}}>
            <FontAwesome5 name="tasks" size={16} color={Colors.Primary} />
            <Text className="mb-2 text-base text-black font-medium">
              Service Details
            </Text>
          </View>

          <View style={{paddingHorizontal: RPW(4)}}>
            <View className="p-2 space-y-1">
              {booking.BookingItems.map(
                (bookingItem: BookingItem, index: number) =>
                  bookingItem.serviceItem ? (
                    <View
                      key={index}
                      className="mb-1 flex-row justify-between items-center">
                      <View className="flex-[0.9]">
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          className="text-base text-black">
                          {bookingItem.serviceItem.name}
                          <Text className="text-sm text-gray">
                            {'  '}
                            {'(x '}
                            {bookingItem.quantity}
                            {')'}
                          </Text>
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
                          <Text className="text-sm text-gray">
                            {'  '}
                            {'(x '}
                            {bookingItem.quantity}
                            {')'}
                          </Text>
                        </Text>
                      </View>
                      <Text className="text-base text-black">
                        {'₹'}
                        {bookingItem.packageItem.price}
                      </Text>
                    </View>
                  ),
              )}
            </View>
          </View>
        </View>

        {booking.status !== 'cancelled' && (
          <>
            <View className="h-1 bg-lightGrey" />
            <View className="my-5">
              <View
                className="flex-row items-center"
                style={{paddingHorizontal: RPW(4)}}>
                <MaterialIcons
                  name="attach-money"
                  size={20}
                  color={Colors.Primary}
                />
                <Text className="text-base text-black font-medium">
                  Payment Summary
                </Text>
              </View>
              <View style={{paddingHorizontal: RPW(4)}}>
                <View className="my-3 p-2">
                  <View className="mb-1 flex-row justify-between items-center">
                    <Text className="text-base text-dark">Subtotal</Text>
                    <Text className="text-base text-black">
                      {'₹'}
                      {booking.BookingPayment.subtotal}
                    </Text>
                  </View>
                  <View className="mb-1 flex-row justify-between items-center">
                    <Text className="text-base text-dark">
                      Taxes and Fee (18%)
                    </Text>
                    <Text className="text-base text-black">
                      {'₹'}
                      {booking.BookingPayment.tax_amount}
                    </Text>
                  </View>
                  <View className="mb-1 flex-row justify-between items-center">
                    <Text className="text-base text-dark">Discount</Text>
                    <Text className="text-base text-black">
                      {'₹'}
                      {booking.BookingPayment.discount_amount}
                    </Text>
                  </View>
                  <View className="mb-1 flex-row justify-between">
                    <View>
                      <Text className="text-base text-black font-medium">
                        Amount paid
                      </Text>
                    </View>
                    <Text className="text-base text-black font-medium">
                      {'₹'}
                      {booking.BookingPayment.advance_payment}
                    </Text>
                  </View>
                  <View>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="clip"
                      className="text-lightGrey">
                      {
                        '-------------------------------------------------------------------------------------------------------'
                      }
                    </Text>
                  </View>
                  <View className="mb-1 flex-row justify-between">
                    <View>
                      <Text className="text-base text-black font-bold">
                        Total
                      </Text>
                    </View>
                    <Text className="text-base text-black font-bold">
                      {'₹'}
                      {(
                        parseFloat(booking.BookingPayment.total_amount) -
                        parseFloat(booking.BookingPayment.advance_payment)
                      ).toFixed(2)}
                    </Text>
                  </View>
                  <View className="my-3 h-0.5 bg-lightGrey" />
                  <View className="mb-1 flex-row items-center justify-between">
                    <Text className="text-base text-black font-medium">
                      Payment mode
                    </Text>
                    <Text className="text-base text-black first-letter:capitalize">
                      {booking.BookingPayment.payment_method === 'net_banking'
                        ? 'Net Banking'
                        : booking.BookingPayment.payment_method}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {booking.status === 'cancelled' && <View className="mb-10" />}
      </ScrollView>
    </SafeAreaView>
  );
};
