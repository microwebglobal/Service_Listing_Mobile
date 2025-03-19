import {
  View,
  Text,
  BackHandler,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from '../../utils/Colors';
import {useAppSelector} from '../../redux';
import {instance} from '../../api/instance';
import offerCardData from '../../data/offerList';
import featuredData from '../../data/featuredData';
import {Address} from '../category/CategoryScreen';
import {useNav} from '../../navigation/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FeaturedCard} from '../../components/FeaturedCard';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

export const HomeScreen = () => {
  const navigation = useNav();
  const tabBarHeight = useBottomTabBarHeight();
  const user = useAppSelector(state => state.user.user);
  const [hour, setHour] = useState<number>(0);
  const [userName, setUserName] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [primaryAddress, setPrimaryAddress] = useState<Address>();
  const localCart = useAppSelector(state => state.cart.cart) || [];
  // Animated scroll
  const scrolling = useRef(new Animated.Value(0)).current;
  const diffClamp = Animated.diffClamp(scrolling, 10, 200);
  const translation = diffClamp.interpolate({
    inputRange: [10, 200],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const fetchUserData = useCallback(async () => {
    await instance.get(`/customer-profiles/user/${user?.id}`).then(response => {
      setUserName(response.data.name);
    });
  }, [user]);

  const fetchAddress = useCallback(async () => {
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

  const getHour = useCallback(async () => {
    const date = new Date();
    setHour(date.getHours());
  }, []);

  // Back handler function
  const handlerBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      getHour();
      fetchUserData();
      fetchAddress();
      BackHandler.addEventListener('hardwareBackPress', handlerBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handlerBackPress);
      };
    }, [fetchAddress, fetchUserData, getHour]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

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

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color={Colors.Black} />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header bar */}
      <Animated.View
        className="absolute top-0 right-0 left-0 z-10 bg-white shadow-md shadow-black"
        style={{
          transform: [{translateY: translation}],
          paddingHorizontal: RPW(4),
        }}>
        <View className="flex-row items-center justify-between py-4">
          <View className="basis-3/4">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="mb-1 text-lg font-medium text-black">
              {hour < 12 ? 'Good Morning,' : 'Good evening,'}{' '}
              {userName?.split(' ')[0]}!
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SelectAddress', {prevScreen: 'Home'});
              }}>
              <View className="flex-row items-center basis-5/6 space-x-2">
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="basis-5/6 text-base text-dark font-normal">
                  {primaryAddress?.line2
                    ? primaryAddress.line1 +
                      ' ' +
                      primaryAddress?.line2 +
                      ', ' +
                      primaryAddress.city
                    : primaryAddress?.line1 + ', ' + primaryAddress?.city}
                </Text>
                {/* <MaterialCommunityIcons
                  name="chevron-down"
                  size={25}
                  color={Colors.Dark}
                /> */}
              </View>
            </TouchableOpacity>
          </View>

          <View className="basis-1/4 flex-row justify-end items-center space-x-5">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SelectedItems');
              }}>
              <View>
                {localCart?.length > 0 && (
                  <View className="z-10 bg-primary w-5 h-5 rounded-full items-center justify-center absolute -top-2 -right-2">
                    <Text className="text-sm text-white font-normal">
                      {localCart?.length}
                    </Text>
                  </View>
                )}

                <Ionicons
                  name={'cart-outline'}
                  size={26}
                  color={Colors.Black}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Notification');
              }}>
              <Ionicons
                name={'notifications-outline'}
                size={25}
                color={Colors.Black}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrolling}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View className="mt-20">
          <FeaturedCard featuredData={featuredData} />
        </View>

        <View className="my-8" style={{marginHorizontal: RPW(5)}}>
          <FlatList
            horizontal={false}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            data={offerCardData}
            keyExtractor={(item: any) => item.id}
            renderItem={_renderOfferItem}
          />
        </View>
      </Animated.ScrollView>
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
