import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {styled} from 'nativewind';
import {instance} from '../../api/instance';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import {Screen, useNav} from '../../navigation/RootNavigation';

const StyledView = styled(View);
const StyledText = styled(Text);

export const PaymentSuccessScreen: Screen<'PaymentSuccess'> = ({route}) => {
  const navigation = useNav();
  const {bookingId, merchantOrderId} = route.params;
  const previousScreen =
    navigation.getState().routes[navigation.getState().index - 2].name;

  useEffect(() => {
    instance
      .post('/booking/payment/phone-pe/verify', {
        bookingId: bookingId,
        merchantOrderId: merchantOrderId,
      })
      .then(response => {
        setTimeout(() => {
          if (previousScreen === 'BookingDetails') {
            navigation.navigate('BookingDetails' as any, {
              bookingId: bookingId,
            });
          } else {
            navigation.navigate('Receipt', {booking: response.data.booking});
          }
        }, 1000);
      })
      .catch(err => {
        console.error(err);
        showToast();
        navigation.navigate('TabNavigator' as any, {
          screen: 'Booking',
        });
      });
  }, [bookingId, merchantOrderId, navigation, previousScreen]);

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Payment Verification',
      text2: 'Payment Verification Failed',
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  return (
    <StyledView className="items-center justify-center flex-1 bg-white">
      <LottieView
        source={require('../../assets/animations/animation.json')}
        autoPlay
        style={{width: '80%', height: '40%'}}
        speed={0.6}
      />
      <StyledView className="mx-10">
        <StyledText className="text-xl text-black font-PoppinsMedium text-center">
          Payment Successful
        </StyledText>
        <StyledText className="mt-2 text-base text-center text-dark font-PoppinsRegular">
          Processing payment verification. Please wait a moment.
        </StyledText>
      </StyledView>
    </StyledView>
  );
};
