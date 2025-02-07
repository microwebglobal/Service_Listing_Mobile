import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNav} from '../../navigation/RootNavigation';
import {Colors} from '../../utils/Colors';
import axios from 'axios';
import {Button} from '../../components/rneui';
import {SearchBarComponent} from '../../components/Searchbar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {API_BASE} from '@env';

interface Address {
  type: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  is_primary: boolean;
}

// Get screen dimension
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// RPW and RPH are functions to set responsive width and height
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

export const SelectLocation = () => {
  const navigation = useNav();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Array<Address>>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    axios
      .get(`${API_BASE}/users/addresses`)
      .then(response => {
        setAddresses(response.data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        style={{
          marginHorizontal: RPW(8),
          marginTop: RPH(5),
        }}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back-ios-new"
              size={24}
              color={Colors.Dark}
            />
          </TouchableOpacity>
        </View>

        <View className="my-8 items-center">
          <Text className="text-2xl font-medium text-black">
            Select Your Location
          </Text>
          <Text className="mt-3 text-base font-medium text-dark">
            Add Multiple Locations
          </Text>
        </View>

        {/* Location input field */}
        <View className="flex-row mb-10 items-center flex justify-between">
          <View className="flex-1">
            <SearchBarComponent onSearch={text => setSearch(text)} />
          </View>
          <View className="w-12 h-12 p-2 ml-2 items-center justify-center rounded-md bg-lightGrey">
            <TouchableOpacity>
              <AntDesign name="search1" size={20} color={Colors.Dark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Render Address list */}
        {addresses.map((address, index) => (
          <View
            key={index}
            className="px-2 pr-4 py-3 mb-2 flex-row items-center justify-between  bg-lightGrey rounded-lg">
            <Text className="text-dark">
              {address.line1} {address.line2} {address.city} {address.state}
            </Text>
            <Entypo name="cross" size={20} color={Colors.Gray} />
          </View>
        ))}

        {/* Button */}
        <View className="mt-14">
          <Button
            loading={loading}
            title={'Finish'}
            onPress={() => {
              navigation.navigate('Home');
            }}
            primary
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
