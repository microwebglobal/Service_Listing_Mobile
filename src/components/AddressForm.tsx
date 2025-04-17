import {
  View,
  Text,
  Keyboard,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {Button} from './rneui';
import {styled} from 'nativewind';
import InputField from './InputFeild';
import {CheckBox} from '@rneui/themed';
import {Colors} from '../utils/Colors';
import {instance} from '../api/instance';
import {Controller, useForm} from 'react-hook-form';
import {ScrollView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Address} from '../screens/category/CategoryScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fetchLocations, getCityDetails} from '../utils/location';

interface AddressFormProps {
  btnTitle: string;
  onClose: () => void;
  onSubmit?: (data: Address) => void;
}

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const AddressForm = ({
  btnTitle,
  onClose,
  onSubmit,
}: AddressFormProps) => {
  const [selectedIndex, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>();
  const isFocused = useRef<boolean>(false);
  // const [postalCode, setPostalCode] = useState<string>();
  const [selectedState, setSelectedState] = useState<string>('');
  const [geometry, setGeometry] = useState({
    longitude: 0,
    latitude: 0,
  });
  const filteredLocations = useRef([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm<Address>();

  const handleTextChange = useCallback(async (text: string) => {
    setDropdownVisible(true);
    filteredLocations.current = await fetchLocations(text);
  }, []);

  const handleLocationSelect = async (location: any) => {
    getCityDetails(location).then((data: any) => {
      setSearchQuery(data?.city);
      setSelectedState(data?.state);
      setGeometry({latitude: data?.longitude, longitude: data?.latitude});
    });
    filteredLocations.current = [];
  };

  const submit = (data: Address) => {
    if (onSubmit && searchQuery && selectedState) {
      data.city = searchQuery;
      data.state = selectedState;
      // data.postal_code = postalCode;
      data.type = selectedIndex === 0 ? 'home' : 'work';
      onSubmit(data);
      reset();
      setSearchQuery('');
      setSelectedState('');
    } else {
      try {
        setLoading(true);
        instance
          .post('/users/addresses/', {
            line1: data.line1,
            line2: data.line2,
            city: searchQuery,
            state: selectedState,
            postal_code: data.postal_code,
            type: selectedIndex === 0 ? 'home' : 'work',
            location: {
              type: 'Point',
              coordinates: [geometry.longitude, geometry.latitude],
            },
          })
          .then(() => {
            reset();
            onClose();
          });
      } catch (e) {
        console.log('Error ', e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <StyledScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{paddingHorizontal: RPW(5)}}>
      <StyledView className="mb-5 flex-row justify-between w-full items-center">
        <StyledText className="text-lg font-PoppinsMedium text-black">
          Add New Address
        </StyledText>
        <MaterialIcons
          name="close"
          color={Colors.Dark}
          size={22}
          onPress={onClose}
        />
      </StyledView>

      <StyledView className="flex-row mb-3">
        <StyledView>
          <CheckBox
            title="Home"
            checked={selectedIndex === 0}
            onPress={() => setIndex(0)}
            checkedColor={Colors.Black}
            wrapperStyle={styles.wrapperStyle}
            textStyle={styles.textStyle}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
        </StyledView>
        <StyledView>
          <CheckBox
            title="Work"
            checked={selectedIndex === 1}
            onPress={() => setIndex(1)}
            checkedColor={Colors.Black}
            wrapperStyle={styles.wrapperStyle}
            textStyle={styles.textStyle}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
        </StyledView>
      </StyledView>

      <StyledView className="mb-3">
        <AddressFormField
          name={'line1'}
          label="Street Address"
          control={control}
          errors={errors.line1}
          required={true}
          placeHolder={'Street Address'}
        />
        <AddressFormField
          name={'line2'}
          label={'Apartment, suite, etc.'}
          control={control}
          errors={errors.line2}
          required={false}
          placeHolder={'Apartment, suite, etc. (optional)'}
        />

        <StyledView className="mb-3">
          <StyledText className="mb-2 text-base text-black font-medium">
            {'City'}
            {!searchQuery && (
              <StyledText className="text-error">{' *'}</StyledText>
            )}
          </StyledText>
          <StyledTextInput
            placeholder={'City'}
            placeholderTextColor={Colors.Gray}
            className={`border-[1.5px] rounded-md h-12 px-3 text-base text-dark ${`${
              isFocused ? 'border-black' : 'border-gray'
            }`}`}
            value={searchQuery}
            inputMode={'text'}
            onChangeText={setSearchQuery}
            onChange={e => handleTextChange(e.nativeEvent.text)}
          />

          {/* Location Dropdown */}
          {dropdownVisible &&
            searchQuery &&
            filteredLocations.current.length > 0 && (
              <StyledView className="absolute top-20 w-full bg-white border border-gray rounded-lg z-50">
                {filteredLocations.current.map((location, index) => (
                  <StyledTouchableOpacity
                    key={index}
                    className="flex-row items-center px-2 py-3 border-b border-gray last:border-b-0"
                    onPress={() => handleLocationSelect(location)}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={Colors.Dark}
                    />
                    <StyledText
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      className="flex-1 ml-2 text-black font-PoppinsRegular">
                      {location}
                    </StyledText>
                  </StyledTouchableOpacity>
                ))}
              </StyledView>
            )}
        </StyledView>

        <StyledView className="mb-3">
          <StyledText className="mb-2 text-base text-black font-medium">
            {'State'}
            {!selectedState && (
              <StyledText className="text-error">{' *'}</StyledText>
            )}
          </StyledText>
          <InputField
            placeHolder={'State'}
            value={selectedState}
            secure={false}
            inputMode={'text'}
            onChangeText={setSelectedState}
          />
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

      <StyledView className="my-5">
        <Button
          primary
          loading={loading}
          title={btnTitle}
          onPress={(Keyboard.dismiss(), handleSubmit(submit))}
        />
      </StyledView>
    </StyledScrollView>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: Colors.Black,
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: 'Poppins-Regular',
  },
  wrapperStyle: {
    marginTop: -10,
    marginLeft: -20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: Colors.LightGrey,
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
