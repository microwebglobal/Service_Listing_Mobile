import {Screen, useNav} from '../../navigation/RootNavigation';
import {Dimensions, KeyboardAvoidingView, ScrollView, View} from 'react-native';
import React, {useEffect} from 'react';
import LottieView from 'lottie-react-native';
import {refreshTokens} from '../../redux/user/user.action';

export const SplashScreen: Screen<'Splash'> = () => {
  const navigation = useNav();

  useEffect(() => {
    const handleToken = async () => {
      const result = await refreshTokens();

      if (result?.success) {
        setTimeout(() => {
          navigation.navigate('Tab');
        }, 1000);
      } else {
        setTimeout(() => {
          navigation.navigate('Onboarding');
        }, 1000);
      }
    };

    handleToken();
  }, [navigation]);

  // Get screen dimension
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const RPW = (percentage: number) => {
    return (percentage / 100) * screenWidth;
  };

  const RPH = (percentage: number) => {
    return (percentage / 100) * screenHeight;
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        className="flex bg-white">
        <View className="flex items-center justify-center h-screen ">
          <LottieView
            source={require('../../assets/animations/loading.json')}
            autoPlay
            loop
            style={{width: RPW(60), height: RPH(60)}}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
