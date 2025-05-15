import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {SERVER_BASE} from '@env';
import {styled} from 'nativewind';
import classNames from 'classnames';
import {useNav} from '../navigation/RootNavigation';
import {convertTo12HourFormat} from '../utils/common';
import {Booking} from '../screens/booking/BookingDetailsScreen';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const BookingCard: React.FC<{booking: Booking}> = ({booking}) => {
  const navigation = useNav();

  return (
    <StyledView className="my-1 mx-1 bg-white rounded-lg border border-lightGrey shadow-sm shadow-black">
      <StyledTouchableOpacity
        onPress={() => {
          navigation.navigate('BookingDetails', {
            bookingId: booking.booking_id,
          });
        }}>
        <StyledView className="p-3 rounded-lg">
          <StyledView className="">
            <StyledView className="flex-row items-center space-x-4">
              <StyledView className="bg-lightGrey rounded-lg">
                {booking.BookingItems[0]?.serviceItem ? (
                  <StyledImage
                    source={{
                      uri: `${SERVER_BASE}${booking.BookingItems[0].serviceItem.icon_url}`,
                    }}
                    className="w-12 h-12 rounded-lg"
                  />
                ) : (
                  <StyledImage
                    source={{
                      uri: `${SERVER_BASE}${booking.BookingItems[0].packageItem.icon_url}`,
                    }}
                    className="w-12 h-12 rounded-lg"
                  />
                )}
              </StyledView>

              <StyledView>
                <StyledText
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-base text-black font-PoppinsMedium">
                  {booking.BookingItems[0].item_type === 'package_item'
                    ? booking.BookingItems[0].packageItem.name
                    : booking.BookingItems[0].serviceItem.name}
                </StyledText>

                {[
                  'payment_pending',
                  'confirmed',
                  'accepted',
                  'in_progress',
                  'assigned',
                ].some(status => booking.status === status) ? (
                  <StyledText className="text-sm text-dark font-PoppinsRegular">
                    {new Date(booking.booking_date).toLocaleString('en-us', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    {' at '}
                    {convertTo12HourFormat(booking.start_time)}
                  </StyledText>
                ) : (
                  <StyledView className="flex-row items-center">
                    <StyledText className="text-base text-dark font-PoppinsRegular first-letter:capitalize">
                      {booking.status}
                      {' . '}
                    </StyledText>
                    <StyledText className="text-base text-dark">
                      {new Date(booking.booking_date).toLocaleString('en-us', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </StyledText>
                  </StyledView>
                )}
              </StyledView>
            </StyledView>

            {[
              'payment_pending',
              'confirmed',
              'accepted',
              'in_progress',
              'assigned',
            ].some(status => booking.status === status) && (
              <StyledView className="mt-1 flex-row justify-between items-center">
                <StyledText className="text-sm text-black font-PoppinsRegular">
                  Payment status
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
                        ? 'bg-yellow-100 rounded-2xl'
                        : 'bg-red-100'
                    }`,
                  )}>
                  <StyledText className="text-sm text-black font-PoppinsRegular first-letter:capitalize">
                    {booking.BookingPayment.payment_status ===
                    'advance_only_paid'
                      ? 'Advance Paid'
                      : booking.BookingPayment.payment_status}
                  </StyledText>
                </StyledView>
              </StyledView>
            )}
          </StyledView>
        </StyledView>
      </StyledTouchableOpacity>
    </StyledView>
  );
};
