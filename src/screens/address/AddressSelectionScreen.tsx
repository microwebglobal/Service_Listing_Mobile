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
import {SearchBarComponent} from '../../components/Searchbar';
import AppHeader from '../../components/AppHeader';
import {Address} from '../category/CategoryScreen';
import {useFocusEffect} from '@react-navigation/native';
import {instance} from '../../api/instance';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../utils/Colors';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const AddressSelectionScreen: Screen<'SelectAddress'> = () => {
  const navigation = useNav();
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
          className="py-5"
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
            // navigation.pop();
            navigation.navigate('ServiceSchedule', {address: selectedAddress});
          }}>
          <View className="flex-row items-center gap-x-5 overflow-hidden">
            {address.type === 'work' ? (
              <MaterialIcons
                name="work-outline"
                size={18}
                color={Colors.Primary}
              />
            ) : (
              <AntDesign name="home" size={20} color={Colors.Primary} />
            )}
            {address.line2 ? (
              <Text className="basis-3/4 text-base text-dark">
                {address.line1 +
                  ' ' +
                  address.line2 +
                  ', ' +
                  address.city +
                  ', ' +
                  address.state}
              </Text>
            ) : (
              <Text className="basis-3/4 text-base text-dark">
                {address.line1 + ', ' + address.city + ', ' + address.state}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddressDetails', {address: address});
          }}>
          <MaterialIcons name="edit" size={18} color={Colors.Gray} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView className="bg-white" showsVerticalScrollIndicator={false}>
      <AppHeader title={'Addresses'} back={true} />
      <View className="my-5">
        <View style={{paddingHorizontal: RPW(6)}}>
          <SearchBarComponent
            placeholder={'Search for an address'}
            iconName={'search'}
            onSearch={(text: string) => {
              // navigation.pop();
              navigation.navigate('ServiceSchedule', {address: text});
            }}
          />
          <Text className="mt-5 mb-2 text-lg text-black">
            Available Addresses
          </Text>
        </View>

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
