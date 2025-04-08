import {
  View,
  Text,
  Keyboard,
  Dimensions,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {styled} from 'nativewind';
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
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
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
  const {address, isEdit} = route.params;
  const snapPoints = useMemo(() => ['25%'], []);
  const [type, setType] = useState<string>(address.type);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<Address>({defaultValues: address});
  const [state, setState] = useState({
    latitude: parseFloat(address.latitude),
    longitude: parseFloat(address.longitude),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const submit = (data: Address) => {
    setLoading(true);
    try {
      if (isEdit) {
        instance
          .put(`/users/addresses/${address.id}`, {
            ...data,
            type: type,
            latitude: state.latitude,
            longitude: state.longitude,
          })
          .then(() => {
            navigation.pop();
          });
      } else {
        instance
          .post('/users/addresses', {
            ...data,
            type: type,
            latitude: state.latitude,
            longitude: state.longitude,
          })
          .then(() => {
            navigation.pop();
          });
      }
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
        {/* Google Map */}
        <StyledView className="h-64">
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={state}>
            <Marker
              draggable
              coordinate={state}
              onDragEnd={e => {
                setState({
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                  latitudeDelta: state.latitudeDelta,
                  longitudeDelta: state.longitudeDelta,
                });
                console.log('===//', e.nativeEvent);
              }}
            />
          </MapView>
        </StyledView>

        {/* Address Details */}
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
              errors={errors.line1}
              required={true}
              placeHolder={address.line1}
            />
            <AddressFormField
              name={'line2'}
              label={'Apartment, suite, etc.'}
              control={control}
              errors={errors.line2}
              required={false}
              placeHolder={'Apartment, suite, etc. (optional)'}
            />

            <StyledView className="flex-row">
              <StyledView className="basis-1/2 pr-2">
                <AddressFormField
                  name={'city'}
                  label={'City'}
                  control={control}
                  errors={errors.city}
                  required={true}
                  placeHolder={'City'}
                />
              </StyledView>
              <StyledView className="basis-1/2 pl-2">
                <AddressFormField
                  name={'state'}
                  label={'State'}
                  control={control}
                  errors={errors.state}
                  required={true}
                  placeHolder={'City'}
                />
              </StyledView>
            </StyledView>

            <AddressFormField
              name={'postal_code'}
              label={'Postal Code'}
              control={control}
              errors={errors.postal_code}
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

          {isEdit && (
            <>
              <StyledView className={'my-5 h-0.5 bg-lightGrey'} />
              <Button
                title={'Remove address'}
                onPress={() => {
                  Keyboard.dismiss();
                  bottomSheetRef.current?.expand();
                }}
              />
            </>
          )}

          <StyledView className={'mb-5'}>
            <StyledView className="mb-5" />
            <Button
              primary
              loading={loading}
              title={'Save and Continue'}
              onPress={(Keyboard.dismiss(), handleSubmit(submit))}
            />
          </StyledView>
        </StyledView>
      </StyledScrollView>

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

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

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
        {errors && <StyledText className="text-error">{' *'}</StyledText>}
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
