import {View, Text} from 'react-native';
import React from 'react';
import {PackageItem} from './RenderPackage';
import {CheckBox} from '@rneui/themed';
import {Colors} from '../utils/Colors';

interface RenderPackageItemProps {
  packageItems: Array<PackageItem>;
  onPress: (index: number) => void;
}

export const RenderPackageItem = ({
  packageItems,
  onPress,
}: RenderPackageItemProps) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

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
                  onPress(selectedIndex);
                }
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
