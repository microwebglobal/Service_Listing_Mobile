import {
  View,
  Text,
  BackHandler,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../utils/Colors';
import {CardSlider} from '../../components/CardSlider';
import {useAppSelector} from '../../redux';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import featuredData from '../../data/featuredData';
import offerCardData from '../../data/offerList';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get screen dimension
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

export const HomeScreen = () => {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const user = useAppSelector(state => state.user.user);
  const [hour, setHour] = React.useState<number>(0);

  const getHour = async () => {
    const date = new Date();
    setHour(date.getHours());
    const token = await AsyncStorage.getItem('token');
    console.log(token);
  };

  useFocusEffect(() => {
    getHour();
  });

  // Back handler function
  const handlerBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  useFocusEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handlerBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handlerBackPress);
    };
  });

  const _renderOfferItem = ({item}: any) => {
    return (
      <View className="mb-5">
        <TouchableOpacity
          className="pb-5 bg-lightGrey rounded-xl"
          onPress={() => {}}>
          <View style={styles.ImageContainer}>
            <Image
              className="rounded-t-xl"
              source={item.imageURI}
              style={styles.Image}
            />
          </View>
          <View className="mt-2 ml-5">
            <Text className="mt-2 text-xl font-medium text-dark first-letter:capitalize">
              {item.description}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const _renderFeaturedItem = ({item}: any) => {
    return (
      <View className="mr-5">
        <TouchableOpacity
          className="pb-5 bg-white rounded-xl"
          onPress={() => {}}>
          <View style={styles.ImageContainer}>
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
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-grow bg-white"
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}>
        {/* Header bar */}
        <View
          className="flex-row items-center justify-between px-8 pt-8 pb-5 bg-white"
          style={{paddingHorizontal: RPW(6)}}>
          <View className="flex-0.9">
            <Text className="text-xl font-medium text-dark">
              {hour < 12 ? 'Good Morning,' : 'Good evening,'}
            </Text>
            <Text className="text-xl font-medium text-dark">
              {user?.userName}!
            </Text>
          </View>

          <View className="float-right bg-lightGrey rounded-full w-12 h-12 justify-center items-center">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Profile');
              }}>
              <FontAwesome name="user-o" size={25} color={Colors.Dark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Call the Offer card FlatList custom component */}
        {/* <CardSlider /> */}

        <View className="py-3 bg-lightGrey">
          {/* Featured */}
          <View>
            <View
              className="my-2 flex-row justify-between items-center"
              style={{marginHorizontal: RPW(6)}}>
              <Text className="text-lg font-medium text-dark">Featured</Text>
              <TouchableOpacity>
                <Text className="text-dark">View All</Text>
              </TouchableOpacity>
            </View>

            {/* Render Featured cards horizontal list */}
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View className="flex items-center">
                <FlatList
                  className="mt-2"
                  style={{paddingHorizontal: RPW(6)}}
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

        {/* Offers */}
        <View className="my-8" style={{marginHorizontal: RPW(6)}}>
          <FlatList
            horizontal={false}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            data={offerCardData}
            keyExtractor={(item: any) => item.id}
            renderItem={_renderOfferItem}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ImageStyles: {
    width: RPW(10),
    height: RPW(10),
    resizeMode: 'contain',
  },
  IconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  Container: {
    width: 80,
    height: 60,
    bottom: 20,
    right: 20,
    elevation: 5,
  },
  ImageContainer: {
    overflow: 'hidden',
  },
  Image: {
    width: RPW(88),
    height: RPH(20),
    resizeMode: 'cover',
  },
});
