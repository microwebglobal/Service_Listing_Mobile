import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SERVER_BASE} from '@env';
import {styled} from 'nativewind';
import {SubCategory} from './types';
import {useDispatch} from 'react-redux';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {clearCart} from '../../redux/cart/cart.slice';
import {ServiceCard} from '../../components/ServiceCard';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

export const SubCategoryScreen: Screen<'SubCategory'> = ({route}) => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const [isLoading, setIsLoading] = useState(true);
  const {categoryId, category, imageUrl} = route.params;
  const [subCategoryData, setSubCategoryData] = useState<SubCategory[]>([]);

  useEffect(() => {
    try {
      instance.get(`/categories/${categoryId}/subcategories`).then(response => {
        setSubCategoryData(response.data);
      });
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setIsLoading(false);
      dispatch(clearCart());
    }
  }, [categoryId, dispatch, navigation]);

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView
        className="flex-grow"
        style={{marginBottom: tabBarHeight}}
        showsVerticalScrollIndicator={false}>
        <AppHeader title={category} back={true} cartVisible={true} />
        <StyledView>
          <StyledImage
            source={{uri: `${SERVER_BASE}${imageUrl}`}}
            className="w-full h-52"
          />
        </StyledView>
        <StyledView
          className="flex-1 justify-between"
          style={{marginHorizontal: RPW(5)}}>
          <StyledView className="my-2">
            <StyledText className="text-dark font-PoppinsRegular text-justify text-sm my-2">
              {category}
              {
                'is an essential part of daily life in delhi. Whether you are looking for professional services, products, or local offers, this category encompasses everything you need. From reliable service providers to unique offerings, we have gathered all the top choices for you.'
              }
            </StyledText>
            <StyledText className="mt-5 text-black font-PoppinsMedium text-justify text-base font-medium">
              {'Subcategories and available services'}
            </StyledText>
          </StyledView>
          <StyledView className="mb-4">
            {subCategoryData.length > 0 ? (
              <FlatList
                className="mt-2"
                horizontal={false}
                numColumns={2}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                data={subCategoryData}
                keyExtractor={(item: any) => item.category_id}
                renderItem={({item}: any) => {
                  return <ServiceCard mode="subCategory" subCategory={item} />;
                }}
              />
            ) : (
              <StyledView className="my-5">
                <StyledText className="text-sm font-PoppinsRegular text-center my-2">
                  {'No subcategories available for \n this category'}
                </StyledText>
              </StyledView>
            )}
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
