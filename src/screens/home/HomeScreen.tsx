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
  RefreshControl,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from '../../utils/Colors';
import {useAppSelector} from '../../redux';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import featuredData from '../../data/featuredData';
import offerCardData from '../../data/offerList';
import {FeaturedCard} from '../../components/FeaturedCard';
import {instance} from '../../api/instance';
import {useNav} from '../../navigation/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';

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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const localCart = useAppSelector(state => state.cart.cart) || [];

  messaging().onNotificationOpenedApp((remoteMessage: any) => {
    navigation.navigate('NotificationHandler', {remoteMessage});
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage: any) => {
      if (remoteMessage) {
        navigation.navigate('NotificationHandler', {remoteMessage});
      }
    });

  const fetchUserData = useCallback(async () => {
    await instance.get(`/customer-profiles/user/${user?.id}`).then(response => {
      setUserName(response.data.name);
    });
  }, [user]);

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
      BackHandler.addEventListener('hardwareBackPress', handlerBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handlerBackPress);
      };
    }, [fetchUserData, getHour]),
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

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-grow bg-white"
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header bar */}
        <View
          className="flex-row items-center justify-between pt-5 pb-4 bg-white"
          style={{paddingHorizontal: RPW(4)}}>
          <View className="flex-0.9">
            <Text className="text-xl font-medium text-dark">
              {hour < 12 ? 'Good Morning,' : 'Good evening,'}
            </Text>
            <Text className="text-xl font-medium text-dark">
              {userName?.split(' ')[0]}!
            </Text>
          </View>

          <View className="flex-row float-right items-center space-x-4">
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
