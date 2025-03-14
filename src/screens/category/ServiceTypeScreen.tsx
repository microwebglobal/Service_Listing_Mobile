import {
  View,
  Text,
  ActivityIndicator,
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
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {Screen} from '../../navigation/RootNavigation';
import {RenderService} from '../../components/RenderService';
import {RenderPackage} from '../../components/RenderPackage';

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
  overview: string;
  base_price: string;
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

export const ServiceTypeScreen: Screen<'ServiceType'> = ({route}) => {
  const {subCategoryId, subCategory} = route.params;
  const tabBarHeight = useBottomTabBarHeight();
  const [isLoading, setIsLoading] = useState(true);
  const [serviceTypeData, setServiceTypeData] = useState<Array<ServiceType>>(
    [],
  );

  useEffect(() => {
    try {
      instance.get(`/subcategories/${subCategoryId}/types`).then(response => {
        // console.log('service type data ', response.data);
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
      <StyledView className="w-full px-2 py-3 mb-2 rounded-xl drop-shadow-xl">
        <View className="flex-row items-center space-x-5 bg-white">
          <View className="ml-1 bg-lightGrey rounded-lg">
            <Image
              source={{uri: `${SERVER_BASE}${item.icon_url}`}}
              style={{width: 50, height: 50, borderRadius: 8}}
            />
          </View>
          <View className="">
            <Text className="text-lg font-medium text-black">{item.name}</Text>
            <Text className="text-base text-dark">{item.description}</Text>
          </View>
        </View>

        {/* Render services */}
        <View className="mx-2 mt-5">
          {item.Services.map((service, index: number) => (
            <View key={index}>
              <RenderService service={service} />
            </View>
          ))}
        </View>

        {/* Render packages */}
        <RenderPackage typeId={item.type_id} />

        <View className="mt-5 h-0.5 bg-lightGrey" />
      </StyledView>
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
        className="flex-grow"
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}>
        <AppHeader back={true} title={subCategory} />
        <View
          className="flex-1 justify-between"
          style={{marginHorizontal: RPW(4)}}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
