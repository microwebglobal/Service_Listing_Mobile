import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppHeader from '../../components/AppHeader';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {instance} from '../../api/instance';
import {Address} from '../category/CategoryScreen';
import {FlatList} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../utils/Colors';
import {AddressForm} from '../../components/AddressForm';
import BottomSheet from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

export const EditLocationScreen: Screen<'EditLocation'> = () => {
  const navigation = useNav();
  const [addressList, setAddressList] = useState<Array<Address>>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  const addLocationType = (type: string, iconName: string) => {
    return (
      <View className="flex-row items-center mb-8">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => {
            bottomSheetRef.current?.expand();
          }}>
          <View className="bg-lightGrey rounded-full p-2">
            {type === 'Home' && (
              <AntDesign name={iconName} size={18} color={Colors.Primary} />
            )}
            {type === 'Work' && (
              <MaterialIcons name={iconName} size={18} color={Colors.Primary} />
            )}
          </View>
          <View className="space-y-1">
            <Text className="text-base text-black ml-3">{type}</Text>
            <Text className="text-sm text-gray ml-3">Add {type}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const _renderAddress = (address: Address) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AddressDetails', {address: address});
        }}>
        <View className="my-2 bg-lightGrey p-3 rounded-lg" key={address.id}>
          <View className="flex-row items-center gap-x-3 overflow-hidden">
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
              <Text className="text-base text-dark">
                {address.line1 +
                  ' ' +
                  address.line2 +
                  ', ' +
                  address.city +
                  ', ' +
                  address.state}
              </Text>
            ) : (
              <Text className="text-base text-dark">
                {address.line1 + ', ' + address.city + ', ' + address.state}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <AppHeader title="Your Location" back={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          className="pt-10"
          style={{paddingHorizontal: RPW(6), height: RPH(95)}}>
          <Text className="text-3xl text-black font-semibold">Location</Text>
          <View className="flex-1 mt-8">
            {addLocationType('Home', 'home')}
            {addLocationType('Work', 'work-outline')}

            <View className="">
              <TouchableOpacity
                onPress={() => {
                  setIsChecked(!isChecked);
                  fetchAddress();
                }}>
                <View className="flex-row items-center justify-between">
                  <Text className="text-base text-black">View All</Text>
                  {isChecked ? (
                    <View>
                      <MaterialCommunityIcons
                        name="chevron-up"
                        size={30}
                        color={Colors.Gray}
                      />
                    </View>
                  ) : (
                    <View>
                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={30}
                        color={Colors.Gray}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {isChecked && (
                <FlatList
                  horizontal={false}
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  data={addressList}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => _renderAddress(item)}
                />
              )}

              {isChecked && addressList.length === 0 ? (
                <View className="mt-20">
                  <Text className="text-base text-center text-dark">
                    No address available
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <AddressForm bottomSheetRef={bottomSheetRef} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
