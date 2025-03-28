import {SafeAreaView} from 'react-native';
import React from 'react';
import {styled} from 'nativewind';
import LottieView from 'lottie-react-native';

const StyledSafeAreaView = styled(SafeAreaView);

export const LoadingIndicator = () => {
  return (
    <StyledSafeAreaView className="items-center justify-center flex-1 bg-white">
      <LottieView
        source={require('../assets/animations/loading.json')}
        autoPlay
        loop
        style={{width: '60%', height: '10%'}}
      />
    </StyledSafeAreaView>
  );
};
