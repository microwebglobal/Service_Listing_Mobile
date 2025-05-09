import React, {useState} from 'react';
import {styled} from 'nativewind';
import WebView from 'react-native-webview';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {LoadingIndicator} from '../../components/LoadingIndicator';

const StyledSafeAreaView = styled(SafeAreaView);

export const PGScreen: Screen<'PGScreen'> = route => {
  const navigation = useNav();
  const {url, bookingId, orderId} = route.route.params;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'FAILED' | 'SUCCESS'>();

  const handleError = (syntheticEvent: {nativeEvent: any}) => {
    const {nativeEvent} = syntheticEvent;
    if (status !== 'SUCCESS') {
      navigation.goBack();
      showToast();
      console.log('Payment error: ', nativeEvent);
    }
  };

  const handleNavigationChange = (event: any) => {
    console.log('\nCurrent URL:', event);
    if (event.url.includes('submit?status=FAILED')) {
      setStatus('FAILED');
    } else if (event.url.includes('submit?status=SUCCESS')) {
      setStatus('SUCCESS');
      setLoading(true);
      navigation.navigate('PaymentSuccess', {
        bookingId: bookingId,
        merchantOrderId: orderId,
      });
    }
  };

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Payment Failure',
      text2: 'Place try again later',
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <WebView
        source={{uri: url}}
        style={{flex: 1}}
        startInLoadingState
        onError={handleError}
        renderLoading={() => <LoadingIndicator />}
        onNavigationStateChange={handleNavigationChange}
      />
    </StyledSafeAreaView>
  );
};
