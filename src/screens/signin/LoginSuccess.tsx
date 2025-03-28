import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {styled} from 'nativewind';
import {useAppSelector} from '../../redux';
import LottieView from 'lottie-react-native';
import {addressUpdate} from '../../redux/user/user.action';
import {Screen, useNav} from '../../navigation/RootNavigation';

const StyledView = styled(View);
const StyledText = styled(Text);

export const LoginSuccessScreen: Screen<'LoginSuccess'> = () => {
  const navigation = useNav();
  const user = useAppSelector(state => state.user.user);
  const addressList = useAppSelector(state => state.address.addresses);

  useEffect(() => {
    if (addressList.length > 0) {
      addressUpdate(addressList.filter(address => address !== null));
    }
    setTimeout(() => {
      navigation.navigate('TabNavigator');
    }, 3000);
  }, [addressList, navigation, user.id]);

  return (
    <StyledView className="items-center justify-center flex-1 bg-white">
      <LottieView
        source={require('../../assets/animations/animation.json')}
        autoPlay
        style={{width: '80%', height: '40%'}}
        speed={0.6}
      />
      <StyledView className="mx-10">
        <StyledText className="text-2xl text-dark font-semibold text-center">
          Congratulations!
        </StyledText>
        <StyledText className="mt-2 text-lg text-center">
          You have successfully logged in.
        </StyledText>
      </StyledView>
    </StyledView>
  );
};
