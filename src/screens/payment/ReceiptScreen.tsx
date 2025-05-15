import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import {styled} from 'nativewind';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native';
import {Button} from '../../components/rneui';
import AppHeader from '../../components/AppHeader';
import {Screen, useNav} from '../../navigation/RootNavigation';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

export const ReceiptScreen: Screen<'Receipt'> = ({route}) => {
  const navigation = useNav();
  const {booking} = route.params;

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <AppHeader title="Payment Summary" back={false} />
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: RPW(4)}}>
        <StyledView className="my-5 bg-white rounded-lg p-5 shadow-md shadow-black">
          <StyledText className="mb-5 text-xl font-PoppinsMedium text-primary text-center">
            QProz
          </StyledText>

          <StyledView className="gap-2">
            <StyledView className="flex-row items-center justify-between">
              <StyledText className="text-sm text-black font-PoppinsRegular">
                Booking ID
              </StyledText>
              <StyledText className="text-sm text-black font-PoppinsRegular">
                {booking?.BookingPayment.booking_id}
              </StyledText>
            </StyledView>
            <StyledView className="flex-row items-center justify-between">
              <StyledText className="text-sm text-black font-PoppinsRegular">
                Transaction ID
              </StyledText>
              <StyledText className="text-sm text-black font-PoppinsRegular">
                {booking?.BookingPayment.transaction_id}
              </StyledText>
            </StyledView>
            <StyledView className="flex-row items-center justify-between">
              <StyledText className="text-sm text-black font-PoppinsRegular">
                Date
              </StyledText>
              <StyledText className="text-sm text-black font-PoppinsRegular">
                {booking?.BookingPayment.updated_at.split('T')[0]}
              </StyledText>
            </StyledView>
          </StyledView>

          <StyledView>
            <StyledView className="my-5">
              <StyledView className="mb-1 flex-row justify-between items-center">
                <StyledText className="text-base text-dark font-PoppinsRegular">
                  Subtotal
                </StyledText>
                <StyledText className="text-base text-black font-PoppinsRegular">
                  {'₹'}
                  {booking?.BookingPayment.subtotal}
                </StyledText>
              </StyledView>
              <StyledView className="mb-1 flex-row justify-between items-center">
                <StyledText className="text-base text-dark font-PoppinsRegular">
                  Taxes and Fee (18%)
                </StyledText>
                <StyledText className="text-base text-black font-PoppinsRegular">
                  {'₹'}
                  {booking?.BookingPayment.tax_amount}
                </StyledText>
              </StyledView>
              <StyledView className="mb-1 flex-row justify-between items-center">
                <StyledText className="text-base text-dark font-PoppinsRegular">
                  Discount
                </StyledText>
                <StyledText className="text-base text-black font-PoppinsRegular">
                  {'₹'}
                  {booking?.BookingPayment.discount_amount}
                </StyledText>
              </StyledView>
              <StyledView>
                <StyledText
                  numberOfLines={1}
                  ellipsizeMode="clip"
                  className="mt-2 h-3 border-dashed border-t border-gray font-PoppinsRegular"
                />
              </StyledView>
              <StyledView className="mb-1 flex-row justify-between">
                <StyledView>
                  <StyledText className="text-base text-black font-PoppinsSemiBold">
                    Total
                  </StyledText>
                </StyledView>
                <StyledText className="text-base text-black font-PoppinsSemiBold">
                  {'₹'}
                  {(
                    parseFloat(booking!.BookingPayment.total_amount) -
                    parseFloat(booking!.BookingPayment.advance_payment)
                  ).toFixed(2)}
                </StyledText>
              </StyledView>
              <StyledView className="my-3 h-0.5 bg-lightGrey" />
              <StyledView className="mb-1 flex-row items-center justify-between">
                <StyledText className="text-base text-black font-PoppinsRegular">
                  Payment mode
                </StyledText>
                <StyledText className="text-base text-black font-PoppinsRegular first-letter:capitalize">
                  {booking?.BookingPayment.payment_method === 'net_banking'
                    ? 'Net Banking'
                    : booking?.BookingPayment.payment_method}
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledView>

        <StyledView className="my-5">
          <Button
            primary
            title={'Close'}
            size="md"
            onPress={() =>
              navigation.navigate('TabNavigator' as any, {
                screen: 'Booking',
              })
            }
          />
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
