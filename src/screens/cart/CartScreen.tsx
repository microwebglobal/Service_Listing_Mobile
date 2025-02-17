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
import {removeItem} from '../../redux/cart/cart.slice';

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
            return (
              <>
                <View
                  key={index}
                  className="flex-row justify-between items-center mt-5">
                  <View>
                    <Text className="text-base text-black font-medium">
                      {item.name}
                    </Text>
                    <Text className="text-sm text-gray">
                      Quantity: {item.quantity}
                    </Text>
                  </View>
                  <View className="flex-row items-center space-x-4">
                    <Text className="text-base text-black font-medium">
                      {'₹'}
                      {item.price}
                    </Text>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(removeItem(item.itemId));
                        }}>
                        <Entypo name="cross" size={22} color={Colors.Gray} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            );
          })}

          {cart.length !== 0 && (
            <>
              <View className="mt-5 h-0.5 bg-lightGrey" />
              <View className="my-5">
                <Button primary title="Booking" size="sm" onPress={() => {}} />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
