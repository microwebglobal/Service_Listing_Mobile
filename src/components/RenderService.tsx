import {View, Text, TouchableOpacity, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Service, ServiceItem} from '../screens/category/ServiceTypeScreen';
import {instance} from '../api/instance';
import {Button} from './rneui';
import classNames from 'classnames';
import {Colors} from '../utils/Colors';
import {useDispatch} from 'react-redux';
import {addItem} from '../redux/cart/cart.slice';
import Toast from 'react-native-toast-message';
import {SERVER_BASE} from '@env';
import {useAppSelector} from '../redux';

export const RenderService = ({service}: {service: Service}) => {
  const dispatch = useDispatch();
  const LocalCart = useAppSelector(state => state.cart.cart);
  const [isItemClicked, setIsItemClicked] = useState<boolean>(true);
  const [serviceItemData, setServiceItemData] = useState<ServiceItem[]>();

  useEffect(() => {
    instance
      .get(`items/service/${service.service_id}`)
      .then(res => {
        setServiceItemData(res.data);
      })
      .catch(function (e) {
        console.log(e.message);
      });
  }, [service.service_id]);

  function addItemToCart(item: ServiceItem) {
    dispatch(
      addItem({
        itemId: item.item_id,
        sectionId: item.service_id,
        itemType: 'service_item',
        quantity: 1,
        name: item.name,
        price: parseInt(item.base_price, 10),
        icon_url: item.icon_url,
        is_home_visit: item.is_home_visit,
      }),
    );
    Toast.show({
      type: 'success',
      text1: 'Added to selection',
      text2: `${item.name} has been added to your selection`,
      visibilityTime: 2000,
      autoHide: true,
    });
  }

  const showToast = (item: ServiceItem) => {
    if (LocalCart === null || LocalCart?.length === 0) {
      addItemToCart(item);
      return;
    } else if (LocalCart && LocalCart?.length !== 0) {
      for (let i = 0; i < 1; i++) {
        const cartItem = LocalCart[i];
        if (cartItem.is_home_visit !== item.is_home_visit) {
          Toast.show({
            type: 'error',
            text1: 'Selection Restriction',
            text2:
              'You can only select either home visit or non-home visit items, not both.',
            visibilityTime: 2000,
            autoHide: true,
          });
          break;
        } else {
          addItemToCart(item);
          break;
        }
      }
    }
  };

  const _renderServiceItem = ({item}: {item: ServiceItem}) => {
    return (
      <View className="rounded-lg shadow-sm shadow-black">
        <View className="bg-white rounded-lg p-2">
          <View className="flex-row justify-between space-x-2">
            <View className="w-2/3">
              <Text className="text-base text-black font-medium first-letter:capitalize">
                {item.name}
              </Text>
              <Text className="my-1 text-base text-black font-bold">
                {'₹'}
                {item.base_price}
              </Text>
              {parseInt(item.advance_percentage, 10) !== 0 && (
                <Text className="my-1 text-sm text-error">
                  {item.advance_percentage}
                  {'% Advanced Payment Required'}
                </Text>
              )}
              <Text className="text-sm text-black overflow-clip">
                {item.description}
              </Text>
              {item.is_home_visit && (
                <Text className="my-2 text-sm text-error">
                  You need to visit service provider to get an service
                </Text>
              )}
            </View>
            <View className="items-center">
              <Image
                source={{uri: `${SERVER_BASE}${item.icon_url}`}}
                style={{width: 90, height: 90, borderRadius: 8}}
              />
              <View className="relative -mt-5 w-20 bg-black rounded-xl shadow-md shadow-black">
                <Button
                  secondary
                  title="Add"
                  size="sm"
                  onPress={() => {
                    showToast(item);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="mb-5">
      <TouchableOpacity
        onPress={async () => {
          setIsItemClicked(!isItemClicked);
        }}>
        <View className="flex-row items-center bg-white">
          <SimpleLineIcons name={'wrench'} size={15} color={Colors.Black} />
          <Text
            className={
              (classNames('first-letter:capitalize'),
              isItemClicked
                ? 'text-primary text-base font-medium ml-2'
                : 'text-dark text-base font-medium ml-2')
            }>
            {service.name}
          </Text>
        </View>
      </TouchableOpacity>
      {isItemClicked && serviceItemData && (
        <FlatList
          className="mt-2"
          horizontal={false}
          numColumns={1}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          data={serviceItemData}
          keyExtractor={(element: ServiceItem) => element.item_id}
          renderItem={_renderServiceItem}
        />
      )}
    </View>
  );
};
