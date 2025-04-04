import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {SERVER_BASE} from '@env';
import {styled} from 'nativewind';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {Screen} from '../../navigation/RootNavigation';
import {RenderService} from '../../components/RenderService';
import {RenderPackage} from '../../components/RenderPackage';
import {LoadingIndicator} from '../../components/LoadingIndicator';

interface CitySpecificPricing {
  id: number;
  city_id: string;
  item_id: string;
  item_type: string;
  price: string;
}

export interface ServiceItem {
  item_id: string;
  service_id: string;
  name: string;
  description: string;
  duration_hours: number;
  duration_minutes: number;
  overview: string;
  base_price: string;
  advance_percentage: string;
  is_home_visit: boolean;
  icon_url: string;
  CitySpecificPricings: Array<CitySpecificPricing>;
}

export interface Service {
  service_id: string;
  type_id: string;
  name: string;
  description: string;
  display_order: number;
  icon_url: string;
}

export interface ServiceType {
  type_id: string;
  sub_category_id: string;
  name: string;
  icon_url: string;
  description: string;
  display_order: number;
  Services: Array<Service>;
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

export const ServiceTypeScreen: Screen<'ServiceType'> = ({route}) => {
  const {subCategoryId, subCategory} = route.params;
  const tabBarHeight = useBottomTabBarHeight();
  const [isLoading, setIsLoading] = useState(true);
  const [serviceTypeData, setServiceTypeData] = useState<Array<ServiceType>>(
    [],
  );

  console.log('ServiceTypeScreen', subCategoryId, subCategory);

  useEffect(() => {
    try {
      instance.get(`/subcategories/${subCategoryId}/types`).then(response => {
        setServiceTypeData(response.data);
      });
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [subCategoryId]);

  const _renderServiceType = ({item}: {item: ServiceType}) => {
    return (
      <StyledView className="w-full py-3 mb-2 rounded-xl drop-shadow-xl">
        <StyledView className="flex-row items-center space-x-5 bg-white">
          <StyledView className="ml-1 bg-lightGrey rounded-lg">
            <StyledImage
              resizeMode="cover"
              className="w-16 h-16 rounded-lg"
              source={{uri: `${SERVER_BASE}${item.icon_url}`}}
            />
          </StyledView>
          <StyledView className="">
            <StyledText className="text-lg font-PoppinsMedium text-black">
              {item.name}
            </StyledText>
            <StyledText className="text-sm font-PoppinsRegular text-dark">
              {item.description}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Render services */}
        <StyledView className="mt-5">
          {item.Services.map((service, index: number) => (
            <StyledView key={index}>
              <RenderService service={service} />
            </StyledView>
          ))}
        </StyledView>

        {/* Render packages */}
        <RenderPackage typeId={item.type_id} />
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
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}>
        <AppHeader back={true} title={subCategory} cartVisible={true} />
        <StyledView
          className="flex-1 justify-between"
          style={{marginHorizontal: RPW(5)}}>
          <FlatList
            className="mt-2"
            horizontal={false}
            numColumns={1}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            data={serviceTypeData}
            keyExtractor={(serviceType: ServiceType) => serviceType.type_id}
            renderItem={_renderServiceType}
          />
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
