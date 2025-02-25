import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Button} from '../../components/rneui';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppHeader from '../../components/AppHeader';
import {BookingItem} from '../booking/BookingDetailsScreen';
import {instance} from '../../api/instance';
import {Colors} from '../../utils/Colors';
import {useNav} from '../../navigation/RootNavigation';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../redux';
import {
  addQuantity,
  clearCart,
  reduceQuantity,
  setCart,
} from '../../redux/shopping_cart/shopping_cart.slice';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

export const CartScreen = () => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const cart = useAppSelector(state => state.shopping_cart.shoppingCart);
  console.log(cart);

  useEffect(() => {
    instance
      .get('/cart')
      .then(res => {
        dispatch(setCart(res.data));
      })
      .catch(function (e) {
        console.log(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      await instance.put('/cart/item', {itemId, quantity}).then(() => {});
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
        navigation.navigate('Payment', {
          amount: cart.BookingPayment.total_amount,
          bookingId: cart.booking_id,
        });
        dispatch(clearCart());
      })
      .catch(function (e) {
        console.log(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cart, dispatch, navigation]);

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color={Colors.Black} />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-grow" showsVerticalScrollIndicator={false}>
        <AppHeader back={true} title={'Shopping Cart'} />
        <View className="flex-1 mt-5" style={{marginHorizontal: RPW(6)}}>
          {!cart ||
            (cart.BookingItems.length === 0 && (
              <View
                className="flex-1 justify-center items-center"
                style={{height: RPH(70)}}>
                <Image source={require('../../assets/app-images/cart.png')} />
                <Text className="mt-5 text-xl text-black text-center font-medium">
                  Add items to start a cart
                </Text>
                <Text className="mt-5 text-base text-dark text-center">
                  {
                    'Once you add items from a service package items or service items, your cart will appear here.'
                  }
                </Text>
              </View>
            ))}
          {/* Render cart items */}
          {cart !== null &&
            cart?.BookingItems.map((item: BookingItem, index: number) => {
              return (
                <View
                  key={index}
                  className="flex-row justify-between items-center mb-7">
                  {item?.serviceItem && (
                    <View className="flex-row items-center space-x-4">
                      <View className="ml-1 bg-lightGrey rounded-lg">
                        <Image
                          source={{
                            uri: `http://10.0.2.2:5001/${item.serviceItem.icon_url}`,
                          }}
                          style={{width: 50, height: 50}}
                        />
                      </View>
                      <View>
                        <Text className="text-base text-black font-normal text-clip">
                          {item.serviceItem.name}
                        </Text>
                        <Text className="text-base text-black font-normal">
                          {'₹'}
                          {item.unit_price}
                        </Text>
                      </View>
                    </View>
                  )}
                  {item?.packageItem && (
                    <View className="flex-row items-center space-x-4">
                      <View className="ml-1 bg-lightGrey rounded-lg">
                        <Image
                          source={{
                            uri: `http://10.0.2.2:5001/${item.packageItem.icon_url}`,
                          }}
                          style={{width: 50, height: 50}}
                        />
                      </View>
                      <View>
                        <Text className="text-base text-black font-normal text-clip">
                          {item.packageItem.name}
                        </Text>
                        <Text className="text-base text-black font-normal">
                          {'₹'}
                          {item.unit_price}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View className="flex-row items-center space-x-4">
                    <View className="flex-row items-center py-1 px-2 space-x-3 bg-lightGrey rounded-full">
                      {item?.quantity > 1 ? (
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(reduceQuantity(item.item_id));
                            updateCartItem(item.item_id, item.quantity - 1);
                          }}>
                          <Entypo name="minus" size={20} color={Colors.Black} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(reduceQuantity(item?.item_id));
                            updateCartItem(item.item_id, item.quantity - 1);
                          }}>
                          <MaterialIcons
                            name="delete-outline"
                            size={20}
                            color={Colors.Dark}
                          />
                        </TouchableOpacity>
                      )}
                      <Text className="text-base text-black">
                        {item?.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(addQuantity(item.item_id));
                          updateCartItem(item.item_id, item.quantity + 1);
                        }}>
                        <Entypo name="plus" size={20} color={Colors.Black} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>

      {cart !== null && cart?.BookingItems.length > 0 && (
        <View
          style={{
            marginHorizontal: RPW(6),
          }}>
          <View className="my-5 h-1 bg-lightGrey" />
          <View className="mb-1 flex-row justify-between">
            <Text className="text-base text-black">Subtotal</Text>
            <Text className="text-base text-black">
              {'₹'}
              {cart.BookingPayment.subtotal}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-base text-black">Tax (18%)</Text>
            <Text className="text-base text-black">
              {'₹'}
              {cart.BookingPayment.tax_amount}
            </Text>
          </View>
          <View className="my-3 flex-row justify-between">
            <Text className="text-base text-black font-bold">Total</Text>
            <Text className="text-base text-black font-bold">
              {'₹'}
              {cart.BookingPayment.total_amount}
            </Text>
          </View>
          <View className="my-5">
            <Button
              loading={loading}
              primary
              title="Proceed to payment"
              onPress={() => {
                submit();
              }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
