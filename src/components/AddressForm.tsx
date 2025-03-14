import {View, Text, StyleSheet, Dimensions, Keyboard} from 'react-native';
import React, {useMemo, useState} from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {CheckBox} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InputField from './InputFeild';
import {Address} from '../screens/category/CategoryScreen';
import {Button} from './rneui';
import {instance} from '../api/instance';
import {Colors} from '../utils/Colors';

interface AddressFormProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
}

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const AddressForm = ({bottomSheetRef}: AddressFormProps) => {
  const [selectedIndex, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm<Address>();

  const snapPoints = useMemo(() => ['100%'], []);
  const handleClosePress = () => {
    bottomSheetRef.current?.close();
  };

  const submit = (data: Address) => {
    setLoading(true);
    try {
      instance
        .post('/users/addresses/', {
          line1: data.line1,
          line2: data.line2,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          type: selectedIndex === 0 ? 'home' : 'work',
        })
        .then(() => {
          handleClosePress();
          reset();
        });
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      style={styles.contentContainer}
      index={-1}>
      <BottomSheetView>
        <View className="mb-5 flex-row justify-between w-full items-center">
          <Text className="text-lg font-medium text-black">
            Add New Address
          </Text>
          <MaterialIcons
            name="close"
            color={Colors.Dark}
            size={22}
            onPress={handleClosePress}
          />
        </View>

        <View className="flex-row mb-3">
          <View>
            <CheckBox
              title="Home"
              checked={selectedIndex === 0}
              onPress={() => setIndex(0)}
              checkedColor={Colors.Primary}
              wrapperStyle={styles.wrapperStyle}
              textStyle={styles.textStyle}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />
          </View>
          <View>
            <CheckBox
              title="Work"
              checked={selectedIndex === 1}
              onPress={() => setIndex(1)}
              checkedColor={Colors.Primary}
              wrapperStyle={styles.wrapperStyle}
              textStyle={styles.textStyle}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
            />
          </View>
        </View>

        {/* User Details Form */}
        <View className="gap-5 mb-3">
          <View>
            <Text className="mb-2 text-base text-black font-medium">
              Street Address
              {errors.line1 && <Text className="text-error">{' *'}</Text>}
            </Text>
            <Controller
              name="line1"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  placeHolder={'Street Address'}
                  value={value}
                  secure={false}
                  inputMode={'text'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
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
                {errors.city && <Text className="text-error">{' *'}</Text>}
              </Text>
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
            </View>
            <View className="basis-1/2 pl-2">
              <Text className="mb-2 text-base text-black font-medium">
                State
                {errors.state && <Text className="text-error">{' *'}</Text>}
              </Text>
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
            </View>
          </View>

          <View>
            <Text className="mb-2 text-base text-black font-medium">
              Postal Code
              {errors.postal_code && <Text className="text-error">{' *'}</Text>}
            </Text>
            <Controller
              name="postal_code"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  placeHolder={'Postal code'}
                  value={value}
                  secure={false}
                  inputMode={'numeric'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
          </View>
        </View>
        <View className="my-5">
          <Button
            primary
            loading={loading}
            title={'Save Address'}
            onPress={(Keyboard.dismiss(), handleSubmit(submit))}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginHorizontal: RPW(6),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: Colors.Gray,
  },
  textStyle: {color: Colors.Dark, fontSize: 16, fontWeight: 'normal'},
  wrapperStyle: {
    marginTop: -10,
    marginLeft: -20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: Colors.LightGrey,
  },
});
