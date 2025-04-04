import {View, Text, TouchableOpacity, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button} from './rneui';
import {SERVER_BASE} from '@env';
import classNames from 'classnames';
import {styled} from 'nativewind';
import {Colors} from '../utils/Colors';
import {useAppSelector} from '../redux';
import {useDispatch} from 'react-redux';
import {instance} from '../api/instance';
import Toast from 'react-native-toast-message';
import {addItem} from '../redux/cart/cart.slice';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Service, ServiceItem} from '../screens/category/ServiceTypeScreen';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

export const RenderService = ({service}: {service: Service}) => {
  const dispatch = useDispatch();
  const LocalCart = useAppSelector(state => state.cart.cart);
  const [isItemClicked, setIsItemClicked] = useState<boolean>(true);
  const [serviceItemData, setServiceItemData] = useState<ServiceItem[]>();

  useEffect(() => {
    instance
      .get(`items/serv/${service.service_id}`)
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
      <StyledView className="rounded-lg shadow-sm shadow-black">
        <StyledView className="bg-white rounded-lg p-2">
          <StyledView className="flex-row justify-between space-x-2">
            <StyledView className="w-2/3">
              <StyledText className="text-base text-black font-PoppinsMedium first-letter:capitalize">
                {item.name}
              </StyledText>
              <StyledText className="my-1 text-base text-black font-PoppinsSemiBold">
                {'₹'}
                {item.base_price}
              </StyledText>
              {parseInt(item.advance_percentage, 10) !== 0 && (
                <StyledText className="my-1 text-sm text-error">
                  {item.advance_percentage}
                  {'% Advanced Payment Required'}
                </StyledText>
              )}
              <StyledText className="text-sm font-PoppinsRegular text-black overflow-clip">
                {item.description}
              </StyledText>
              {item.is_home_visit && (
                <StyledText className="my-2 text-xs font-PoppinsRegular text-error">
                  You need to visit service provider to get an service
                </StyledText>
              )}
            </StyledView>
            <StyledView className="items-center">
              <StyledImage
                resizeMode="cover"
                className="w-20 h-20 rounded-lg"
                source={{uri: `${SERVER_BASE}${item.icon_url}`}}
              />
              <StyledView className="relative -mt-5 w-20 bg-black rounded-xl shadow-md shadow-black">
                <Button
                  secondary
                  title="Add"
                  size="sm"
                  onPress={() => {
                    showToast(item);
                  }}
                />
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
    );
  };

  return (
    <StyledView className="mb-5">
      <TouchableOpacity
        onPress={async () => {
          setIsItemClicked(!isItemClicked);
        }}>
        <StyledView className="flex-row items-center bg-white">
          <SimpleLineIcons name={'wrench'} size={15} color={Colors.Black} />
          <StyledText
            className={
              (classNames('first-letter:capitalize'),
              isItemClicked
                ? 'text-primary text-base font-PoppinsMedium ml-2'
                : 'text-dark text-base font-PoppinsMedium ml-2')
            }>
            {service.name}
          </StyledText>
        </StyledView>
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
    </StyledView>
  );
};
