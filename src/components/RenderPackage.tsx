import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {instance} from '../api/instance';
import {Button} from './rneui';

export interface PackageItem {
  item_id: string;
  section_id: string;
  name: string;
  description: string;
  price: string;
  is_default: boolean;
  is_none_option: boolean;
  display_order: number;
  icon_url: string;
}

export interface PackageSections {
  section_id: string;
  package_id: string;
  name: string;
  description: string;
  display_order: number;
  icon_url: string;
  PackageItems: Array<PackageItem>;
}

export interface Package {
  package_id: string;
  type_id: string;
  name: string;
  description: string;
  duration_hours: number;
  duration_minutes: number;
  display_order: number;
  icon_url: string;
  ServiceType: {
    name: string;
    description: string;
  };
  PackageSections: Array<PackageSections>;
  default_price: number;
}

export const RenderPackage = ({typeId}: {typeId: string}) => {
  const [packageData, setPackageData] = useState<Package[]>();

  useEffect(() => {
    try {
      instance.get(`packages/types/${typeId}`).then(response => {
        setPackageData(response.data.data);
      });
    } catch (e) {
      console.log('Error ', e);
    }
  }, [typeId]);

  const _renderPackage = ({item}: {item: Package}) => {
    return (
      <View className="my-1 border-2 border-lightGrey rounded-lg p-2">
        <Text className="text-base text-dark font-medium first-letter:capitalize">
          {item.name}
        </Text>
        <View className="flex-row justify-between items-center space-x-2">
          <View className="w-1/2 align-top">
            <Text className="text-sm text-dark overflow-clip">
              {item.description}
            </Text>
            <View className="flex-row items-center space-x-2">
              <Text className="text-sm text-dark overflow-clip">
                {'Service Duration: '}
              </Text>
              <Text className="text-sm text-dark overflow-clip">
                {item.duration_hours} {'h'} {item.duration_minutes} {'m'}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-base text-black font-bold">
              {'₹'}
              {item.default_price}
            </Text>
            <View className="my-2">
              <Button black title="Customize" size="sm" />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        className="mt-2"
        horizontal={false}
        numColumns={1}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        data={packageData}
        keyExtractor={(item: Package) => item.type_id}
        renderItem={_renderPackage}
      />
    </View>
  );
};
