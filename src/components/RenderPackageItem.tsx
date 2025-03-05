import {View, Text} from 'react-native';
import React from 'react';
import {PackageItem} from './RenderPackage';
import {CheckBox} from '@rneui/themed';
import {Colors} from '../utils/Colors';
import {ItemEntity} from '../redux/cart/cart.entity';

interface RenderPackageItemProps {
  packageItems: Array<PackageItem>;
  cartItems: React.MutableRefObject<Array<ItemEntity>>;
  onPress: () => void;
}

export const RenderPackageItem = ({
  packageItems,
  cartItems,
  onPress,
}: RenderPackageItemProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

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
    });
  };

  return (
    <>
      {packageItems.map((item: PackageItem, index: number) => (
        <View key={index} className="my-2 flex-row justify-between items-end">
          <View className="-ml-3 flex-row items-center">
            <CheckBox
              checked={selectedIndex === index}
              checkedColor={Colors.Black}
              uncheckedColor={Colors.Gray}
              onPress={() => {
                if (selectedIndex !== index) {
                  setSelectedIndex(index);
                }
                onPress();
                handleAddToCart(item);
              }}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />

            <View className="-ml-3">
              <Text className="text-sm text-black font-medium overflow-clip">
                {item.name}
              </Text>
              <Text className="text-sm text-dark overflow-clip">
                {item.description}
              </Text>
            </View>
          </View>
          <Text className="text-base text-black font-bold">
            {'₹'}
            {item.price}
          </Text>
        </View>
      ))}
    </>
  );
};
