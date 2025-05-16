import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Button} from './rneui';
import {styled} from 'nativewind';
import {Colors} from '../utils/Colors';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../redux';
import {instance} from '../api/instance';
import Toast from 'react-native-toast-message';
import {LoadingIndicator} from './LoadingIndicator';
import {ItemEntity} from '../redux/cart/cart.entity';
import {RenderPackageItem} from './RenderPackageItem';
import Feather from 'react-native-vector-icons/Feather';
import {addMultipleItems} from '../redux/cart/cart.slice';
import {Package, PackageItem, PackageSections} from '../screens/category/types';

const StyledView = styled(View);
const StyledText = styled(Text);

export const RenderPackage = ({typeId}: {typeId: string}) => {
  const dispatch = useDispatch();
  const cartItems = useRef<Array<ItemEntity>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [packageData, setPackageData] = useState<Package[]>([]);
  const [isItemClicked, setIsItemClicked] = useState<boolean>(false);
  const [packagePrice, setPackagePrice] = useState<number>(0);
  const cityId = useAppSelector((state: any) => state.address.cityId);

  useEffect(() => {
    try {
      instance.get(`packages/types/${typeId}`).then(response => {
        setPackageData(response.data.data);
      });
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setIsLoading(false);
    }
  }, [typeId]);

  const addDefaultItemsToCart = () => {
    let tempCartItems: Array<ItemEntity> = [];
    packageData?.map((item: Package) => {
      item.PackageSections.map((section: PackageSections) => {
        section.PackageItems.map((packageItem: PackageItem, index: number) => {
          if (index === 0) {
            tempCartItems.push({
              itemId: packageItem.item_id,
              sectionId: packageItem.section_id,
              itemType: 'package_item',
              name: packageItem.name,
              price: parseInt(packageItem.price, 10),
              quantity: 1,
              packageName: item.name,
              icon_url: packageItem.icon_url,
              is_home_visit: packageItem.is_none_option,
            });
          }
        });
      });
    });
    cartItems.current = tempCartItems;
  };

  const findCitySpecificPrice = (pkgItem: PackageItem) => {
    const citySpecificPrice = pkgItem.CitySpecificPricings.find(
      item => item.city_id === cityId,
    )
      ? pkgItem.CitySpecificPricings.find(item => item.city_id === cityId)
          ?.price
      : pkgItem.price;
    return parseInt(citySpecificPrice!, 10);
  };

  const calculateDefaultPrice = (packageDetails: Package) => {
    let total = 0;
    packageDetails.PackageSections.forEach((section: PackageSections) => {
      total += findCitySpecificPrice(section.PackageItems[0]);
    });
    setTimeout(() => setPackagePrice(total), 0);
    return total;
  };

  const calculatePackagePrice = () => {
    let totalPackagePrice = 0;
    cartItems.current.forEach(item => {
      totalPackagePrice += item.price;
    });
    setPackagePrice(totalPackagePrice);
  };

  const showToast = (packageName: string) => {
    Toast.show({
      type: 'success',
      text1: 'Added to selection',
      text2: `${packageName} and its package items has been added to your selection`,
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const _renderPackage = ({item}: {item: Package}) => {
    return (
      <StyledView className="p-1">
        <StyledView className="bg-white rounded-lg p-2 shadow-sm shadow-black">
          {!isItemClicked && (
            <>
              <StyledText className="text-base text-black font-PoppinsMedium first-letter:capitalize">
                {item.name}
              </StyledText>
              <StyledView className="flex-row justify-between items-center space-x-2">
                <StyledView className="w-1/2 align-top">
                  <StyledText className="my-2 text-sm font-PoppinsRegular text-dark overflow-clip">
                    {item.description}
                  </StyledText>
                  <StyledView className="flex-row items-center space-x-2">
                    <StyledText className="text-sm font-PoppinsRegular text-dark overflow-clip">
                      {'Service Duration: '}
                    </StyledText>
                    <StyledText className="text-sm font-PoppinsRegular text-dark overflow-clip">
                      {item.duration_hours} {'h'} {item.duration_minutes} {'m'}
                    </StyledText>
                  </StyledView>
                </StyledView>

                <StyledView className="items-end">
                  <StyledText className="text-base text-black font-PoppinsSemiBold shadow-sm">
                    {'₹'}
                    {calculateDefaultPrice(item)}
                  </StyledText>
                  <StyledView className="my-2 bg-black rounded-xl shadow-md shadow-black">
                    <Button
                      secondary
                      title="Customize"
                      size="sm"
                      onPress={() => {
                        setIsItemClicked(!isItemClicked);
                        addDefaultItemsToCart();
                      }}
                    />
                  </StyledView>
                </StyledView>
              </StyledView>
              {parseInt(item.advance_percentage, 10) !== 0 && (
                <StyledText className="my-1 text-xs font-PoppinsRegular text-primary">
                  {item.advance_percentage}
                  {'% Advanced Payment Required'}
                </StyledText>
              )}
            </>
          )}

          {/* Render package section */}
          {isItemClicked && (
            <>
              {item.PackageSections.map((section: PackageSections) => {
                return (
                  <StyledView key={section.section_id} className="mb-2">
                    <StyledView className="mb-2">
                      <StyledText className="mb-1 text-base text-black font-PoppinsMedium first-letter:capitalize">
                        {section.name}
                      </StyledText>
                      <StyledText className="text-sm font-PoppinsRegular text-black overflow-clip">
                        {section.description}
                      </StyledText>
                    </StyledView>

                    <RenderPackageItem
                      packageName={item.name}
                      packageItems={section.PackageItems}
                      cartItems={cartItems}
                      onPress={() => calculatePackagePrice()}
                    />
                    <StyledView className="my-4 h-0.5 bg-lightGrey" />
                  </StyledView>
                );
              })}

              <StyledView className="flex-row justify-between">
                <StyledText className="text-base font-PoppinsMedium text-black">
                  Total
                </StyledText>
                <StyledText className="text-base text-black font-PoppinsSemiBold">
                  {'₹'}
                  {packagePrice}
                </StyledText>
              </StyledView>
              <StyledView className="mb-2 mt-3 bg-black rounded-xl shadow-sm shadow-black">
                <Button
                  primary
                  title="Add to Cart"
                  size="md"
                  onPress={() => {
                    setIsItemClicked(!isItemClicked);
                    dispatch(addMultipleItems(cartItems.current));
                    showToast(item.name);
                  }}
                />
              </StyledView>
            </>
          )}
        </StyledView>
      </StyledView>
    );
  };

  if (isLoading) {
    return (
      <StyledView className="items-center justify-center flex-1 bg-white">
        <LoadingIndicator />
      </StyledView>
    );
  }
  return (
    <StyledView>
      {packageData?.length !== 0 && (
        <StyledView className="mb-2 flex-row items-center bg-white space-x-2">
          <StyledView className="bg-lightGrey rounded-lg">
            <Feather name={'package'} size={15} color={Colors.Black} />
          </StyledView>
          <StyledText className="text-base text-dark font-PoppinsMedium">
            Available Packages
          </StyledText>
        </StyledView>
      )}

      <FlatList
        horizontal={false}
        numColumns={1}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        data={packageData}
        keyExtractor={(item: Package) => item.type_id}
        renderItem={_renderPackage}
      />
    </StyledView>
  );
};
