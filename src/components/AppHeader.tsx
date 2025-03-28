import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { styled } from 'nativewind';
import {Colors} from '../utils/Colors';
import {useAppSelector} from '../redux';
import {useNav} from '../navigation/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Octicons from 'react-native-vector-icons/Octicons';

interface AppHeaderProps {
  back: boolean;
  title?: string;
  cartVisible?: boolean;
  historyIcon?: boolean;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

const AppHeader = ({back, title, cartVisible, historyIcon}: AppHeaderProps) => {
  const navigation = useNav();
  const localCart = useAppSelector(state => state.cart.cart) || [];

  return (
    <StyledSafeAreaView>
      <StyledView className="flex-row items-center py-5 bg-white shadow-sm shadow-black">
        <StyledView className="basis-1/6 items-center">
          {back && (
            <StyledTouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons
                name="arrow-back-ios-new"
                size={20}
                color={Colors.Black}
              />
            </StyledTouchableOpacity>
          )}
        </StyledView>
        {title && (
          <StyledView className="basis-2/3 items-center">
            <StyledText className="text-base text-black font-PoppinsMedium">
              {title}
            </StyledText>
          </StyledView>
        )}
        <StyledView className="basis-1/6 items-center">
          {cartVisible && (
            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate('SelectedItems');
              }}>
              <StyledView>
                {localCart?.length > 0 && (
                  <StyledView className="z-10 bg-primary w-5 h-5 rounded-full items-center justify-center absolute -top-2 -right-2">
                    <StyledText className="text-sm text-white font-normal">
                      {localCart?.length}
                    </StyledText>
                  </StyledView>
                )}

                <Ionicons
                  name={'cart-outline'}
                  size={26}
                  color={Colors.Black}
                />
              </StyledView>
            </StyledTouchableOpacity>
          )}
          {historyIcon && (
            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate('BookingHistory');
              }}>
              <StyledView>
                <Octicons name={'history'} size={24} color={Colors.Black} />
              </StyledView>
            </StyledTouchableOpacity>
          )}
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default AppHeader;
