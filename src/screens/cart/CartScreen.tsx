import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Button} from '../../components/rneui';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppHeader from '../../components/AppHeader';
import {useNav} from '../../navigation/RootNavigation';
import {Booking, BookingItem} from './SelectedItemsScreen';
import {instance} from '../../api/instance';
import {Colors} from '../../utils/Colors';

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
  const [cart, setCart] = useState<Booking>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    instance
      .get('/cart')
      .then(res => {
        setCart(res.data);
      })
      .catch(function (e) {
        console.log(e.message);
      });
  }, []);

  const updateCartItem = (itemId: string, quantity: number) => {
    try {
      instance.put('/cart/item', {itemId, quantity}).then(res => {
        setCart(res.data);
      });
    } catch (error) {
      console.log(cart);
    }
  };

  const submit = useCallback(async () => {
    setLoading(true);
    if (cart) {
      await instance
        .post('/cart/checkout', {})
        .then(res => {
          console.log(res.status);
          navigation.navigate('Payment', {
            amount: cart.BookingPayment.total_amount,
            bookingId: cart.booking_id,
          });
        })
        .catch(function (e) {
          console.log(e.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [cart, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-grow" showsVerticalScrollIndicator={false}>
        <AppHeader back={true} title={'Shopping Cart'} />
        <View className="flex-1 mt-5" style={{marginHorizontal: RPW(6)}}>
          {cart?.BookingItems.length === 0 && (
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
          )}
          {/* Render cart items */}
          {cart?.BookingItems.map((item: BookingItem, index: number) => {
            return (
              <View
                key={index}
                className="flex-row justify-between items-center mb-7">
                {item.serviceItem && (
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
                {item.packageItem && (
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
                    {item.quantity > 1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          updateCartItem(item.item_id, item.quantity - 1);
                        }}>
                        <Entypo name="minus" size={20} color={Colors.Black} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => {}}>
                        <MaterialIcons
                          name="delete-outline"
                          size={20}
                          color={Colors.Dark}
                        />
                      </TouchableOpacity>
                    )}
                    <Text className="text-base text-black">
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
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

      {cart && cart?.BookingItems.length > 0 && (
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
