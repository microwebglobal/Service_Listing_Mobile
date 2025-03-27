import {
  View,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {Address} from '../category/CategoryScreen';
import {useFocusEffect} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SearchBarComponent} from '../../components/Searchbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const AddressSelectionScreen: Screen<'SelectAddress'> = ({route}) => {
  const navigation = useNav();
  const {prevScreen} = route.params;
  const [addressList, setAddressList] = useState<Array<Address>>([]);

  const fetchAddress = useCallback(() => {
    try {
      instance.get('/users/addresses').then(response => {
        setAddressList(response.data);
      });
    } catch (e) {
      console.log('Error ', e);
    }
  }, []);

  const setPrimaryAddress = useCallback(
    (id: number) => {
      try {
        instance.patch(`/users/addresses/${id}/primary`).then(() => {
          navigation.pop();
        });
      } catch (e) {
        console.log('Error ', e);
      }
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, [fetchAddress]),
  );

  const _renderAddress = (address: Address) => {
    return (
      <View
        key={address.id}
        style={{paddingHorizontal: RPW(6)}}
        className="my-2 flex-row flex-wrap bg-lightGrey items-center justify-between">
        <TouchableOpacity
          className="flex-1 py-5"
          onPress={() => {
            const selectedAddress: string = address.line2
              ? address.line1 +
                ' ' +
                address.line2 +
                ', ' +
                address.city +
                ', ' +
                address.state
              : address.line1 + ', ' + address.city + ', ' + address.state;
            prevScreen === 'Home'
              ? setPrimaryAddress(address.id)
              : navigation.navigate('ServiceSchedule', {
                  address: selectedAddress,
                });
          }}>
          <View className="flex-row items-center gap-x-5 overflow-hidden">
            {address.type === 'work' ? (
              <MaterialIcons
                name="work-outline"
                size={20}
                color={Colors.Black}
              />
            ) : address.type === 'home' ? (
              <AntDesign name="home" size={22} color={Colors.Black} />
            ) : (
              <Octicons name="location" size={22} color={Colors.Black} />
            )}
            {address.line2 ? (
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className="basis-3/4 text-base text-black">
                {address.line1 +
                  ' ' +
                  address.line2 +
                  ', ' +
                  address.city +
                  ', ' +
                  address.state}
              </Text>
            ) : (
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className="basis-3/4 text-base text-black">
                {address.line1 + ', ' + address.city + ', ' + address.state}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddressDetails', {address: address});
          }}>
          <MaterialIcons name="edit" size={18} color={Colors.Dark} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView className="bg-white" showsVerticalScrollIndicator={false}>
      <AppHeader title={'Addresses'} back={true} />
      <View className="my-5">
        <View style={{paddingHorizontal: RPW(5)}}>
          <SearchBarComponent
            placeholder={'Search for your location'}
            iconName={'search'}
            onSearch={(text: string) => {
              prevScreen === 'Home'
                ? navigation.pop()
                : navigation.navigate('ServiceSchedule', {address: text});
            }}
          />

          <TouchableOpacity
            className="my-5 flex-row items-center gap-x-3"
            onPress={() => {}}>
            <MaterialIcons
              name="my-location"
              size={20}
              color={Colors.Primary}
            />
            <Text className="text-base text-primary font-medium">
              Use current location
            </Text>
          </TouchableOpacity>
        </View>
        <View className="h-2 bg-lightGrey" />

        <Text
          className="mt-5 mb-2 text-lg text-black"
          style={{paddingHorizontal: RPW(5)}}>
          Available Addresses
        </Text>

        <FlatList
          horizontal={false}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          data={addressList}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => _renderAddress(item)}
        />
      </View>
    </ScrollView>
  );
};
