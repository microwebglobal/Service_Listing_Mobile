import {Screen, useNav} from '../../navigation/RootNavigation';
import {Dimensions, KeyboardAvoidingView, ScrollView, View} from 'react-native';
import React, {useEffect} from 'react';
import LottieView from 'lottie-react-native';
// import {useSelector} from 'react-redux';
// import {RootState} from '../../utils/state/store';

export const SplashScreen: Screen<'Splash'> = () => {
  const navigation = useNav();
  // const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (false) {
      navigation.navigate('SignIn');
    } else {
      navigation.navigate('Onboarding');
    }
  }, [navigation]);

  // Get screen dimension
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // RPH and RPW are functions to set responsive width and height
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
