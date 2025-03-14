import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import AppHeader from '../../components/AppHeader';
import {Address} from '../category/CategoryScreen';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {Image} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import InputField from '../../components/InputFeild';
import {Button} from '../../components/rneui';
import {instance} from '../../api/instance';
import {Colors} from '../../utils/Colors';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import classNames from 'classnames';
import Toast from 'react-native-toast-message';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

export const AddressDetailsScreen: Screen<'AddressDetails'> = ({route}) => {
  const navigation = useNav();
  const snapPoints = useMemo(() => ['25%'], []);
  const address: Address = route.params.address;
  const [type, setType] = useState<string>(address.type);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm<Address>({defaultValues: address});

  const submit = (data: Address) => {
    setLoading(true);
    try {
      instance
        .put(`/users/addresses/${address.id}`, {
          type: type,
          line1: data.line1,
          line2: data.line2,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
        })
        .then(() => {
          reset();
          navigation.goBack();
        });
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = (id: number) => {
    setLoading(true);
    try {
      instance.delete(`/users/addresses/${id}`).then(() => {
        showToast();
      });
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setLoading(false);
      bottomSheetRef.current?.close();
      setIsOpen(false);
      navigation.pop();
      navigation.navigate('EditLocation');
    }
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Address Deleted',
      text2: 'Address deleted successfully',
      visibilityTime: 1500,
      autoHide: true,
    });
  };

  return (
    <SafeAreaView
      className={classNames(
        `flex-1 bg-white, ${isOpen ? 'bg-primaryBlackRGBA' : 'bg-white'}`,
      )}>
      <AppHeader title="Address Details" back={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image
            source={require('../../assets/app-images/map.png')}
            style={styles.Image}
          />
        </View>
        <View style={{paddingHorizontal: RPW(6)}}>
          <Text className="my-2 mb-3 text-lg text-dark">
            {address.city}
            {', '}
            {address.state}
          </Text>

          <View className="gap-5 mb-3">
            <View>
              <Text className="mb-2 text-base text-black font-medium">
                Street Address
              </Text>
              <Controller
                name="line1"
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputField
                    placeHolder={address.line1}
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
                <Text className="text-error">
                  {'Please fill out this field.'}
                </Text>
              )}
            </View>

            <View>
              <Text className="mb-2 text-base text-black font-medium">
                Apartment, suite, etc.
              </Text>
              <Controller
                name="line2"
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputField
                    placeHolder={'Apartment, suite, etc. (optional)'}
                    value={value}
                    secure={false}
                    inputMode={'text'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            <View className="flex-row">
              <View className="basis-1/2 pr-2">
                <Text className="mb-2 text-base text-black font-medium">
                  City
                </Text>
                <Controller
                  name="city"
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <InputField
                      placeHolder={address.city}
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
                  <Text className="text-error">{'City is required.'}</Text>
                )}
              </View>
              <View className="basis-1/2 pl-2">
                <Text className="mb-2 text-base text-black font-medium">
                  State
                </Text>
                <Controller
                  name="state"
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <InputField
                      placeHolder={address.state}
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
                  <Text className="text-error">{'State is required.'}</Text>
                )}
              </View>
            </View>

            <View>
              <Text className="mb-2 text-base text-black font-medium">
                Postal Code
              </Text>
              <Controller
                name="postal_code"
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputField
                    placeHolder={address.postal_code}
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
                <Text className="text-error">{'Postal code is required.'}</Text>
              )}
            </View>
          </View>

          <View
            className={classNames(
              `my-4 h-0.5 bg-lightGrey, ${isOpen ? '' : 'bg-lightGrey'}`,
            )}
          />

          <View>
            <Text className="text-lg text-black font-medium">
              Address label
            </Text>
            <View className="mt-3 flex-row items-center space-x-3">
              <TouchableOpacity
                className={classNames(
                  `flex-row items-center space-x-3 rounded-full py-2 px-3 ${
                    type === 'home' ? 'bg-primary' : 'bg-lightGrey'
                  }`,
                )}
                onPress={() => {
                  setType('home');
                }}>
                <AntDesign
                  name="home"
                  size={20}
                  color={type === 'home' ? Colors.White : Colors.Primary}
                />
                <Text
                  className={classNames(
                    'text-base',
                    `${type === 'home' ? 'text-white' : 'text-black'}`,
                  )}>
                  Home
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={classNames(
                  `flex-row items-center space-x-3 rounded-full py-2 px-3 ${
                    type === 'work' ? 'bg-primary' : 'bg-lightGrey'
                  }`,
                )}
                onPress={() => {
                  setType('work');
                }}>
                <MaterialIcons
                  name="work-outline"
                  size={18}
                  color={type === 'work' ? Colors.White : Colors.Primary}
                />
                <Text
                  className={classNames(
                    'text-base',
                    `${type === 'work' ? 'text-white' : 'text-black'}`,
                  )}>
                  Work
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={classNames(
                  `flex-row items-center space-x-3 rounded-full py-2 px-3 ${
                    type === 'other' ? 'bg-primary' : 'bg-lightGrey'
                  }`,
                )}
                onPress={() => {
                  setType('other');
                }}>
                <Octicons
                  name="location"
                  size={18}
                  color={type === 'other' ? Colors.White : Colors.Primary}
                />
                <Text
                  className={classNames(
                    'text-base',
                    `${type === 'other' ? 'text-white' : 'text-black'}`,
                  )}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            className={classNames(
              `mt-5 h-0.5 bg-lightGrey, ${isOpen ? '' : 'bg-lightGrey'}`,
            )}
          />
          <View className="my-5">
            <Button
              title={'Remove address'}
              onPress={() => {
                Keyboard.dismiss();
                bottomSheetRef.current?.expand();
                setIsOpen(true);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View
        className={classNames(
          `mb-5 border-t border-lightGrey, ${
            isOpen ? 'border-0' : 'border-1 border-lightGrey'
          }`,
        )}
        style={{paddingHorizontal: RPW(6)}}>
        <View className="mb-5 bg-lightGrey" />
        <Button
          primary
          loading={loading}
          title={'Save and Continue'}
          onPress={(Keyboard.dismiss(), handleSubmit(submit))}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        style={styles.contentContainer}
        index={-1}>
        <BottomSheetView>
          <Text className="text-lg text-black font-medium text-center">
            Remove this address?
          </Text>
          <View className="my-5">
            <Button
              primary
              title={'Confirm'}
              onPress={() => deleteAddress(address.id)}
            />
          </View>
          <View className="">
            <Button
              title={'Keep address'}
              onPress={() => {
                bottomSheetRef.current?.close();
                setIsOpen(false);
              }}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: RPW(6),
    borderColor: Colors.Gray,
  },
  Image: {
    width: RPW(100),
    height: RPH(30),
    resizeMode: 'cover',
  },
});
