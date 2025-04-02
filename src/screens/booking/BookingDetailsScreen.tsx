import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
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
import {Screen, useNav} from '../../navigation/RootNavigation';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {ServiceItem} from '../category/ServiceTypeScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {styled} from 'nativewind';
import {Dialog} from '@rneui/base';

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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const BookingDetailsScreen: Screen<'BookingDetails'> = ({route}) => {
  const navigation = useNav();
  const {booking} = route.params;
  const [employee, setEmployee] = useState<Employee>();
  const [visible, setVisible] = useState<boolean>(false);
  const [penaltyAmount, setPenaltyAmount] = useState<string>('');
  // const [isChecked, setIsChecked] = useState<boolean>(false);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const CancelBooking = async () => {
    await instance
      .put(`/booking/cancel/confirm/${booking.booking_id}`, {
        penalty: penaltyAmount,
      })
      .then(() => {
        toggleDialog();
        navigation.goBack();
      });
  };

  const checkPenaltyAmount = async () => {
    await instance
      .get(`/booking/cancel/${booking.booking_id}`)
      .then(res => {
        setPenaltyAmount(res.data.penalty);
      })
      .catch(function (e) {
        console.log(e.message);
      });
  };

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
    <StyledSafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="Booking Details" />
      <StyledScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}>
        {booking.status === 'completed' && (
          <>
            <StyledView
              className="my-6 flex-row justify-start items-center"
              style={{paddingHorizontal: RPW(4)}}>
              <StyledImage
                source={require('../../assets/app-images/task_complete.png')}
                className="w-16 h-16"
              />
              <StyledView>
                <StyledText className="text-lg text-black font-medium">
                  Job Complete
                </StyledText>
                <StyledText className="text-base text-dark">
                  Thanks for taking service from us.
                </StyledText>
              </StyledView>
            </StyledView>
          </>
        )}

        {booking.status === 'cancelled' && (
          <>
            <StyledView
              className="my-6 flex-row justify-start items-center space-x-5"
              style={{paddingHorizontal: RPW(4)}}>
              <StyledImage
                source={require('../../assets/app-images/task_cancel.png')}
                className="w-12 h-12"
              />
              <StyledView>
                <StyledText className="text-lg text-black font-medium">
                  Booking cancelled
                </StyledText>
                <StyledText className="text-base text-dark">
                  We hope to see you again in the future.
                </StyledText>
              </StyledView>
            </StyledView>
          </>
        )}

        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <>
            <StyledView
              className="my-5 flex-row justify-between items-center"
              style={{paddingHorizontal: RPW(4)}}>
              <StyledView className="space-y-1">
                <StyledView className="flex-row items-center space-x-1">
                  <StyledText className="text-base text-dark">
                    Booking ID:
                  </StyledText>
                  <StyledText className="text-base text-black font-medium">
                    {booking.booking_id}
                  </StyledText>
                </StyledView>
                <StyledView className="flex-row items-center space-x-1">
                  <StyledText className="text-base text-dark">
                    Booking status:
                  </StyledText>
                  <StyledText className="text-base text-primary font-medium first-letter:capitalize">
                    {booking.status === 'payment_pending'
                      ? 'Confirmed'
                      : booking.status === 'in_progress'
                      ? 'In Progress'
                      : booking.status}
                  </StyledText>
                </StyledView>
                <StyledView className="flex-row items-center space-x-1">
                  <StyledText className="text-base text-dark">
                    Payment status:
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
                    <StyledText className="text-base text-black first-letter:capitalize">
                      {booking.BookingPayment.payment_status ===
                      'advance_only_paid'
                        ? 'Advance Paid'
                        : booking.BookingPayment.payment_status}
                    </StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>

              <StyledView>
                {(booking.status === 'payment_pending' ||
                  booking.status === 'confirmed' ||
                  booking.status === 'accepted' ||
                  booking.status === 'assigned' ||
                  booking.status === 'in_progress') && (
                  <StyledView>
                    <Button
                      size="sm"
                      title="Cancel"
                      onPress={() => {
                        toggleDialog();
                        checkPenaltyAmount();
                      }}
                    />
                  </StyledView>
                )}
              </StyledView>
            </StyledView>
          </>
        )}
        <StyledView className="h-1 bg-lightGrey" />

        {booking.provider && (
          <StyledView className="my-5">
            <StyledView
              className="flex-row space-x-2 items-center"
              style={{paddingHorizontal: RPW(4)}}>
              <Feather name="user-check" size={18} color={Colors.Primary} />
              <StyledText className="text-base text-black font-medium">
                Provider Details
              </StyledText>
            </StyledView>
            {booking.provider.business_type === 'business' ? (
              <>
                <StyledView
                  className="mt-3"
                  style={{paddingHorizontal: RPW(4)}}>
                  <StyledView className="space-y-1">
                    {/* <StyledView className="flex-row items-center space-x-2">
                      <Text className="text-base text-dark">
                        Business Name:{' '}
                      </Text>
                      <Text className="text-base text-black">
                        {booking.provider.business_name}
                      </Text>
                    </StyledView>
                    <StyledView className="flex-row items-center space-x-2">
                      <Text className="text-base text-dark">Whatsapp:</Text>
                      <Text className="text-base text-black">
                        {booking.provider.whatsapp_number}
                      </Text>
                    </StyledView> */}

                    <StyledView>
                      {/* <TouchableOpacity
                        className="flex-row space-x-2"
                        onPress={() => {
                          setIsChecked(!isChecked);
                        }}>
                        {booking.employee_id !== null && !isChecked && (
                          <Text className="text-base text-primary">
                            StyledView more...
                          </Text>
                        )}
                      </TouchableOpacity> */}

                      {booking.employee_id !== null &&
                        employee !== undefined && (
                          <StyledView>
                            <StyledView className="flex-row items-center space-x-4">
                              <StyledView>
                                {employee.User.photo !== null ? (
                                  <StyledImage
                                    source={{
                                      uri: `${SERVER_BASE}${booking.employee.User.photo}`,
                                    }}
                                    className="w-16 h-16"
                                  />
                                ) : (
                                  <StyledImage
                                    source={require('../../assets/app-images/emptyProfile.png')}
                                    className="w-16 h-16"
                                  />
                                )}
                              </StyledView>

                              <StyledView className="flex-1 space-y-1">
                                <StyledView className="flex-row items-center space-x-2">
                                  <StyledText className="text-base text-black">
                                    {employee.User.name}
                                  </StyledText>
                                </StyledView>
                                <StyledView className="flex-row items-center space-x-2">
                                  <StyledText className="text-base text-black">
                                    {booking.provider.business_name}
                                  </StyledText>
                                </StyledView>

                                <StyledView className="flex-row items-center justify-between">
                                  <StyledView>
                                    <StyledText className="text-base text-dark">
                                      {employee.User.mobile}
                                    </StyledText>
                                  </StyledView>
                                  <StyledView className="mr-1">
                                    <StyledTouchableOpacity
                                      onPress={() =>
                                        makeCall(employee.User.mobile)
                                      }>
                                      <Feather
                                        name="phone-call"
                                        size={20}
                                        color={Colors.Primary}
                                      />
                                    </StyledTouchableOpacity>
                                  </StyledView>
                                </StyledView>
                              </StyledView>
                            </StyledView>
                            {/* <TouchableOpacity
                              onPress={() => {
                                setIsChecked(!isChecked);
                              }}>
                              <Text className="mt-2 text-base text-primary">
                                StyledView less
                              </Text>
                            </TouchableOpacity> */}
                          </StyledView>
                        )}
                    </StyledView>
                  </StyledView>
                </StyledView>
              </>
            ) : (
              <StyledView
                className="mt-3 mb-2"
                style={{paddingHorizontal: RPW(4)}}>
                <StyledView className="p-2 rounded-lg space-y-1 border border-primaryBlackRGBA">
                  <StyledView className="flex-row items-center space-x-2">
                    <StyledText className="text-base text-dark">
                      Name:{' '}
                    </StyledText>
                    <StyledText className="text-base text-black">
                      {booking.provider.User.name}
                    </StyledText>
                  </StyledView>
                  <StyledView className="flex-row items-center space-x-2">
                    <StyledText className="text-base text-dark">
                      Mobile:
                    </StyledText>
                    <StyledText className="text-base text-black">
                      {booking.provider.User.mobile}
                    </StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>
            )}
          </StyledView>
        )}
        <StyledView className="h-1 bg-lightGrey" />

        <StyledView className="my-5">
          <StyledView className="space-y-3" style={{paddingHorizontal: RPW(4)}}>
            <StyledView className="flex-row items-baseline space-x-2">
              <Icon name="clock" size={16} color={Colors.Primary} />
              <StyledView>
                <StyledText className="text-base text-black">
                  {new Date(booking.booking_date).toLocaleString('en-us', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </StyledText>
                <StyledText className="text-base text-dark">
                  {'Started on '}
                  {new Date(booking.booking_date).toLocaleString('en-us', {
                    weekday: 'short',
                  })}
                  {', '}
                  {convertTo12HourFormat(booking.start_time)}
                  {' . Ended  on '}
                  {convertTo12HourFormat(booking.end_time)}
                </StyledText>
              </StyledView>
            </StyledView>

            <StyledView className="flex-row items-center space-x-2">
              <SimpleLineIcons
                name="location-pin"
                size={18}
                color={Colors.Primary}
              />
              <StyledText className="text-base text-black">
                {booking.service_address}
              </StyledText>
            </StyledView>

            {booking.customer_notes !== '' &&
              booking.customer_notes !== null && (
                <StyledView className="flex-row items-center space-x-2 flex-wrap">
                  <StyledView className="flex-row items-center space-x-2">
                    <AntDesign
                      name="filetext1"
                      size={20}
                      color={Colors.Primary}
                    />
                    <StyledText className="text-base text-black">
                      Special Note:
                    </StyledText>
                  </StyledView>
                  <StyledText className="pl-5 text-base text-dark">
                    {booking.customer_notes}
                  </StyledText>
                </StyledView>
              )}
          </StyledView>
        </StyledView>
        <StyledView className="h-1 bg-lightGrey" />

        <StyledView className="my-5">
          <StyledView
            className="flex-row space-x-2 items-baseline"
            style={{paddingHorizontal: RPW(4)}}>
            <FontAwesome5 name="tasks" size={16} color={Colors.Primary} />
            <StyledText className="mb-2 text-base text-black font-medium">
              Service Details
            </StyledText>
          </StyledView>

          <StyledView style={{paddingHorizontal: RPW(4)}}>
            <StyledView className="p-2 space-y-1">
              {booking.BookingItems.map(
                (bookingItem: BookingItem, index: number) =>
                  bookingItem.serviceItem ? (
                    <StyledView
                      key={index}
                      className="mb-1 flex-row justify-between items-center">
                      <StyledView className="flex-[0.9]">
                        <StyledText
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          className="text-base text-black">
                          {bookingItem.serviceItem.name}
                          <StyledText className="text-sm text-gray">
                            {'  '}
                            {'(x '}
                            {bookingItem.quantity}
                            {')'}
                          </StyledText>
                        </StyledText>
                      </StyledView>
                      <StyledText className="text-base text-black">
                        {'₹'}
                        {bookingItem.total_price}
                      </StyledText>
                    </StyledView>
                  ) : (
                    <StyledView
                      key={index}
                      className="my-2 flex-row justify-between items-center">
                      <StyledView>
                        <StyledText className="text-base text-black">
                          {bookingItem.packageItem.name}
                          <StyledText className="text-sm text-gray">
                            {'  '}
                            {'(x '}
                            {bookingItem.quantity}
                            {')'}
                          </StyledText>
                        </StyledText>
                      </StyledView>
                      <StyledText className="text-base text-black">
                        {'₹'}
                        {bookingItem.packageItem.price}
                      </StyledText>
                    </StyledView>
                  ),
              )}
            </StyledView>
          </StyledView>
        </StyledView>

        {booking.status !== 'cancelled' && (
          <>
            <StyledView className="h-1 bg-lightGrey" />
            <StyledView className="my-5">
              <StyledView
                className="flex-row items-center"
                style={{paddingHorizontal: RPW(4)}}>
                <MaterialIcons
                  name="attach-money"
                  size={20}
                  color={Colors.Primary}
                />
                <StyledText className="text-base text-black font-medium">
                  Payment Summary
                </StyledText>
              </StyledView>
              <StyledView style={{paddingHorizontal: RPW(4)}}>
                <StyledView className="my-3 p-2">
                  <StyledView className="mb-1 flex-row justify-between items-center">
                    <StyledText className="text-base text-dark">
                      Subtotal
                    </StyledText>
                    <StyledText className="text-base text-black">
                      {'₹'}
                      {booking.BookingPayment.subtotal}
                    </StyledText>
                  </StyledView>
                  <StyledView className="mb-1 flex-row justify-between items-center">
                    <StyledText className="text-base text-dark">
                      Taxes and Fee (18%)
                    </StyledText>
                    <StyledText className="text-base text-black">
                      {'₹'}
                      {booking.BookingPayment.tax_amount}
                    </StyledText>
                  </StyledView>
                  <StyledView className="mb-1 flex-row justify-between items-center">
                    <StyledText className="text-base text-dark">
                      Discount
                    </StyledText>
                    <StyledText className="text-base text-black">
                      {'₹'}
                      {booking.BookingPayment.discount_amount}
                    </StyledText>
                  </StyledView>
                  <StyledView className="mb-1 flex-row justify-between">
                    <StyledView>
                      <StyledText className="text-base text-black font-medium">
                        Amount paid
                      </StyledText>
                    </StyledView>
                    <StyledText className="text-base text-black font-medium">
                      {'₹'}
                      {booking.BookingPayment.advance_payment}
                    </StyledText>
                  </StyledView>
                  <StyledView>
                    <StyledText
                      numberOfLines={1}
                      ellipsizeMode="clip"
                      className="mt-2 h-3 border-dashed border-t border-gray"
                    />
                  </StyledView>
                  <StyledView className="mb-1 flex-row justify-between">
                    <StyledView>
                      <StyledText className="text-base text-black font-bold">
                        Total
                      </StyledText>
                    </StyledView>
                    <StyledText className="text-base text-black font-bold">
                      {'₹'}
                      {(
                        parseFloat(booking.BookingPayment.total_amount) -
                        parseFloat(booking.BookingPayment.advance_payment)
                      ).toFixed(2)}
                    </StyledText>
                  </StyledView>
                  <StyledView className="my-3 h-0.5 bg-lightGrey" />
                  <StyledView className="mb-1 flex-row items-center justify-between">
                    <StyledText className="text-base text-black font-medium">
                      Payment mode
                    </StyledText>
                    <StyledText className="text-base text-black first-letter:capitalize">
                      {booking.BookingPayment.payment_method === 'net_banking'
                        ? 'Net Banking'
                        : booking.BookingPayment.payment_method}
                    </StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>
            </StyledView>
          </>
        )}

        {booking.status === 'cancelled' && <StyledView className="mb-10" />}

        {/* Logout Dialog */}
        <Dialog
          isVisible={visible}
          onBackdropPress={toggleDialog}
          overlayStyle={styles.dialog}>
          <StyledText className="mb-5 text-base text-black font-PoppinsMedium">
            Are you sure you want to cancel this booking?
          </StyledText>
          <StyledText className="mb-3 text-sm text-black font-PoppinsRegular">
            No grace period exceeded penalty will not be apply Penalty
          </StyledText>
          <StyledView className="flex-row mb-5 items-center">
            <StyledText className="text-sm text-black font-PoppinsMedium">
              Penalty:{' '}
            </StyledText>
            <StyledText className="text-sm text-dark font-PoppinsMedium">
              {penaltyAmount}
            </StyledText>
          </StyledView>

          <StyledView className="space-y-5">
            <StyledView className="">
              <Button
                primary
                title="Confirm & Cancel"
                size="md"
                onPress={CancelBooking}
              />
            </StyledView>
            <StyledView className="">
              <Button title="Close" size="md" onPress={toggleDialog} />
            </StyledView>
          </StyledView>
        </Dialog>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

const styles = StyleSheet.create({
  dialog: {
    padding: 15,
    width: '90%',
    backgroundColor: Colors.White,
    borderRadius: 15,
  },
});
