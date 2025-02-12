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
import {useAppSelector} from '../../redux';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import featuredData from '../../data/featuredData';
import offerCardData from '../../data/offerList';
import {FeaturedCard} from '../../components/FeaturedCard';
import {instance} from '../../api/instance';
import {useDispatch} from 'react-redux';
import {setUser} from '../../redux/user/user.slice';

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
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const user = useAppSelector(state => state.user.user);
  const [hour, setHour] = React.useState<number>(0);

  useEffect(() => {
    instance.get(`/customer-profiles/user/${user?.id}`).then(response => {
      dispatch(setUser(response.data));
    });
  }, [dispatch, user?.id]);

  const getHour = async () => {
    const date = new Date();
    setHour(date.getHours());
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
          <View className="overflow-hidden">
            <Image
              className="rounded-t-xl "
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
            <Text className="text-xl font-medium text-dark">{user?.name.split(' ')[0]}!</Text>
          </View>

          <View className="float-right bg-lightGrey rounded-full w-12 h-12 justify-center items-center">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Profile' as never);
              }}>
              <FontAwesome name="user-o" size={25} color={Colors.Dark} />
            </TouchableOpacity>
          </View>
        </View>

        <FeaturedCard featuredData={featuredData} />

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
  Image: {
    width: RPW(88),
    height: RPH(20),
    resizeMode: 'cover',
  },
});
