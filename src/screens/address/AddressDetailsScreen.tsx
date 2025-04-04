import {
  View,
  Text,
  Keyboard,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {styled} from 'nativewind';
import {Image} from 'react-native';
import classNames from 'classnames';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import Toast from 'react-native-toast-message';
import AppHeader from '../../components/AppHeader';
import {Address} from '../category/CategoryScreen';
import {Controller, useForm} from 'react-hook-form';
import InputField from '../../components/InputFeild';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Screen, useNav} from '../../navigation/RootNavigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const AddressDetailsScreen: Screen<'AddressDetails'> = ({route}) => {
  const navigation = useNav();
  const snapPoints = useMemo(() => ['25%'], []);
  const address: Address = route.params.address;
  const [type, setType] = useState<string>(address.type);
  const bottomSheetRef = useRef<BottomSheet>(null);
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
    <StyledSafeAreaView className={'flex-1 bg-white'}>
      <AppHeader title="Address Details" back={true} />
      <StyledScrollView showsVerticalScrollIndicator={false}>
        <StyledView>
          <Image
            className="w-full"
            source={require('../../assets/app-images/map.png')}
          />
        </StyledView>
        <StyledView style={{paddingHorizontal: RPW(5)}}>
          <StyledText className="my-2 mb-3 text-lg text-black font-PoppinsMedium">
            {address.city}
            {', '}
            {address.state}
          </StyledText>

          <StyledView className="my-2">
            <AddressFormField
              name={'line1'}
              label="Street "
              control={control}
              errors={errors}
              required={true}
              placeHolder={address.line1}
            />
            <AddressFormField
              name={'label2'}
              label={'Apartment, suite, etc.'}
              control={control}
              errors={errors}
              required={false}
              placeHolder={'Apartment, suite, etc. (optional)'}
            />

            <StyledView className="flex-row">
              <StyledView className="basis-1/2 pr-2">
                <AddressFormField
                  name={'city'}
                  label={'City'}
                  control={control}
                  errors={errors}
                  required={true}
                  placeHolder={'City'}
                />
              </StyledView>
              <StyledView className="basis-1/2 pl-2">
                <AddressFormField
                  name={'state'}
                  label={'State'}
                  control={control}
                  errors={errors}
                  required={true}
                  placeHolder={'City'}
                />
              </StyledView>
            </StyledView>

            <AddressFormField
              name={'postal_code'}
              label={'Postal Code'}
              control={control}
              errors={errors}
              required={true}
              placeHolder={'Postal code'}
            />
          </StyledView>

          <StyledView className={'mb-3 h-0.5 bg-lightGrey'} />

          <StyledView>
            <StyledText className="text-lg text-black font-PoppinsMedium">
              Address label
            </StyledText>
            <StyledView className="mt-3 flex-row items-center space-x-3">
              <StyledView>
                <AddressType
                  type={type}
                  typeName={'home'}
                  onSetType={addressType => setType(addressType)}
                />
              </StyledView>
              <StyledView>
                <AddressType
                  type={type}
                  typeName={'work'}
                  onSetType={addressType => setType(addressType)}
                />
              </StyledView>
              <StyledView>
                <AddressType
                  type={type}
                  typeName={'other'}
                  onSetType={addressType => setType(addressType)}
                />
              </StyledView>
            </StyledView>
          </StyledView>

          <StyledView className={'mt-5 h-0.5 bg-lightGrey'} />
          <StyledView className="my-5">
            <Button
              title={'Remove address'}
              onPress={() => {
                Keyboard.dismiss();
                bottomSheetRef.current?.expand();
              }}
            />
          </StyledView>
        </StyledView>
      </StyledScrollView>
      <StyledView
        className={'mb-5 border-t border-lightGrey border-1'}
        style={{paddingHorizontal: RPW(6)}}>
        <StyledView className="mb-5 bg-lightGrey" />
        <Button
          primary
          loading={loading}
          title={'Save and Continue'}
          onPress={(Keyboard.dismiss(), handleSubmit(submit))}
        />
      </StyledView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        style={{paddingHorizontal: RPW(5)}}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} />
        )}
        index={-1}>
        <BottomSheetView>
          <StyledText className="text-lg text-black font-PoppinsMedium text-center">
            Remove this address?
          </StyledText>
          <StyledView className="my-5">
            <Button
              primary
              title={'Confirm'}
              onPress={() => deleteAddress(address.id)}
            />
          </StyledView>
          <StyledView className="">
            <Button
              title={'Keep address'}
              onPress={() => {
                bottomSheetRef.current?.close();
              }}
            />
          </StyledView>
        </BottomSheetView>
      </BottomSheet>
    </StyledSafeAreaView>
  );
};

interface AddressFormFieldProps {
  errors: any;
  control: any;
  name: string;
  label: string;
  required: boolean;
  placeHolder: string;
}

const AddressFormField: React.FC<AddressFormFieldProps> = ({
  name,
  label,
  control,
  errors,
  required,
  placeHolder,
}) => {
  return (
    <StyledView className="mb-3">
      <StyledText className="mb-2 text-base text-black font-PoppinsMedium">
        {label}
        {errors.name && <StyledText className="text-error">{' *'}</StyledText>}
      </StyledText>
      <Controller
        name={name}
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <InputField
            placeHolder={placeHolder}
            value={value}
            secure={false}
            inputMode={'text'}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={{required: required}}
      />
    </StyledView>
  );
};

interface AddressTypeProps {
  type: string;
  typeName: string;
  onSetType: (type: string) => void;
}

const AddressType: React.FC<AddressTypeProps> = ({
  type,
  typeName,
  onSetType,
}) => {
  return (
    <StyledTouchableOpacity
      className={classNames(
        `flex-row items-center space-x-3 rounded-full py-2 px-3 ${
          type === typeName ? 'bg-primary' : 'bg-lightGrey'
        }`,
      )}
      onPress={() => {
        onSetType(typeName);
      }}>
      {typeName === 'home' && (
        <AntDesign
          name="home"
          size={20}
          color={typeName === type ? Colors.White : Colors.Primary}
        />
      )}
      {typeName === 'work' && (
        <MaterialIcons
          name="work-outline"
          size={18}
          color={typeName === type ? Colors.White : Colors.Primary}
        />
      )}
      {typeName === 'other' && (
        <Octicons
          name="location"
          size={18}
          color={typeName === type ? Colors.White : Colors.Primary}
        />
      )}

      <StyledText
        className={classNames(
          'text-base font-PoppinsRegular',
          `${type === typeName ? 'text-white' : 'text-black'}`,
        )}>
        {typeName}
      </StyledText>
    </StyledTouchableOpacity>
  );
};
