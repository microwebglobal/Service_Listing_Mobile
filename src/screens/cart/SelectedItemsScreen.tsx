import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

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
  const [packages, setPackages] = useState<Array<string>>([]);
  let totalPrice = 0;

  useEffect(() => {
    const packageNames = LocalCart?.filter(
      (item: ItemEntity) => item.itemType === 'package_item',
    ).map((item: ItemEntity) => item.packageName);

    const uniquePackages: string[] = Array.from(new Set(packageNames));
    setPackages(uniquePackages);
  }, [LocalCart]);

  const showToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Removed from selection',
      text2: 'Item has been removed from selection',
    });
  };

  const _renderItem = (item: ItemEntity, index: number) => {
    return (
      <StyledView
        key={index}
        className="flex-row justify-between items-center mb-7">
        <StyledView className="flex-row flex-wrap basis-4/5 items-center space-x-4">
          <StyledView className="ml-1 bg-lightGrey rounded-lg">
            <StyledImage
              resizeMode="cover"
              className="w-14 h-14 rounded-md"
              source={{uri: `${SERVER_BASE}${item.icon_url}`}}
            />
          </StyledView>
          <StyledView>
            <StyledText className="text-base text-black font-PoppinsRegular text-clip">
              {item.name}
            </StyledText>
            <StyledView className="flex-row items-center space-x-2">
              <StyledText className="text-base text-black font-PoppinsMedium">
                {'₹'}
                {item.price}
                {'.00'}
              </StyledText>
              <StyledText className="text-sm text-gray font-PoppinsRegular">
                {'(x'}
                {item.quantity}
                {')'}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
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
    );
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}>
        <AppHeader back={true} title={'Selected Services'} />
        <StyledView className="flex-1 mt-5" style={{marginHorizontal: RPW(5)}}>
          {(LocalCart === null || LocalCart?.length === 0) && (
            <StyledView
              className="flex-1 justify-center items-center"
              style={{height: RPH(70)}}>
              <StyledImage
                source={require('../../assets/app-images/cart.png')}
              />
              <StyledText className="mt-5 text-base text-black text-center font-PoppinsMedium">
                Your cart is empty
              </StyledText>
              <StyledText className="mt-2 text-sm text-dark text-center font-PoppinsRegular">
                {'Once you add items, your cart will appear here.'}
              </StyledText>

              <StyledView className="my-5">
                <Button
                  size="md"
                  title="Explore Services"
                  onPress={() => {
                    navigation.navigate('TabNavigator' as any, {
                      screen: 'Service',
                    });
                  }}
                />
              </StyledView>
            </StyledView>
          )}

          {LocalCart?.filter(
            (item: ItemEntity) => item.itemType === 'service_item',
          ).length > 0 && (
            <StyledView className="mb-2">
              <StyledView className="flex-row items-center space-x-3 mb-5">
                <SimpleLineIcons
                  name={'wrench'}
                  size={15}
                  color={Colors.Black}
                />
                <StyledText className="text-base text-dark font-PoppinsRegular">
                  Service Items
                </StyledText>
              </StyledView>

              {LocalCart?.filter(
                (item: ItemEntity) => item.itemType === 'service_item',
              ).map((item: ItemEntity, index: number) => {
                totalPrice += item.price * item.quantity;
                return _renderItem(item, index);
              })}
            </StyledView>
          )}

          {packages.map((packageName: string, index: number) => {
            return (
              <StyledView key={index} className="mb-2">
                <StyledView className="flex-row items-center space-x-3 mb-5">
                  <Feather name={'package'} size={15} color={Colors.Dark} />
                  <StyledText className="text-base text-dark font-PoppinsRegular">
                    {packageName}
                  </StyledText>
                </StyledView>

                {LocalCart?.filter(
                  (item: ItemEntity) =>
                    item.itemType === 'package_item' &&
                    item.packageName === packageName,
                ).map((item: ItemEntity, key: number) => {
                  totalPrice += item.price * item.quantity;
                  return _renderItem(item, key);
                })}
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
            <StyledText className="text-base text-black font-PoppinsMedium">
              Total
            </StyledText>
            <StyledText className="text-base text-black font-PoppinsSemiBold">
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
                navigation.navigate('ServiceSchedule');
              }}
            />
          </StyledView>
        </StyledView>
      )}
    </StyledSafeAreaView>
  );
};
