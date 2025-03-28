import {Screen, useNav} from '../../navigation/RootNavigation';
import {SafeAreaView, View} from 'react-native';
import React, {useEffect} from 'react';
import {styled} from 'nativewind';
import LottieView from 'lottie-react-native';
import {refreshTokens} from '../../redux/user/user.action';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);

export const SplashScreen: Screen<'Splash'> = () => {
  const navigation = useNav();

  useEffect(() => {
    const handleToken = async () => {
      const result = await refreshTokens();

      if (result?.success) {
        setTimeout(() => {
          navigation.navigate('TabNavigator');
        }, 1000);
      } else {
        setTimeout(() => {
          navigation.navigate('Onboarding');
        }, 1000);
      }
    };

    handleToken();
  }, [navigation]);

  return (
    <StyledSafeAreaView className="flex bg-white">
      <StyledView className="flex items-center justify-center h-screen ">
        <LottieView
          source={require('../../assets/animations/loading.json')}
          autoPlay
          loop
          style={{width: '60%', height: '20%'}}
        />
      </StyledView>
    </StyledSafeAreaView>
  );
};
