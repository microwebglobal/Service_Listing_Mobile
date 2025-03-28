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
import React, {useEffect, useState} from 'react';
import {SERVER_BASE} from '@env';
import {styled} from 'nativewind';
import {instance} from '../../api/instance';
import {ServiceType} from './ServiceTypeScreen';
import AppHeader from '../../components/AppHeader';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {LoadingIndicator} from '../../components/LoadingIndicator';

export interface SubCategory {
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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

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
      <StyledView className="w-full basis-1/2 px-2 my-3">
        <TouchableOpacity
          className="shadow-sm shadow-black rounded-xl"
          onPress={() => {
            if (item.ServiceTypes.length > 0) {
              navigation.navigate('ServiceType', {
                subCategoryId: item.sub_category_id,
                subCategory: item.name,
              });
            }
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
        className="flex-grow"
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
            <StyledText className="text-dark text-justify text-base my-2">
              {category}
              {
                'is an essential part of daily life in delhi. Whether you are looking for professional services, products, or local offers, this category encompasses everything you need. From reliable service providers to unique offerings, we have gathered all the top choices for you.'
              }
            </StyledText>
            <StyledText className="mt-5 text-dark text-justify text-base font-medium">
              {'Subcategories and available services'}
            </StyledText>
          </StyledView>
          <StyledView>
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
              <StyledView className="my-5">
                <StyledText className="text-base text-center my-2">
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
