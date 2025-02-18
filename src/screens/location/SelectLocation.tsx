import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {useNav} from '../../navigation/RootNavigation';
import {Colors} from '../../utils/Colors';
import {Button} from '../../components/rneui';
import {SearchBarComponent} from '../../components/Searchbar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppHeader from '../../components/AppHeader';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import InputField from '../../components/InputFeild';
import {saveAddressList} from '../../redux/address/address.slice';
import {AddressEntity} from '../../redux/address/address.entity';
import {useDispatch} from 'react-redux';
import {Controller, useForm} from 'react-hook-form';
import {API_BASE} from '@env';
import axios from 'axios';
import {useAppSelector} from '../../redux';

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
  const dispatch = useDispatch();
  const [addressList, setAddressList] = useState<Array<AddressEntity>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>();
  const [homeAddress, setHomeAddress] = useState<AddressEntity>();
  const [workAddress, setWorkAddress] = useState<AddressEntity>();
  const [addressType, setAddressType] = useState<string>('Home');

  const snapPoints = useMemo(() => ['50%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleClosePress = () => {
    bottomSheetRef.current?.close();
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<AddressEntity>();
  const user = useAppSelector(state => state.user.user);

  const submitFinish = () => {
    dispatch(saveAddressList(addressList));
    setLoading(true);
    axios
      .post(`${API_BASE}/auth/customer/login/send-otp`, {
        mobile: user?.mobile,
      })
      .then(() => {
        user?.mobile &&
          navigation.navigate('Verification', {phone: user?.mobile});
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const submit = (data: AddressEntity) => {
    if (addressType === 'Home') {
      data.type = 'home';
      setHomeAddress(data);
      addressList[0] = data;
    }
    if (addressType === 'Work') {
      data.type = 'work';
      setWorkAddress(data);
      addressList[1] = data;
    }
    // console.log(addressList);
    handleClosePress();
    reset();
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <AppHeader back={true} />
        <View
          style={{
            marginHorizontal: RPW(6),
          }}>
          <View className="my-8 items-center">
            <Text className="text-2xl font-medium text-black">
              Select Your Location
            </Text>
            <Text className="mt-3 text-base font-medium text-dark">
              Add Multiple Locations
            </Text>
          </View>

          {/* Location input field */}
          <View className="flex-row mb-6 items-center flex justify-between">
            <View className="flex-1">
              <SearchBarComponent
                placeholder="Add location on map"
                iconName="location-outline"
                onSearch={(text: string) => {
                  setSearchText(text);
                }}
              />
            </View>
            <View className="w-12 h-12 p-2 ml-2 items-center justify-center rounded-md bg-primary">
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                }}>
                <MaterialIcons
                  name="my-location"
                  size={22}
                  color={Colors.White}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Render Address list */}
          {/* {addresses.map((address, index) => (
            <View
              key={index}
              className="px-3 pr-4 py-3 mb-2 flex-row items-center justify-between  bg-lightGrey rounded-lg">
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
          ))} */}

          <View className="w-full h-0.5 bg-lightGrey" />
          <View className="my-2">
            <Text className="my-2 text-base text-black mt-2">
              Set Location Manually
            </Text>

            {/* Add home address */}
            <View className="flex-row items-center mt-4">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => {
                  setAddressType('Home');
                  bottomSheetRef.current?.expand();
                }}>
                <View className="bg-lightGrey rounded-full p-2">
                  <AntDesign name="home" size={18} color={Colors.Primary} />
                </View>
                {!homeAddress ? (
                  <Text className="text-base text-black ml-3">Add home</Text>
                ) : (
                  <View>
                    <Text className="text-base text-dark ml-3">
                      {homeAddress.line1 +
                        ' ' +
                        homeAddress.line2 +
                        ' ' +
                        homeAddress.city}
                    </Text>
                    <Text className="text-base text-dark ml-3">
                      {homeAddress.postal_code}
                      {', '}
                      {homeAddress.state}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Add work address */}
            <View className="my-5 flex-row items-center">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => {
                  setAddressType('Work');
                  bottomSheetRef.current?.expand();
                }}>
                <View className="bg-lightGrey rounded-full p-2">
                  <MaterialIcons
                    name="work-outline"
                    size={18}
                    color={Colors.Primary}
                  />
                </View>
                {!workAddress ? (
                  <Text className="text-base text-black ml-3">Add work</Text>
                ) : (
                  <View>
                    <Text className="text-base text-dark ml-3">
                      {workAddress.line1 +
                        ' ' +
                        workAddress.line2 +
                        ' ' +
                        workAddress.city}
                    </Text>
                    <Text className="text-base text-dark ml-3">
                      {workAddress.postal_code}
                      {', '}
                      {workAddress.state}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          marginHorizontal: RPW(8),
          marginBottom: RPH(2),
        }}>
        {/* Button */}
        <View className="my-5">
          <Button
            loading={loading}
            title={'Finish'}
            onPress={() => {
              Keyboard.dismiss();
              submitFinish();
            }}
            primary
          />
        </View>
      </View>

      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={0}>
        <BottomSheetView style={styles.contentContainer}>
          <View className="items-center p-6">
            <View className="flex-row justify-between w-full items-center">
              <Text className="text-lg font-medium text-black">
                Add {addressType} Address
              </Text>
              <MaterialIcons
                name="close"
                color={Colors.Dark}
                size={22}
                onPress={handleClosePress}
              />
            </View>

            <View className="w-full mt-5 space-y-5">
              <View className="gap-5 mb-3">
                <View>
                  <Controller
                    name="line1"
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <InputField
                        placeHolder={'Line 1'}
                        value={value}
                        secure={false}
                        inputMode={'text'}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    )}
                    rules={{required: true}}
                  />
                  {errors.line1 && (
                    <Text className="text-error">{'* required field'}</Text>
                  )}
                </View>

                <View>
                  <Controller
                    name="line2"
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <InputField
                        placeHolder={'Line 2'}
                        value={value}
                        secure={false}
                        inputMode={'text'}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>

                <View className="flex-row justify-between">
                  <View className="basis-1/2 pr-2">
                    <Controller
                      name="city"
                      control={control}
                      render={({field: {onChange, onBlur, value}}) => (
                        <InputField
                          placeHolder={'City'}
                          value={value}
                          secure={false}
                          inputMode={'text'}
                          onBlur={onBlur}
                          onChangeText={onChange}
                        />
                      )}
                      rules={{required: true}}
                    />
                    {errors.city && (
                      <Text className="text-error">{'* required field'}</Text>
                    )}
                  </View>

                  <View className="basis-1/2 pl-2">
                    <Controller
                      name="state"
                      control={control}
                      render={({field: {onChange, onBlur, value}}) => (
                        <InputField
                          placeHolder={'State'}
                          value={value}
                          secure={false}
                          inputMode={'text'}
                          onBlur={onBlur}
                          onChangeText={onChange}
                        />
                      )}
                      rules={{required: true}}
                    />
                    {errors.state && (
                      <Text className="text-error">{'* required field'}</Text>
                    )}
                  </View>
                </View>

                <View>
                  <Controller
                    name="postal_code"
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <InputField
                        placeHolder={'Postal Code'}
                        value={value}
                        secure={false}
                        inputMode={'numeric'}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    )}
                    rules={{required: true}}
                  />
                  {errors.postal_code && (
                    <Text className="text-error">{'* required field'}</Text>
                  )}
                </View>
              </View>

              <View>
                <Button
                  title={'Save Address'}
                  onPress={(Keyboard.dismiss(), handleSubmit(submit))}
                  primary
                />
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: Colors.Gray,
    borderWidth: 1,
  },
});
