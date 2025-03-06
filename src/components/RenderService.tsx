import {View, Text, TouchableOpacity, FlatList, Image} from 'react-native';
import React, {useState} from 'react';
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

export const RenderService = ({service}: {service: Service}) => {
  const [serviceItemData, setServiceItemData] = useState<ServiceItem[]>();
  const [isItemClicked, setIsItemClicked] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchServiceItem = async (serviceId: string) => {
    try {
      const response = await instance.get(`items/service/${serviceId}`);
      return response.data;
    } catch (e) {
      console.log('Error ', e);
    }
  };

  const showToast = (serviceName: string) => {
    Toast.show({
      type: 'success',
      text1: 'Added to selection',
      text2: `${serviceName} has been added to your selection`,
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const _renderServiceItem = ({item}: {item: ServiceItem}) => {
    return (
      <View className="rounded-lg shadow-sm shadow-black" >
        <View className="bg-white rounded-lg p-2">
          <View className="flex-row justify-between space-x-2">
            <View className="w-1/2">
              <Text className="text-base text-black font-medium first-letter:capitalize">
                {item.name}
              </Text>
              <Text className="my-1 text-base text-black font-bold">
                {'₹'}
                {item.base_price}
              </Text>
              <Text className="text-sm text-black overflow-clip">
                {item.description}
              </Text>
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
                    dispatch(
                      addItem({
                        itemId: item.item_id,
                        sectionId: item.service_id,
                        itemType: 'service_item',
                        quantity: 1,
                        name: item.name,
                        price: parseInt(item.base_price, 10),
                        icon_url: item.icon_url,
                      }),
                    );
                    showToast(item.name);
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
          let serviceItem = await fetchServiceItem(service.service_id);
          setServiceItemData(serviceItem);
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
