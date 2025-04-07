import {
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {styled} from 'nativewind';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {Address} from '../category/CategoryScreen';
import {FlatList} from 'react-native-gesture-handler';
import {AddressForm} from '../../components/AddressForm';
import {useFocusEffect} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const EditLocationScreen: Screen<'EditLocation'> = () => {
  const navigation = useNav();
  const snapPoints = useMemo(() => ['98%'], []);
  const [addressList, setAddressList] = useState<Array<Address>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleClosePress = () => {
    bottomSheetRef.current?.close();
    fetchAddress();
  };

  const fetchAddress = useCallback(() => {
    setIsLoading(true);
    try {
      instance.get('/users/addresses').then(response => {
        setAddressList(response.data);
      });
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, [fetchAddress]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAddress();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, [fetchAddress]);

  const addLocationType = (type: string, iconName: string) => {
    return (
      <StyledView className="flex-row items-center mb-8">
        <StyledTouchableOpacity
          className="flex-row items-center"
          onPress={() => {
            bottomSheetRef.current?.expand();
          }}>
          <StyledView className="bg-lightGrey rounded-full p-2">
            {type === 'Home' && (
              <AntDesign name={iconName} size={18} color={Colors.Black} />
            )}
            {type === 'Work' && (
              <MaterialIcons name={iconName} size={18} color={Colors.Black} />
            )}
          </StyledView>
          <StyledView className="space-y-1">
            <StyledText className="text-base text-black ml-3 font-PoppinsMedium">
              {type}
            </StyledText>
            <StyledText className="text-sm text-gray ml-3 font-PoppinsRegular">
              Add {type}
            </StyledText>
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    );
  };

  const _renderAddress = (address: Address) => {
    return (
      <StyledView className="my-1 border-b border-lightGrey">
        <StyledView
          key={address.id}
          style={{paddingHorizontal: RPW(0)}}
          className="py-4 flex-row flex-wrap items-center justify-between overflow-hidden">
          <StyledView className="flex-row items-center space-x-3 overflow-hidden">
            {address.type === 'work' && (
              <MaterialIcons
                name="work-outline"
                size={20}
                color={Colors.Dark}
              />
            )}
            {address.type === 'home' && (
              <AntDesign name="home" size={22} color={Colors.Dark} />
            )}
            {address.type === 'other' && (
              <Octicons name="location" size={22} color={Colors.Dark} />
            )}
            {address.line2 ? (
              <StyledText className="basis-4/6 text-base text-black font-PoppinsRegular">
                {address.line1 +
                  ' ' +
                  address.line2 +
                  ', ' +
                  address.city +
                  ', ' +
                  address.state}
              </StyledText>
            ) : (
              <StyledText className="basis-4/6 text-base text-black font-PoppinsRegular">
                {address.line1 + ', ' + address.city + ', ' + address.state}
              </StyledText>
            )}
          </StyledView>
          <StyledTouchableOpacity
            className="basis-1/6 items-end mr-1"
            onPress={() => {
              setIsLoading(true);
              setTimeout(() => {
                navigation.navigate('AddressDetails', {
                  address: address,
                  isEdit: true,
                });
              }, 1000);
            }}>
            <MaterialIcons name="edit" size={18} color={Colors.Dark} />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <AppHeader title="Your Location" back={true} />
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <StyledView className="pt-10">
          <StyledView className="mb-3" style={{paddingHorizontal: RPW(5)}}>
            <StyledText className="text-3xl text-black font-PoppinsMedium">
              Location
            </StyledText>
            <StyledView className="flex-1 mt-8">
              {addLocationType('Home', 'home')}
              {addLocationType('Work', 'work-outline')}

              <StyledText className="text-base text-black font-PoppinsMedium">
                Available Addresses
              </StyledText>
              {isLoading && (
                <StyledView className="items-center justify-center flex-1 bg-white">
                  <LottieView
                    source={require('../../assets/animations/loading.json')}
                    autoPlay
                    loop
                    style={{width: '60%', height: '10%'}}
                  />
                </StyledView>
              )}

              {addressList.length === 0 ? (
                <StyledView className="mt-20">
                  <StyledText className="text-base text-center text-dark font-PoppinsRegular">
                    No address available
                  </StyledText>
                </StyledView>
              ) : null}
            </StyledView>

            <FlatList
              horizontal={false}
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={addressList}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => _renderAddress(item)}
            />
          </StyledView>
        </StyledView>
      </StyledScrollView>

      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} />
        )}>
        <BottomSheetView>
          <AddressForm btnTitle="Save Address" onClose={handleClosePress} />
        </BottomSheetView>
      </BottomSheet>
    </StyledSafeAreaView>
  );
};
