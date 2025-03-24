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
import React, {useCallback, useEffect, useState} from 'react';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {instance} from '../../api/instance';
import {Colors} from '../../utils/Colors';
import AppHeader from '../../components/AppHeader';
import {Image} from '@rneui/themed';
import {useNav} from '../../navigation/RootNavigation';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setPrimaryCityID} from '../../redux/address/address.slice';
import {SERVER_BASE} from '@env';

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

export interface Address {
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
  const navigation = useNav();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const [isLoading, setIsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<Array<Category>>([]);
  const [cities, setCities] = useState<Array<City>>([]);
  const [primaryAddress, setPrimaryAddress] = useState<Address>();

  useEffect(() => {
    instance
      .get('/cities')
      .then(response => {
        setCities(response.data);
      })
      .catch(e => {
        console.log('Error ', e);
      });
  }, []);

  const fetchAddress = useCallback(async () => {
    setIsLoading(true);
    await instance
      .get('/users/addresses')
      .then(response => {
        setPrimaryAddress(
          response.data.find((address: Address) => {
            return address.is_primary === true;
          }),
        );
      })
      .catch(e => {
        console.log('Error ', e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAddress();
      let cityData: any = cities.find((city: City) => {
        return city.name === primaryAddress?.city;
      });
      if (cityData !== undefined) {
        setCategoryData(cityData.serviceCategories);
        dispatch(setPrimaryCityID(cityData.city_id));
      }
    }, [cities, dispatch, fetchAddress, primaryAddress?.city]),
  );

  const _renderCategoryItem = ({item}: any) => {
    return (
      <View className="w-full basis-1/2 px-2 mt-3">
        <TouchableOpacity
          className="shadow-sm shadow-black rounded-xl"
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
                source={{uri: `${SERVER_BASE}${item.icon_url}`}}
                containerStyle={styles.itemImage}
              />
            </View>
            <View className="w-full mt-2 px-3 items-center bg-white shadow-sm shadow-black rounded-b-xl">
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
        <AppHeader back={false} title="Our Services" cartVisible={true} />
        <View
          className="flex-1 justify-between"
          style={{marginHorizontal: RPW(4)}}>
          <FlatList
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
  itemImage: {
    width: 150,
    height: 100,
    borderRadius: 12,
    resizeMode: 'contain',
  },
});
