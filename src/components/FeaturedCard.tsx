import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import React from 'react';
import {StarRatingDisplay} from 'react-native-star-rating-widget';

// Get screen dimension
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

interface CardItem {
  id: string;
  rating: number;
  title: string;
  price: number;
  category: string;
  imageURI: string;
}

interface FeatureCardProps {
  featuredData: Array<CardItem>;
}

export const FeaturedCard = ({featuredData}: FeatureCardProps) => {
  const _renderFeaturedItem = ({item}: any) => {
    return (
      <View className="mr-5">
        <TouchableOpacity
          className="pb-5 bg-white rounded-xl shadow-sm shadow-black"
          onPress={() => {}}>
          <View className="overflow-hidden">
            <Image
              className="rounded-t-xl"
              source={item.imageURI}
              style={styles.Image}
            />
          </View>
          <View className="flex-row">
            <View className="relative -top-40 left-5 px-3 py-1 basis-1/4 rounded-full bg-white">
              <Text className="text-sm uppercase font-medium text-primary">
                {item.category}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-end">
            <View className="relative -top-10 right-5 px-3 py-1 basis-1/4 rounded-full bg-primary border-2 border-white">
              <Text className="text-sm uppercase font-medium text-white">
                ${item.price}
              </Text>
            </View>
          </View>
          <View className="-mt-10 ml-5 bg-white">
            <View className="flex-row items-center gap-3">
              <StarRatingDisplay
                maxStars={5}
                starSize={20}
                rating={item.rating}
              />
              <Text className="text-base font-medium">{item.rating}</Text>
            </View>
            <Text className="mt-2 text-xl font-medium text-black">
              {item.title}
              {'...'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="py-3">
      <View>
        <View
          className="my-2 flex-row justify-between items-center"
          style={{marginHorizontal: RPW(5)}}>
          <Text className="text-lg font-medium text-black">Featured</Text>
          <TouchableOpacity>
            <Text className="text-dark">View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View className="flex items-center">
            <FlatList
              className="mt-2"
              style={{paddingHorizontal: RPW(5)}}
              horizontal={true}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={featuredData}
              keyExtractor={(item: any) => item.id}
              renderItem={_renderFeaturedItem}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ImageStyles: {
    width: RPW(10),
    height: RPW(10),
    resizeMode: 'contain',
  },
  Image: {
    width: RPW(88),
    height: RPH(20),
    resizeMode: 'cover',
  },
});
