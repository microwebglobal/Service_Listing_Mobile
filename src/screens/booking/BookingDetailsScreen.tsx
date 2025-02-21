import {View, Text, SafeAreaView, Dimensions} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native';
import AppHeader from '../../components/AppHeader';
import {Screen} from '../../navigation/RootNavigation';
import {ServiceItem} from '../category/ServiceTypeScreen';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

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
  const tabBarHeight = useBottomTabBarHeight();

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
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="Booking Details" />
      <ScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: RPW(6), marginBottom: tabBarHeight}}>
        <View className="mt-5 flex-row justify-between items-center">
          <View className="space-y-1">
            <Text className="text-base text-dark">Booking ID</Text>
            <Text className="text-base text-primary font-medium">
              {booking.booking_id}
            </Text>
          </View>
          <View className="items-end space-y-1">
            <Text className="text-base text-dark">Status</Text>
            <Text className="text-base text-primary font-medium">
              {booking.status === 'payment_pending' ? 'Pending'  : '' }
            </Text>
          </View>
        </View>

        <View className="my-4 h-0.5 bg-lightGrey" />
        <View className="my-2">
          <Text className="mb-2 text-base text-black font-medium">
            Service Details
          </Text>

          {booking.BookingItems.map((bookingItem: BookingItem, index: number) =>
            bookingItem.serviceItem ? (
              <View
                key={index}
                className="my-2 flex-row justify-between items-center">
                <View>
                  <Text className="text-base text-black">
                    {bookingItem.serviceItem.name}
                  </Text>
                  <Text className="text-sm text-dark">
                    {'Quantity: '}
                    {bookingItem.quantity}
                  </Text>
                </View>
                <Text className="text-base text-primary">
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

        <View className="my-2">
          <Text className="text-base text-black font-medium">Schedule</Text>
          <View className="mt-4 mb-2 p-2 bg-lightGrey rounded-lg">
            <View className="mb-1 flex-row justify-between items-center">
              <Text className="text-base text-dark">Date</Text>
              <Text className="text-base text-black">
                {booking.booking_date}
              </Text>
            </View>
            <View className="mb-1 flex-row justify-between items-center">
              <Text className="text-base text-dark">Start Time</Text>
              <Text className="text-base text-black">
                {convertTo12HourFormat(booking.start_time)}
              </Text>
            </View>
            <View className="mb-1 flex-row justify-between items-center">
              <Text className="text-base text-dark">Payment Status</Text>
              <Text className="text-base text-black">0 minutes</Text>
            </View>
          </View>
        </View>

        <View className="my-2">
          <Text className="text-base text-black font-medium">
            Service Location
          </Text>
          <View className="mt-4 mb-2 p-2 bg-lightGrey rounded-lg">
            <Text className="text-base text-black">
              {booking.service_address}
            </Text>
          </View>
        </View>

        <View className="my-2">
          <Text className="text-base text-black font-medium">
            Payment Details
          </Text>
          <View className="my-4 p-2 bg-lightGrey rounded-lg">
            <View className="mb-1 flex-row justify-between items-center">
              <Text className="text-base text-dark">Subtotal</Text>
              <Text className="text-base text-black">
                {'₹'}
                {booking.BookingPayment.subtotal}
              </Text>
            </View>
            <View className="mb-1 flex-row justify-between items-center">
              <Text className="text-base text-dark">Tax (18%)</Text>
              <Text className="text-base text-black">
                {'₹'}
                {booking.BookingPayment.tax_amount}
              </Text>
            </View>
            <View className="my-3 h-0.5 bg-white" />
            <View className="mb-1 flex-row justify-between">
              <View>
                <Text className="text-base text-dark font-bold">Total</Text>
                <Text className="text-sm text-dark">
                  {'Payment Status: '}
                  {booking.BookingPayment.payment_status}
                </Text>
              </View>
              <Text className="text-base text-primary font-bold">
                {'₹'}
                {booking.BookingPayment.total_amount}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
