import React, {useState} from 'react';
import {styled} from 'nativewind';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import {instance} from '../../api/instance';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {LoadingIndicator} from '../../components/LoadingIndicator';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);

export const PGScreen: Screen<'PGScreen'> = route => {
  const navigation = useNav();
  const {url, bookingId} = route.route.params;
  const [loading, setLoading] = useState(true);

  const handleError = (syntheticEvent: {nativeEvent: any}) => {
    const {nativeEvent} = syntheticEvent;
    navigation.goBack();
    showToast();
    console.log('Payment error: ', nativeEvent.description);
  };

  const handleHttpError = (syntheticEvent: {nativeEvent: any}) => {
    const {nativeEvent} = syntheticEvent;
    console.warn('HTTP error: ', nativeEvent.statusCode);
  };

  const handleNavigationChange = (navState: {url: string}) => {
    console.log('Current URL:', navState);
    if (navState.url !== 'about:blank') {
      const merchantOrderId = navState.url.split('/transaction/')[1];
      console.log(merchantOrderId);
      if (merchantOrderId) {
        instance
          .post('/booking/payment/phone-pe/verify', {
            bookingId: bookingId,
            merchantOrderId: merchantOrderId,
          })
          .then(() => {
            navigation.navigate('TabNavigator' as any, {
              screen: 'Booking',
            });
          });
      }
    }
  };

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Payment Failure',
      text2: 'Place try again later',
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      {loading && (
        <StyledView>
          <LoadingIndicator />
        </StyledView>
      )}
      <WebView
        source={{uri: url}}
        style={{flex: 1}}
        onError={handleError}
        onHttpError={handleHttpError}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationChange}
      />
    </StyledSafeAreaView>
  );
};
