import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {SERVER_BASE} from '@env';
import {styled} from 'nativewind';
import {useDispatch} from 'react-redux';
import {Colors} from '../../utils/Colors';
import {useAppSelector} from '../../redux';
import {Button} from '../../components/rneui';
import Toast from 'react-native-toast-message';
import AppHeader from '../../components/AppHeader';
import {useNav} from '../../navigation/RootNavigation';
import {removeItem} from '../../redux/cart/cart.slice';
import {ItemEntity} from '../../redux/cart/cart.entity';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

export const SelectedItemsScreen = () => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const LocalCart = useAppSelector((state: any) => state.cart.cart);
  let totalPrice = 0;

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Removed from selection',
      text2: 'Item has been removed from selection',
    });
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}>
        <AppHeader back={true} title={'Selected Services'} />
        <StyledView className="flex-1 mt-5" style={{marginHorizontal: RPW(6)}}>
          {(LocalCart === null || LocalCart?.length === 0) && (
            <StyledView
              className="flex-1 justify-center items-center"
              style={{height: RPH(70)}}>
              <StyledImage
                source={require('../../assets/app-images/cart.png')}
              />
              <StyledText className="mt-5 text-xl text-black text-center font-medium">
                Your cart is empty
              </StyledText>
              <StyledText className="mt-2 text-base text-dark text-center">
                {
                  'Once you add items from a service, your cart will appear here.'
                }
              </StyledText>

              <StyledView className="my-5">
                <Button
                  size="md"
                  title="Explore Services"
                  onPress={() => {
                    navigation.navigate('TabNavigator', {
                      screen: 'Service',
                    });
                  }}
                />
              </StyledView>
            </StyledView>
          )}

          {/* Render local cart items */}
          {LocalCart?.map((item: ItemEntity, index: number) => {
            totalPrice += item.price * item.quantity;
            return (
              <StyledView
                key={index}
                className="flex-row justify-between items-center mb-7">
                <StyledView className="flex-row basis-2/4 items-center space-x-4">
                  <StyledView className="ml-1 bg-lightGrey rounded-lg">
                    <StyledImage
                      className="w-12 h-12 rounded-md"
                      source={{uri: `${SERVER_BASE}${item.icon_url}`}}
                    />
                  </StyledView>
                  <StyledView>
                    <StyledText className="text-base text-black font-normal text-clip">
                      {item.name}
                    </StyledText>
                    <StyledText className="text-base text-gray font-normal">
                      {'Quantity: '}
                      {item.quantity}
                    </StyledText>
                  </StyledView>
                </StyledView>
                <StyledView className="flex-row items-center space-x-2">
                  <StyledText className="text-base text-black font-normal">
                    {'₹'}
                    {item.price}
                    {'.00'}
                  </StyledText>
                  <StyledView className="py-1 px-2 bg-lightGrey rounded-full">
                    <TouchableOpacity
                      onPress={() => {
                        showToast();
                        dispatch(removeItem(item.itemId));
                      }}>
                      <MaterialIcons
                        name="delete-outline"
                        size={20}
                        color={Colors.Dark}
                      />
                    </TouchableOpacity>
                  </StyledView>
                </StyledView>
              </StyledView>
            );
          })}
        </StyledView>
      </StyledScrollView>

      {LocalCart?.length > 0 && (
        <StyledView
          style={{
            marginHorizontal: RPW(6),
          }}>
          <StyledView className="my-5 h-1 bg-lightGrey" />
          <StyledView className="flex-row justify-between">
            <StyledText className="text-base text-black">Total</StyledText>
            <StyledText className="text-base text-black font-bold">
              {'₹'}
              {totalPrice}
              {'.00'}
            </StyledText>
          </StyledView>
          <StyledView className="my-5">
            <Button
              primary
              title="Proceed to booking"
              onPress={() => {
                navigation.navigate('ServiceSchedule', {address: undefined});
              }}
            />
          </StyledView>
        </StyledView>
      )}
    </StyledSafeAreaView>
  );
};
