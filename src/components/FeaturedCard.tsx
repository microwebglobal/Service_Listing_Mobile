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
import {styled} from 'nativewind';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledFlatList = styled(FlatList);
const StyledScrollView = styled(ScrollView);

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
      <StyledView className="mr-5">
        <StyledTouchableOpacity
          className="pb-5 bg-white rounded-xl shadow-sm shadow-black"
          onPress={() => {}}>
          <StyledView className="overflow-hidden">
            <StyledImage
              className="rounded-t-xl"
              source={item.imageURI}
              style={styles.Image}
            />
          </StyledView>
          <StyledView className="flex-row">
            <StyledView className="relative -top-40 left-5 px-3 py-1 basis-1/4 rounded-full bg-white">
              <StyledText className="text-sm uppercase font-medium text-primary">
                {item.category}
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledView className="flex-row justify-end">
            <StyledView className="relative -top-10 right-5 px-3 py-1 basis-1/4 rounded-full bg-primary border-2 border-white">
              <StyledText className="text-sm uppercase font-medium text-white">
                ${item.price}
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledView className="-mt-10 ml-5 bg-white">
            <StyledView className="flex-row items-center gap-3">
              <StarRatingDisplay
                maxStars={5}
                starSize={20}
                rating={item.rating}
              />
              <StyledText className="text-base font-medium">
                {item.rating}
              </StyledText>
            </StyledView>
            <StyledText className="mt-2 text-xl font-medium text-black">
              {item.title}
              {'...'}
            </StyledText>
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    );
  };

  return (
    <StyledView className="py-3">
      <StyledView>
        <StyledView
          className="my-2 flex-row justify-between items-center"
          style={{marginHorizontal: RPW(5)}}>
          <StyledText className="text-lg font-medium text-black">
            Featured
          </StyledText>
          <TouchableOpacity>
            <StyledText className="text-dark">View All</StyledText>
          </TouchableOpacity>
        </StyledView>

        <StyledScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <StyledView className="flex items-center">
            <StyledFlatList
              className="mt-2"
              style={{paddingHorizontal: RPW(5)}}
              horizontal={true}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={featuredData}
              keyExtractor={(item: any) => item.id}
              renderItem={_renderFeaturedItem}
            />
          </StyledView>
        </StyledScrollView>
      </StyledView>
    </StyledView>
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
