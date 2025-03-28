import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SERVER_BASE} from '@env';
import {styled} from 'nativewind';
import {useDispatch} from 'react-redux';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {useNav} from '../../navigation/RootNavigation';
import {useFocusEffect} from '@react-navigation/native';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import {setPrimaryCityID} from '../../redux/address/address.slice';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

export interface Category {
  category_id: string;
  name: string;
  slug: string;
  icon_url: string;
  display_order: number;
}

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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledFlatList = styled(FlatList);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

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
      } else {
        cities.map((city: City) => {
          setCategoryData([...city.serviceCategories]);
        });
      }
    }, [cities, dispatch, fetchAddress, primaryAddress?.city]),
  );

  const _renderCategoryItem = ({item}: any) => {
    return (
      <StyledView className="w-full basis-1/2 px-2 mt-3">
        <TouchableOpacity
          className="shadow-sm shadow-black rounded-xl"
          onPress={() => {
            navigation.navigate('SubCategory', {
              categoryId: item.category_id,
              category: item.name,
              imageUrl: item.icon_url,
            });
          }}>
          <StyledView className="py-2 items-center justify-center bg-lightGrey rounded-xl">
            <StyledView className="">
              <StyledImage
                className="w-40 h-24 rounded-lg"
                source={{uri: `${SERVER_BASE}${item.icon_url}`}}
              />
            </StyledView>
            <StyledView className="w-full mt-2 px-3 items-center bg-white shadow-sm shadow-black rounded-b-xl">
              <StyledText className="my-2 text-base text-black">
                {item.name}
              </StyledText>
            </StyledView>
          </StyledView>
        </TouchableOpacity>
      </StyledView>
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}>
        <AppHeader back={false} title="Our Services" cartVisible={true} />
        <StyledView
          className="flex-1 justify-between"
          style={{marginHorizontal: RPW(4)}}>
          <StyledFlatList
            horizontal={false}
            numColumns={2}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            data={categoryData}
            keyExtractor={(item: any) => item.category_id}
            renderItem={_renderCategoryItem}
          />
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
