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
import AppHeader from '../../components/AppHeader';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useAppSelector} from '../../redux';
import {Button} from '../../components/rneui';
import Entypo from 'react-native-vector-icons/Entypo';
import {Colors} from '../../utils/Colors';
import {ItemEntity} from '../../redux/cart/cart.entity';
import {useDispatch} from 'react-redux';
import {addItem, reduceQuantity, removeItem} from '../../redux/cart/cart.slice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

export const CartScreen = () => {
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const cart = useAppSelector((state: any) => state.cart.cart);
  let totalPrice = 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}>
        <AppHeader back={false} title={'Cart'} />
        <View className="flex-1 mt-5" style={{marginHorizontal: RPW(6)}}>
          {cart.length === 0 && (
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
          {cart.map((item: ItemEntity, index: number) => {
            totalPrice += item.price * item.quantity;
            return (
              <View
                key={index}
                className="flex-row justify-between items-center mb-7">
                <View className="flex-row items-center space-x-4">
                  <View className="ml-1 bg-lightGrey rounded-lg">
                    <Image
                      source={{uri: `http://10.0.2.2:5001/${item.icon_url}`}}
                      style={{width: 50, height: 50}}
                    />
                  </View>
                  <View>
                    <Text className="text-base text-black font-normal text-clip">
                      {item.name}
                    </Text>
                    <Text className="text-base text-black font-normal">
                      {'₹'}
                      {item.price}
                      {'.00'}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center space-x-4">
                  <View className="flex-row items-center py-1 px-2 space-x-3 bg-lightGrey rounded-full">
                    {item.quantity > 1 ? (
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(reduceQuantity(item.itemId));
                        }}>
                        <Entypo name="minus" size={20} color={Colors.Dark} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(removeItem(item.itemId));
                        }}>
                        <MaterialIcons
                          name="delete-outline"
                          size={20}
                          color={Colors.Dark}
                        />
                      </TouchableOpacity>
                    )}

                    <Text className="text-base text-dark">{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(addItem(item));
                      }}>
                      <Entypo name="plus" size={20} color={Colors.Dark} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {cart.length !== 0 && (
        <View
          style={{
            marginHorizontal: RPW(6),
            marginBottom: tabBarHeight,
          }}>
          <View className="my-5 h-1 bg-lightGrey" />
          <View className="flex-row justify-between">
            <Text className="text-base text-black">Total</Text>
            <Text className="text-base text-black font-bold">
              {'₹'}
              {totalPrice}
              {'.00'}
            </Text>
          </View>
          <View className="my-5">
            <Button primary title="Checkout" size="sm" onPress={() => {}} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
