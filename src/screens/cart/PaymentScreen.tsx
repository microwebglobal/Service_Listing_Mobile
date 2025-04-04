import {
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {styled} from 'nativewind';
import classNames from 'classnames';
import {CheckBox} from '@rneui/themed';
import {Booking} from '../booking/types';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import AppHeader from '../../components/AppHeader';
import {useNav} from '../../navigation/RootNavigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

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
      <StyledTouchableOpacity
        key={index}
        onPress={() => {
          //   setPaymentMethod(method);
          setIndex(index);
        }}>
        <StyledView className="flex-row border-0 rounded-lg items-center">
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
          <StyledText className="ml-3 text-base text-black font-PoppinsRegular">
            <StyledText className="first-letter:capitalize">
              {method}
            </StyledText>
          </StyledText>
        </StyledView>
      </StyledTouchableOpacity>
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}>
        <AppHeader back={true} title={'Payment'} />
        <StyledView className="flex-1 my-5" style={{marginHorizontal: RPW(6)}}>
          <StyledText className="text-lg text-center font-PoppinsMedium text-black first-letter:capitalize">
            {'Choose payment method'}
          </StyledText>
          <StyledView className="my-5 p-3 bg-lightGrey rounded-lg space-y-2">
            <StyledView className="flex-row justify-between">
              <StyledText className="text-base text-black font-PoppinsRegular">
                {'Subtotal'}
              </StyledText>
              <StyledText className="text-base text-black font-PoppinsRegular">
                {' ₹'}
                {amount}
              </StyledText>
            </StyledView>
            <StyledView className="flex-row justify-between">
              <StyledText className="text-base text-black font-PoppinsRegular">
                {'Tax (18%)'}
              </StyledText>
              <StyledText className="text-base text-black font-PoppinsRegular">
                {' ₹'}
                {booking?.BookingPayment.tax_amount}
              </StyledText>
            </StyledView>
            <StyledView className="flex-row justify-between">
              <StyledText className="text-base text-black font-PoppinsSemiBold">
                {'Total'}
              </StyledText>
              <StyledText className="text-base text-black font-PoppinsSemiBold">
                {' ₹'}
                {booking?.BookingPayment.total_amount}
              </StyledText>
            </StyledView>
            {booking &&
              parseInt(booking.BookingPayment.advance_payment, 10) !== 0 && (
                <StyledView className="flex-row justify-between">
                  <StyledText className="text-base text-black font-PoppinsSemiBold">
                    {'Advance Amount'}
                  </StyledText>
                  <StyledText className="text-base text-black font-PoppinsSemiBold">
                    {' ₹'}
                    {booking?.BookingPayment.advance_payment}
                  </StyledText>
                </StyledView>
              )}
          </StyledView>

          {booking &&
            parseInt(booking.BookingPayment.advance_payment, 10) !== 0 &&
            paymentType === 'advance' && (
              <StyledView className="flex-row items-center mb-2 space-x-2">
                <AntDesign
                  name="exclamationcircleo"
                  size={18}
                  color={Colors.Error}
                />
                <StyledText className="flex-1 text-sm text-error font-PoppinsRegular">
                  {`You should pay the remaining ${(
                    parseFloat(booking.BookingPayment.total_amount) -
                    parseFloat(booking.BookingPayment.advance_payment)
                  ).toFixed(2)} after completing the service.`}
                </StyledText>
              </StyledView>
            )}

          {booking &&
            parseInt(booking.BookingPayment.advance_payment, 10) !== 0 && (
              <StyledView className="mb-2 flex-row space-x-5 justify-center">
                <StyledTouchableOpacity
                  className={classNames(
                    `p-3 rounded-lg ${
                      paymentType === 'advance' ? 'bg-primary' : 'bg-lightGrey'
                    }`,
                  )}
                  onPress={() => {
                    setPaymentType('advance');
                  }}>
                  <StyledText
                    className={classNames(
                      `text-sm font-PoppinsMedium ${
                        paymentType === 'advance' ? 'text-white' : 'text-black'
                      }`,
                    )}>
                    Pay Advanced Only
                  </StyledText>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                  className={classNames(
                    `p-3 rounded-lg ${
                      paymentType === 'full' ? 'bg-primary' : 'bg-lightGrey'
                    }`,
                  )}
                  onPress={() => {
                    setPaymentType('full');
                  }}>
                  <StyledText
                    className={classNames(
                      `text-sm font-PoppinsMedium ${
                        paymentType === 'full' ? 'text-white' : 'text-black'
                      }`,
                    )}>
                    Pay Full Amount
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
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
            <StyledView className="bg-white border border-lightGrey shadow-sm shadow-black p-3 rounded-lg">
              <StyledView>
                <StyledText className="text-lg text-black font-PoppinsMedium">
                  Payment Information
                </StyledText>
                <StyledText className="my-2 text-base text-black font-PoppinsRegular">
                  Please upload the payment slip after completing the payment.
                </StyledText>
                <StyledText className="mb-2 text-base text-black font-PoppinsMedium">
                  {'Bank Details: '}
                </StyledText>
                <StyledView className="flex-row mb-1">
                  <StyledText className="text-sm text-black font-PoppinsMedium">
                    {'Account No: '}
                  </StyledText>
                  <StyledText className="text-sm text-black font-PoppinsRegular">
                    123456789
                  </StyledText>
                </StyledView>
                <StyledView className="flex-row mb-1">
                  <StyledText className="text-sm text-black font-PoppinsMedium">
                    {'Name: '}
                  </StyledText>
                  <StyledText className="text-sm text-black font-PoppinsRegular">
                    ABC
                  </StyledText>
                </StyledView>
                <StyledView className="flex-row mb-1">
                  <StyledText className="text-sm text-black font-PoppinsMedium">
                    {'Branch: '}
                  </StyledText>
                  <StyledText className="text-sm text-black font-PoppinsRegular">
                    Main Street SWIFT
                  </StyledText>
                </StyledView>
                <StyledView className="flex-row mb-1">
                  <StyledText className="text-sm text-black font-PoppinsMedium">
                    {'Code: '}
                  </StyledText>
                  <StyledText className="text-sm text-black">
                    ABCD1234
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>
          )}

          <StyledView className="my-8">
            <Button
              loading={loading}
              primary
              title="Confirm cash payment"
              onPress={() => {
                submit();
              }}
            />
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
