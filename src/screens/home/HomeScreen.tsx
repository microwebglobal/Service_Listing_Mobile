import {
  View,
  Text,
  Alert,
  Image,
  FlatList,
  Animated,
  Dimensions,
  StyleSheet,
  BackHandler,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SERVER_BASE} from '@env';
import {styled} from 'nativewind';
import {Colors} from '../../utils/Colors';
import {useAppSelector} from '../../redux';
import {instance} from '../../api/instance';
import offerCardData from '../../data/offerList';
import featuredData from '../../data/featuredData';
import {Carousel} from '../../components/Carousel';
import {useNav} from '../../navigation/RootNavigation';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FeaturedCard} from '../../components/FeaturedCard';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import {Address, Category, City} from '../category/CategoryScreen';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

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
const StyledFlatList = styled(FlatList);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledAnimatedView = styled(Animated.View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledAnimatedScrollView = styled(Animated.ScrollView);

export const HomeScreen = () => {
  const navigation = useNav();
  const tabBarHeight = useBottomTabBarHeight();
  const user = useAppSelector(state => state.user.user);
  const [hour, setHour] = useState<number>(0);
  const [userName, setUserName] = useState<string>();
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [primaryAddress, setPrimaryAddress] = useState<Address>();
  const localCart = useAppSelector(state => state.cart.cart) || [];
  // Animated scroll
  const scrolling = useRef(new Animated.Value(0)).current;
  const diffClamp = Animated.diffClamp(scrolling, 0, 200);
  const translation = diffClamp.interpolate({
    inputRange: [0, 200],
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
      .catch(() => {
        Alert.alert(
          'No internet connection',
          'Please check your internet connection and try again',
        );
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

  useEffect(() => {
    instance
      .get('/cities')
      .then(response => {
        response.data.map((city: City) => {
          setCategories([...city.serviceCategories]);
        });
      })
      .catch(e => {
        console.log('Error ', e);
      });
  }, []);

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
      <StyledView className="mb-5">
        <StyledTouchableOpacity
          className="pb-5 bg-lightGrey rounded-xl"
          onPress={() => {}}>
          <StyledView className="overflow-hidden">
            <StyledImage
              className="rounded-t-xl "
              source={item.imageURI}
              style={styles.Image}
            />
          </StyledView>
          <StyledView className="mt-2 ml-5">
            <StyledText className="mt-2 text-xl font-medium text-dark first-letter:capitalize">
              {item.description}
            </StyledText>
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    );
  };

  const _renderCategoryItem = ({item}: any) => {
    return (
      <StyledView className="flex-wrap basis-[35] mt-3">
        <StyledTouchableOpacity
          onPress={() => {
            navigation.navigate('TabNavigator', {
              screen: 'Service',
            });
          }}>
          <StyledView className="flex-1">
            <StyledImage
              source={{uri: `${SERVER_BASE}${item.icon_url}`}}
              style={styles.categoryImage}
            />
            <StyledText
              numberOfLines={2}
              ellipsizeMode="tail"
              className="my-1 text-sm text-center text-black">
              {item.name}
            </StyledText>
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      {/* Header bar */}
      <StyledAnimatedView
        className="absolute top-4 right-0 left-0 z-10 bg-white shadow-md shadow-black"
        style={{
          transform: [{translateY: translation}],
          paddingHorizontal: RPW(4),
        }}>
        <StyledView className="flex-row items-center justify-between py-4">
          <StyledView className="">
            <StyledText
              numberOfLines={1}
              ellipsizeMode="tail"
              className="mb-1 text-lg font-PoppinsMedium text-black">
              {hour < 12 ? 'Good Morning,' : 'Good evening,'}{' '}
              {userName?.split(' ')[0]}!
            </StyledText>

            {primaryAddress && (
              <StyledTouchableOpacity
                onPress={() => {
                  navigation.navigate('SelectAddress', {prevScreen: 'Home'});
                }}>
                <StyledView className="flex-row items-center space-x-2">
                  <StyledText
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-sm text-dark font-PoppinsMedium">
                    {primaryAddress?.line2
                      ? primaryAddress.line1 +
                        ' ' +
                        primaryAddress?.line2 +
                        ', ' +
                        primaryAddress.city
                      : primaryAddress?.line1 + ', ' + primaryAddress?.city}
                  </StyledText>
                </StyledView>
              </StyledTouchableOpacity>
            )}
          </StyledView>

          <StyledView className="basis-1/4 flex-row justify-end items-center space-x-5">
            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate('SelectedItems');
              }}>
              <StyledView>
                {localCart?.length > 0 && (
                  <StyledView className="z-10 bg-primary w-5 h-5 rounded-full items-center justify-center absolute -top-2 -right-2">
                    <StyledText className="text-sm text-white font-normal">
                      {localCart?.length}
                    </StyledText>
                  </StyledView>
                )}

                <Ionicons
                  name={'cart-outline'}
                  size={26}
                  color={Colors.Black}
                />
              </StyledView>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate('Notification');
              }}>
              <Ionicons
                name={'notifications-outline'}
                size={25}
                color={Colors.Black}
              />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledAnimatedView>

      <StyledAnimatedScrollView
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
        <StyledView className="mt-28">
          <Carousel />
        </StyledView>

        <StyledView style={{marginHorizontal: RPW(5)}}>
          <StyledText className="text-lg text-black font-medium">
            Explore all services
          </StyledText>
          <StyledView className="flex-1 justify-between">
            <StyledFlatList
              horizontal={false}
              numColumns={3}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={categories}
              keyExtractor={(item: any) => item.category_id}
              renderItem={_renderCategoryItem}
            />
          </StyledView>
        </StyledView>

        <StyledView className="my-4 h-2 bg-lightGrey" />
        <FeaturedCard featuredData={featuredData} />
        <StyledView className="my-4 h-2 bg-lightGrey" />

        <StyledView className="my-8" style={{marginHorizontal: RPW(5)}}>
          <StyledFlatList
            horizontal={false}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            data={offerCardData}
            keyExtractor={(item: any) => item.id}
            renderItem={_renderOfferItem}
          />
        </StyledView>
      </StyledAnimatedScrollView>
    </StyledSafeAreaView>
  );
};

const styles = StyleSheet.create({
  Image: {
    width: RPW(88),
    height: RPH(20),
    resizeMode: 'cover',
  },
  categoryImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    resizeMode: 'contain',
  },
});
