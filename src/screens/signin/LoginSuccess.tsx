import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import LottieView from 'lottie-react-native';
import {useNav} from '../../navigation/RootNavigation';

export const LoginSuccessScreen = () => {
  const navigation = useNav();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Tab');
    }, 3000);
  }, [navigation]);

  return (
    <View className="items-center justify-center flex-1 bg-primaryWhite">
      <LottieView
        source={require('../../assets/animations/animation.json')}
        autoPlay
        style={{width: '80%', height: '40%'}}
        speed={0.6}
      />
      <View className="mx-10">
        <Text className="text-2xl font-semibold text-center">
          Congratulations!
        </Text>
        <Text className="mt-2 text-lg text-center">
          You have successfully logged in.
        </Text>
      </View>
    </View>
  );
};
