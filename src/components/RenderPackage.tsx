import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {instance} from '../api/instance';
import {Button} from './rneui';
import {RenderPackageItem} from './RenderPackageItem';
import {useDispatch} from 'react-redux';
import {addMultipleItems} from '../redux/cart/cart.slice';
import {ItemEntity} from '../redux/cart/cart.entity';
import Toast from 'react-native-toast-message';

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
  const dispatch = useDispatch();
  const [packageData, setPackageData] = useState<Package[]>();
  const [isItemClicked, setIsItemClicked] = useState<boolean>(false);
  const [packagePrice, setPackagePrice] = useState<number>(0);
  const [cartItems, setCartItems] = useState<Array<ItemEntity>>([]);
  // const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    try {
      instance.get(`packages/types/${typeId}`).then(response => {
        setPackageData(response.data.data);
      });
    } catch (e) {
      console.log('Error ', e);
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
              itemType: 'package_item',
              name: packageItem.name,
              price: parseInt(packageItem.price, 10),
              quantity: 1,
              icon_url: packageItem.icon_url,
            });
          }
        });
      });
    });
    setCartItems(tempCartItems);
  };

  // Calculate default price of package
  const calculateDefaultPrice = (packageDetails: Package) => {
    let total = 0;
    packageDetails.PackageSections.forEach((section: PackageSections) => {
      total += parseInt(section.PackageItems[0].price, 10);
    });
    setPackagePrice(total);
    return total;
  };

  const calculatePackagePrice = (
    packageItems: Array<PackageItem>,
    selectedIndex: number,
  ) => {
    // Minus the price of the item that is not selected
    let itemPrice = parseInt(packageItems[selectedIndex].price, 10);
    // let tempCartItems: Array<ItemEntity> = cartItems;
    packageItems.map((item: PackageItem, index: number) => {
      if (index !== selectedIndex) {
        itemPrice = parseInt(item.price, 10) - itemPrice;
        // tempCartItems.push({
        //   itemId: packageItems[index].item_id,
        //   itemType: 'package_item',
        //   name: packageItems[selectedIndex].name,
        //   price: itemPrice,
        //   quantity: 1,
        // });
      }
    });
    setPackagePrice(packagePrice + itemPrice);
    // setCartItems(cartItems.concat(tempCartItems));
    // console.log('Cart Items', tempCartItems);
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
      <View className="my-1 border-2 border-lightGrey rounded-lg p-2">
        {!isItemClicked && (
          <>
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
                  {calculateDefaultPrice(item)}
                </Text>
                <View className="my-2">
                  <Button
                    black
                    title="Customize"
                    size="sm"
                    onPress={() => {
                      setIsItemClicked(!isItemClicked);
                      addDefaultItemsToCart();
                    }}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        {/* Render package section */}
        {isItemClicked && (
          <>
            {item.PackageSections.map((section: PackageSections) => {
              return (
                <View key={section.section_id} className="mb-2">
                  <View className="mb-2">
                    <Text className="mb-1 text-base text-black font-medium first-letter:capitalize">
                      {section.name}
                    </Text>
                    <Text className="text-sm text-black overflow-clip">
                      {section.description}
                    </Text>
                  </View>

                  <RenderPackageItem
                    packageItems={section.PackageItems}
                    onPress={selectIndex => {
                      calculatePackagePrice(section.PackageItems, selectIndex);
                    }}
                  />
                  <View className="my-4 h-0.5 bg-lightGrey" />
                </View>
              );
            })}

            <View className="flex-row justify-between">
              <Text className="text-base text-black">Total</Text>
              <Text className="text-base text-black font-bold">
                {'₹'}
                {packagePrice}
              </Text>
            </View>
            <View className="mb-2 mt-3">
              <Button
                black
                title="Add to Cart"
                size="sm"
                onPress={() => {
                  setIsItemClicked(!isItemClicked);
                  dispatch(addMultipleItems(cartItems));
                  // console.log('Cart Items', cartItems);
                  showToast(item.name);
                }}
              />
            </View>
          </>
        )}
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
