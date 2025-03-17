import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SERVER_BASE} from '@env';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import {BookingPayment} from '../booking/types';
import AppHeader from '../../components/AppHeader';
import Entypo from 'react-native-vector-icons/Entypo';
import {StackActions} from '@react-navigation/native';
import {useNav} from '../../navigation/RootNavigation';
import {BookingItem} from '../booking/BookingDetailsScreen';
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
          {cart !== undefined &&
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
                            uri: `${SERVER_BASE}${item.serviceItem.icon_url}`,
                          }}
                          style={styles.ImageStyle}
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
                            uri: `${SERVER_BASE}${item.packageItem.icon_url}`,
                          }}
                          style={styles.ImageStyle}
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
                            updateCartItem(item.item_id, item.quantity - 1);
                          }}>
                          <Entypo name="minus" size={20} color={Colors.Black} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
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

      {cart !== undefined && cart.BookingItems.length > 0 && (
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
          <View className="my-1 flex-row justify-between">
            <Text className="text-base text-black font-bold">Total</Text>
            <Text className="text-base text-black font-bold">
              {'₹'}
              {cart.BookingPayment.total_amount}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-base text-black font-bold">
              Advance Amount
            </Text>
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

const styles = StyleSheet.create({
  ImageStyle: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
});
