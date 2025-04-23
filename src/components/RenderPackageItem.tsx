import {View, Text} from 'react-native';
import React from 'react';
import {styled} from 'nativewind';
import {CheckBox} from '@rneui/themed';
import {Colors} from '../utils/Colors';
import {useAppSelector} from '../redux';
import {ItemEntity} from '../redux/cart/cart.entity';
import {PackageItem} from '../screens/category/types';

interface RenderPackageItemProps {
  packageItems: Array<PackageItem>;
  cartItems: React.MutableRefObject<Array<ItemEntity>>;
  onPress: () => void;
}

const StyledView = styled(View);
const StyledText = styled(Text);

export const RenderPackageItem = ({
  packageItems,
  cartItems,
  onPress,
}: RenderPackageItemProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const cityId = useAppSelector((state: any) => state.address.cityId);

  const handleAddToCart = (item: PackageItem) => {
    cartItems.current = cartItems.current.filter(
      cartItem => cartItem.sectionId !== item.section_id,
    );
    cartItems.current.push({
      itemId: item.item_id,
      sectionId: item.section_id,
      itemType: 'package_item',
      name: item.name,
      price: parseInt(item.price, 10),
      quantity: 1,
      icon_url: item.icon_url,
      is_home_visit: false,
    });
    onPress();
  };

  return (
    <>
      {packageItems.map((item: PackageItem, index: number) => (
        <StyledView
          key={index}
          className="my-2 flex-row justify-between items-end">
          <StyledView className="-ml-3 flex-row items-center">
            <CheckBox
              checked={selectedIndex === index}
              checkedColor={Colors.Primary}
              uncheckedColor={Colors.Gray}
              onPress={() => {
                if (selectedIndex !== index) {
                  setSelectedIndex(index);
                }
                handleAddToCart(item);
              }}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />

            <StyledView className="-ml-3">
              <StyledText className="text-sm text-black font-PoppinsMedium overflow-clip">
                {item.name}
              </StyledText>
              <StyledText className="text-sm font-PoppinsRegular text-dark overflow-clip">
                {item.description}
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledText className="text-base text-black font-PoppinsMedium">
            {'₹'}
            {item.CitySpecificPricings.length > 0
              ? item.CitySpecificPricings.map(element => {
                  if (element.city_id === cityId) {
                    return element.price;
                  }
                })
              : item.price}
          </StyledText>
        </StyledView>
      ))}
    </>
  );
};
