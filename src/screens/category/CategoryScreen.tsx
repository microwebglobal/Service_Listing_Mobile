import {
  View,
  FlatList,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Category} from './types';
import {styled} from 'nativewind';
import {useAppSelector} from '../../redux';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {useFocusEffect} from '@react-navigation/native';
import {ServiceCard} from '../../components/ServiceCard';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

export interface City {
  city_id: string;
  name: string;
  state: string;
  status: string;
  latitude: string;
  longitude: string;
  serviceCategories: Array<Category>;
}

export interface Address {
  id: any;
  type: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  is_primary: boolean;
  location: {
    coordinates: [longitude: number, latitude: number];
  };
}

const StyledView = styled(View);
const StyledFlatList = styled(FlatList);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const CategoryScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const [isLoading, setIsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<Array<Category>>([]);
  const [cities, setCities] = useState<Array<City>>([]);
  const cityId = useAppSelector((state: any) => state.address.cityId);

  useEffect(() => {
    instance
      .get('/cities')
      .then(response => {
        setCities(response.data);
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
      let cityData: any = cities.find((city: City) => {
        return city.city_id === cityId;
      });
      if (cityData !== undefined) {
        setCategoryData(cityData.serviceCategories);
      } else {
        cities.map((city: City) => {
          setCategoryData([...city.serviceCategories]);
        });
      }
    }, [cities, cityId]),
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}>
        <AppHeader back={false} title="Our Services" cartVisible={false} />
        <StyledView
          className="flex-1 mb-4 justify-between"
          style={{marginHorizontal: RPW(3)}}>
          <StyledFlatList
            horizontal={false}
            numColumns={2}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            data={categoryData}
            keyExtractor={(item: any) => item.category_id}
            renderItem={({item}: any) => {
              return <ServiceCard mode="category" category={item} />;
            }}
          />
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
