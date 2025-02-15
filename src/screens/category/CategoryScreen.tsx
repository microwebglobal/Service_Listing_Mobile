import {
  View,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {instance} from '../../api/instance';
import {Colors} from '../../utils/Colors';
import AppHeader from '../../components/AppHeader';
import {Image} from '@rneui/themed';

interface Category {
  category_id: string;
  name: string;
  slug: string;
  icon_url: string;
  display_order: number;
}

interface City {
  city_id: string;
  name: string;
  state: string;
  status: string;
  latitude: string;
  longitude: string;
  serviceCategories: Array<Category>;
}

interface Address {
  id: number;
  userId: number;
  type: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  is_primary: boolean;
}

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const CategoryScreen = () => {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const [isLoading, setIsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<Array<Category>>([]);
  const [cities, setCities] = useState<Array<City>>([]);

  useEffect(() => {
    try {
      instance.get('/cities').then(response => {
        setCities(response.data);
      });
    } catch (e) {
      console.log('Error ', e);
    }
  }, []);

  useEffect(() => {
    try {
      let primaryAddress: Array<Address> = [];
      let cityData: Array<City> = [];
      instance.get('/users/addresses').then(response => {
        primaryAddress = response.data.filter((address: Address) => {
          return address.is_primary === true;
        });
      });

      cityData = cities.filter((city: City) => {
        // city.name === primaryAddress[0].city;
        return city.name === 'Delhi';
      });
      setCategoryData(cityData[0].serviceCategories);
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [cities]);

  const _renderCategoryItem = ({item}: any) => {
    return (
      <View className="w-full basis-1/2 px-2 my-3 rounded-xl">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SubCategory', {
              categoryId: item.category_id,
              category: item.name,
              imageUrl: item.icon_url,
            });
          }}>
          <View className="py-2 items-center justify-center bg-lightGrey rounded-xl">
            <View className="">
              <Image
                source={{uri: `http://10.0.2.2:5001${item.icon_url}`}}
                containerStyle={styles.item}
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
        <ActivityIndicator size="large" color={Colors.Black} />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-grow mb-[var(--tabBarHeight, 10px)]"
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}>
        <AppHeader back={false} title="Our Services" />
        <View
          className="flex-1 justify-between"
          style={{marginHorizontal: RPW(6)}}>
          <FlatList
            className="mt-2"
            horizontal={false}
            numColumns={2}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            data={categoryData}
            keyExtractor={(item: any) => item.category_id}
            renderItem={_renderCategoryItem}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 150,
    height: 100,
    borderRadius: 12,
    resizeMode: 'contain',
  },
});
