import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CheckBox} from '@rneui/themed';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import {Booking} from './SelectedItemsScreen';
import AppHeader from '../../components/AppHeader';
import {useNav} from '../../navigation/RootNavigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import classNames from 'classnames';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const PaymentScreen = ({route}: any) => {
  const {amount, bookingId} = route.params;
  const navigation = useNav();
  const paymentMethods = [
    'Pay online',
    'Bank Transfer',
    'Pay After Service Completed',
  ];
  //   const [paymentMethod, setPaymentMethod] = useState<string>();
  const [selectedIndex, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState<Booking>();
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<string>('full');

  useEffect(() => {
    instance
      .get(`/booking/${bookingId}`)
      .then(res => {
        setBooking(res.data);
      })
      .catch(function (e) {
        console.log(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [bookingId]);

  const submit = useCallback(async () => {
    setLoading(true);
    await instance
      // .post(`/booking/${bookingId}/complete-cash-payment`)
      .post('/book/payment', {
        bookingId: bookingId,
        paymentMethod:
          selectedIndex === 0
            ? 'card'
            : selectedIndex === 1
            ? 'net_banking'
            : 'cash',
        paymentType: paymentType,
      })
      .then(function () {
        navigation.navigate('TabNavigator');
      })
      .catch(function (e) {
        console.log(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [bookingId, navigation, paymentType, selectedIndex]);

  const renderPaymentOptions = (method: string, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          //   setPaymentMethod(method);
          setIndex(index);
        }}>
        <View className="flex-row border-0 rounded-lg items-center">
          <CheckBox
            checked={selectedIndex === index}
            onPress={() => setIndex(index)}
            checkedColor={Colors.Primary}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
          {method === 'Pay online' ? (
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={30}
              color={Colors.Dark}
            />
          ) : (
            <MaterialCommunityIcons
              name="wallet-outline"
              size={30}
              color={Colors.Dark}
            />
          )}
          <Text className="ml-3 text-base text-black">
            <Text className="first-letter:capitalize">{method}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color={Colors.Black} />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-grow" showsVerticalScrollIndicator={false}>
        <AppHeader back={true} title={'Payment'} />
        <View className="flex-1 my-5" style={{marginHorizontal: RPW(6)}}>
          <Text className="text-xl text-center font-semibold text-black first-letter:capitalize">
            {'Choose payment method'}
          </Text>
          <View className="my-5 p-3 bg-lightGrey rounded-lg space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-base text-black">{'Subtotal'}</Text>
              <Text className="text-base text-black">
                {' ₹'}
                {amount}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-base text-black">{'Tax (18%)'}</Text>
              <Text className="text-base text-black">
                {' ₹'}
                {booking?.BookingPayment.tax_amount}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-base text-black font-bold">{'Total'}</Text>
              <Text className="text-base text-black font-bold">
                {' ₹'}
                {booking?.BookingPayment.total_amount}
              </Text>
            </View>
            {booking &&
              parseInt(booking.BookingPayment.advance_payment, 10) !== 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-base text-black font-bold">
                    {'Advance Amount'}
                  </Text>
                  <Text className="text-base text-black font-bold">
                    {' ₹'}
                    {booking?.BookingPayment.advance_payment}
                  </Text>
                </View>
              )}
          </View>

          {booking &&
            parseInt(booking.BookingPayment.advance_payment, 10) !== 0 &&
            paymentType === 'advance' && (
              <View className="flex-row items-center mb-2 space-x-2">
                <AntDesign
                  name="exclamationcircleo"
                  size={18}
                  color={Colors.Error}
                />
                <Text className="text-sm text-error">
                  You should pay the remaining 560.84 after completing the
                  service.
                </Text>
              </View>
            )}

          {booking &&
            parseInt(booking.BookingPayment.advance_payment, 10) !== 0 && (
              <View className="mb-2 flex-row space-x-5 justify-center">
                <TouchableOpacity
                  className={classNames(
                    `p-3 rounded-lg ${
                      paymentType === 'advance' ? 'bg-primary' : 'bg-lightGrey'
                    }`,
                  )}
                  onPress={() => {
                    setPaymentType('advance');
                  }}>
                  <Text
                    className={classNames(
                      `text-base ${
                        paymentType === 'advance' ? 'text-white' : 'text-black'
                      }`,
                    )}>
                    Pay Advanced Only
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={classNames(
                    `p-3 rounded-lg ${
                      paymentType === 'full' ? 'bg-primary' : 'bg-lightGrey'
                    }`,
                  )}
                  onPress={() => {
                    setPaymentType('full');
                  }}>
                  <Text
                    className={classNames(
                      `text-base ${
                        paymentType === 'full' ? 'text-white' : 'text-black'
                      }`,
                    )}>
                    Pay Full Amount
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          {booking && parseInt(booking.BookingPayment.advance_payment, 10) !== 0
            ? paymentMethods
                .slice(0, 2)
                .map((method: string, index: number) => {
                  return renderPaymentOptions(method, index);
                })
            : paymentMethods.map((method: string, index: number) => {
                return renderPaymentOptions(method, index);
              })}

          {selectedIndex === 1 && (
            <View className="bg-white border border-lightGrey shadow-sm shadow-black p-3 rounded-lg">
              <View>
                <Text className="text-lg text-black">Payment Information</Text>
                <Text className="my-2 text-base text-black">
                  Please upload the payment slip after completing the payment.
                </Text>
                <Text className="text-base text-black font-bold">
                  {'Bank Details: '}
                </Text>
                <View className="flex-row mb-1">
                  <Text className="text-base text-black font-bold">
                    {'Account No: '}
                  </Text>
                  <Text className="text-base text-black">123456789</Text>
                </View>
                <View className="flex-row mb-1">
                  <Text className="text-base text-black font-bold">
                    {'Name: '}
                  </Text>
                  <Text className="text-base text-black">ABC</Text>
                </View>
                <View className="flex-row mb-1">
                  <Text className="text-base text-black font-bold">
                    {'Branch: '}
                  </Text>
                  <Text className="text-base text-black">
                    Main Street SWIFT
                  </Text>
                </View>
                <View className="flex-row mb-1">
                  <Text className="text-base text-black font-bold">
                    {'Code: '}
                  </Text>
                  <Text className="text-base text-black">ABCD1234</Text>
                </View>
              </View>
            </View>
          )}

          <View className="my-8">
            <Button
              loading={loading}
              primary
              title="Confirm cash payment"
              onPress={() => {
                submit();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
