import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNav} from '../../navigation/RootNavigation';
import {Colors} from '../../utils/Colors';
import {Button} from '../../components/rneui';
import {SearchBarComponent} from '../../components/Searchbar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAppSelector} from '../../redux';
import axios from 'axios';
import {API_BASE} from '@env';

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
  const [addresses, setAddresses] = useState<Array<string>>([]);
  const [searchText, setSearchText] = useState<string>();
  // const dispatch = useDispatch();
  const user = useAppSelector(state => state.user.user);

  const submit = () => {
    // Save the addresses to the redux store
    // dispatch(addAddress(addresses));
    setLoading(true);
    axios
      .post(`${API_BASE}/auth/customer/login/send-otp`, {
        mobile: user?.mobile,
      })
      .then(() => {
        navigation.navigate('Verification', {phone: user?.mobile});
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (searchText) {
      setAddresses([...addresses, searchText]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

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
        keyboardShouldPersistTaps="always"
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
            <SearchBarComponent
              onSearch={(text: string) => {
                setSearchText(text);
              }}
            />
          </View>
          <View className="w-12 h-12 p-2 ml-2 items-center justify-center rounded-md bg-lightGrey">
            <TouchableOpacity onPress={() => {}}>
              <AntDesign name="search1" size={20} color={Colors.Dark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Render Address list */}
        {addresses.map((address, index) => (
          <View
            key={index}
            className="px-2 pr-4 py-3 mb-2 flex-row items-center justify-between  bg-lightGrey rounded-lg">
            <Text className="text-dark text-base">{address}</Text>
            <Entypo
              name="cross"
              size={20}
              color={Colors.Gray}
              onPress={() => {
                setAddresses(addresses.filter(item => item !== address));
              }}
            />
          </View>
        ))}

        {/* Button */}
        <View className="mt-14">
          <Button
            loading={loading}
            title={'Finish'}
            onPress={(Keyboard.dismiss(), submit)}
            primary
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
