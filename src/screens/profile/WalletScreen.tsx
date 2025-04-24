import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {styled} from 'nativewind';
import classNames from 'classnames';
import {Colors} from '../../utils/Colors';
import AppHeader from '../../components/AppHeader';
import {Screen} from '../../navigation/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const WalletScreen: Screen<'Wallet'> = ({route}) => {
  const {accBalance} = route.params;
  const isMinus = useState<boolean>(parseFloat(accBalance) < 0 ? true : false);

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="Wallet" />
      <StyledScrollView style={{paddingHorizontal: RPW(5)}}>
        <StyledView className="mt-5" />
        <LinearGradient
          style={{borderRadius: 15}}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={[Colors.primaryGreyHex, Colors.primaryBlackHex]}>
          <StyledTouchableOpacity className="rounded-2xl p-5">
            <StyledText className="text-white text-base font-PoppinsMedium">
              QProz cash
            </StyledText>
            <StyledView className="flex-row items-center justify-between">
              <StyledText className="mt-2 text-2xl text-white font-PoppinsSemiBold">
                {'₹'}{' '}
                <StyledText
                  className={classNames('', {
                    'text-error': isMinus,
                    'text-green': !isMinus,
                  })}>
                  {accBalance}
                </StyledText>
              </StyledText>
              <MaterialIcons
                name="arrow-forward-ios"
                size={25}
                color={Colors.White}
              />
            </StyledView>
          </StyledTouchableOpacity>
        </LinearGradient>

        <StyledView className="flex-1 justify-center mt-10">
          <StyledText className="text-black text-lg font-PoppinsMedium">
            Payment methods
          </StyledText>

          <StyledView className="mt-5 space-y-6">
            <StyledTouchableOpacity className="flex-row items-center space-x-5">
              <Ionicons name="cash-outline" size={25} color={Colors.Green} />
              <StyledText className="text-black text-base font-PoppinsRegular">
                Cash
              </StyledText>
            </StyledTouchableOpacity>

            <StyledView className="flex-row items-center justify-between">
              <StyledTouchableOpacity className="px-3 py-2 bg-lightGrey rounded-full">
                <StyledText className=" text-black text-base font-PoppinsRegular">
                  Add payment method
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
