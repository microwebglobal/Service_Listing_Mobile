import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SERVER_BASE} from '@env';
import {styled} from 'nativewind';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import {BookingPayment} from '../booking/types';
import AppHeader from '../../components/AppHeader';
import Entypo from 'react-native-vector-icons/Entypo';
import {StackActions} from '@react-navigation/native';
import {useNav} from '../../navigation/RootNavigation';
import {BookingItem} from '../booking/BookingDetailsScreen';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Booking {
  booking_id: string;
  user_id: number;
  provider_id: string;
  city_id: string;
  booking_date: string;
  status: string;
  service_address: string;
  customer_notes: string;
  BookingItems: Array<BookingItem>;
  BookingPayment: BookingPayment;
}

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const CartScreen = () => {
  const navigation = useNav();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [cart, setCart] = useState<Booking>();

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    await instance
      .get('/cart')
      .then(res => {
        setCart(res.data);
      })
      .catch(function (e) {
        console.log(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      await instance.put('/cart/item', {itemId, quantity}).then(() => {
        getCart();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const submit = useCallback(async () => {
    if (!cart) {
      return 'Cart is empty';
    }
    setLoading(true);
    await instance
      .post('/cart/checkout', {})
      .then(() => {
        navigation.dispatch(StackActions.pop(1));
        navigation.navigate('Payment', {
          amount: cart.BookingPayment.subtotal,
          bookingId: cart.booking_id,
        });
      })
      .catch(function (e) {
        console.log(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cart, navigation]);

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-grow" showsVerticalScrollIndicator={false}>
        <AppHeader back={true} title={'Shopping Cart'} />
        <StyledView className="flex-1 mt-5" style={{marginHorizontal: RPW(5)}}>
          {cart !== undefined &&
            cart?.BookingItems.map((item: BookingItem, index: number) => {
              return (
                <StyledView
                  key={index}
                  className="flex-row justify-between items-center mb-7">
                  {item?.serviceItem && (
                    <StyledView className="flex-row basis-2/4 items-center space-x-4">
                      <StyledView className="ml-1 bg-lightGrey rounded-lg">
                        <StyledImage
                          className="w-14 h-14 rounded-md"
                          source={{
                            uri: `${SERVER_BASE}${item.serviceItem.icon_url}`,
                          }}
                        />
                      </StyledView>
                      <StyledView>
                        <StyledText className="text-base text-black font-normal text-clip">
                          {item.serviceItem.name}
                        </StyledText>
                        <StyledText className="text-base text-black font-normal">
                          {'₹'}
                          {item.unit_price}
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  )}
                  {item?.packageItem && (
                    <StyledView className="flex-row basis-2/4 items-center space-x-4">
                      <StyledView className="ml-1 bg-lightGrey rounded-lg">
                        <StyledImage
                          className="w-12 h-12 rounded-md"
                          source={{
                            uri: `${SERVER_BASE}${item.packageItem.icon_url}`,
                          }}
                        />
                      </StyledView>
                      <StyledView>
                        <StyledText className="text-base text-black font-normal text-clip">
                          {item.packageItem.name}
                        </StyledText>
                        <StyledText className="text-base text-black font-normal">
                          {'₹'}
                          {item.unit_price}
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  )}

                  <StyledView className="flex-row items-center space-x-4">
                    <StyledView className="flex-row items-center py-1 px-2 space-x-3 bg-lightGrey rounded-full">
                      {item?.quantity > 1 ? (
                        <StyledTouchableOpacity
                          onPress={() => {
                            updateCartItem(item.item_id, item.quantity - 1);
                          }}>
                          <Entypo name="minus" size={20} color={Colors.Black} />
                        </StyledTouchableOpacity>
                      ) : (
                        <StyledTouchableOpacity
                          onPress={() => {
                            updateCartItem(item.item_id, item.quantity - 1);
                          }}>
                          <MaterialIcons
                            name="delete-outline"
                            size={20}
                            color={Colors.Dark}
                          />
                        </StyledTouchableOpacity>
                      )}
                      <StyledText className="text-base text-black">
                        {item?.quantity}
                      </StyledText>
                      <StyledTouchableOpacity
                        onPress={() => {
                          updateCartItem(item.item_id, item.quantity + 1);
                        }}>
                        <Entypo name="plus" size={20} color={Colors.Black} />
                      </StyledTouchableOpacity>
                    </StyledView>
                  </StyledView>
                </StyledView>
              );
            })}
        </StyledView>
      </ScrollView>

      {cart !== undefined && cart.BookingItems.length > 0 && (
        <StyledView
          style={{
            marginHorizontal: RPW(6),
          }}>
          <StyledView className="my-5 h-1 bg-lightGrey" />
          <StyledView className="mb-1 flex-row justify-between">
            <StyledText className="text-base text-black">Subtotal</StyledText>
            <StyledText className="text-base text-black">
              {'₹'}
              {cart.BookingPayment.subtotal}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between">
            <StyledText className="text-base text-black">Tax (18%)</StyledText>
            <StyledText className="text-base text-black">
              {'₹'}
              {cart.BookingPayment.tax_amount}
            </StyledText>
          </StyledView>
          <StyledView className="my-1 flex-row justify-between">
            <StyledText className="text-base text-black font-bold">
              Total
            </StyledText>
            <StyledText className="text-base text-black font-bold">
              {'₹'}
              {cart.BookingPayment.total_amount}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between">
            <StyledText className="text-base text-black font-bold">
              Advance Amount
            </StyledText>
            <StyledText className="text-base text-black font-bold">
              {'₹'}
              {cart.BookingPayment.total_amount}
            </StyledText>
          </StyledView>
          <StyledView className="my-5">
            <Button
              loading={loading}
              primary
              title="Proceed to payment"
              onPress={() => {
                submit();
              }}
            />
          </StyledView>
        </StyledView>
      )}
    </StyledSafeAreaView>
  );
};
