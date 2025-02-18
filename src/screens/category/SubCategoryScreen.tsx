import {
  View,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Screen, useNav} from '../../navigation/RootNavigation';
import AppHeader from '../../components/AppHeader';
import {Image} from '@rneui/themed';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {ServiceType} from './ServiceTypeScreen';

interface SubCategory {
  sub_category_id: string;
  category_id: string;
  name: string;
  slug: string;
  icon_url: string;
  display_order: number;
  ServiceTypes: Array<ServiceType>;
}

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const SubCategoryScreen: Screen<'SubCategory'> = ({route}) => {
  const {categoryId, category, imageUrl} = route.params;
  const navigation = useNav();
  const [subCategoryData, setSubCategoryData] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      instance.get(`/categories/${categoryId}/subcategories`).then(response => {
        setSubCategoryData(response.data);
      });
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, navigation]);

  const _renderSubCategoryItem = ({item}: any) => {
    return (
      <View className="w-full basis-1/2 px-2 my-3 rounded-xl">
        <TouchableOpacity
          onPress={() => {
            if (item.ServiceTypes.length > 0) {
              navigation.navigate('ServiceType', {
                subCategoryId: item.sub_category_id,
                subCategory: item.name,
              });
            }
          }}>
          <View className="py-2 items-center justify-center bg-lightGrey rounded-xl">
            <View className="">
              <Image
                source={{uri: `http://10.0.2.2:5001${item.icon_url}`}}
                containerStyle={styles.itemImage}
              />
            </View>
            <View className="w-full mt-2 px-3 items-center bg-white shadow-lg shadow-gray rounded-b-xl">
              <Text className="my-2 text-base text-black">{item.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-grow" showsVerticalScrollIndicator={false}>
        <AppHeader title={category} back={true} />
        <View>
          <Image
            source={{uri: `http://10.0.2.2:5001${imageUrl}`}}
            containerStyle={styles.categoryImage}
          />
        </View>
        <View
          className="flex-1 justify-between"
          style={{marginHorizontal: RPW(5)}}>
          <View className="my-2">
            <Text className="text-dark text-justify text-base my-2">
              {category}
              {
                'is an essential part of daily life in delhi. Whether you are looking for professional services, products, or local offers, this category encompasses everything you need. From reliable service providers to unique offerings, we have gathered all the top choices for you.'
              }
            </Text>
            <Text className="mt-5 text-dark text-justify text-base font-medium">
              {'Subcategories and available services'}
            </Text>
          </View>
          <View>
            {subCategoryData.length > 0 ? (
              <FlatList
                className="mt-2"
                horizontal={false}
                numColumns={2}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                data={subCategoryData}
                keyExtractor={(item: any) => item.category_id}
                renderItem={_renderSubCategoryItem}
              />
            ) : (
              <View className="my-5">
                <Text className="text-base text-center my-2">
                  {'No subcategories available for \n this category'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  categoryImage: {
    width: 'auto',
    height: 200,
    resizeMode: 'center',
  },
  itemImage: {
    width: 150,
    height: 100,
    borderRadius: 12,
    resizeMode: 'contain',
  },
});
