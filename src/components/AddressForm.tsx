import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {Button} from './rneui';
import {styled} from 'nativewind';
import InputField from './InputFeild';
import {CheckBox} from '@rneui/themed';
import {Colors} from '../utils/Colors';
import {GOOGLE_MAP_API_KEY} from '@env';
import {instance} from '../api/instance';
import {Controller, set, useForm} from 'react-hook-form';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Address} from '../screens/category/CategoryScreen';
import {AddressEntity} from '../redux/address/address.entity';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface AddressFormProps {
  btnTitle: string;
  onClose: () => void;
  onSubmit?: (data: AddressEntity) => void;
}

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const AddressForm = ({
  btnTitle,
  onClose,
  onSubmit,
}: AddressFormProps) => {
  const [selectedIndex, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>();
  // const selectedState = useRef<string>();
  // const searchQuery = useRef<string>();
  const [selectedState, setSelectedState] = useState<string>();
  const [filteredLocations, setFilteredLocations] = useState([]);
  // const filteredLocations = useRef([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm<Address>();

  const submit = (data: Address) => {
    if (onSubmit && searchQuery && selectedState) {
      data.city = searchQuery;
      data.state = selectedState;
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

  // useCallback(() => {
  //   if (searchQuery) {
  //     fetchLocations(searchQuery);
  //   } else {
  //     setFilteredLocations([]);
  //     // filteredLocations.current = [];
  //   }
  // }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      fetchLocations(searchQuery);
    } else {
      setFilteredLocations([]);
    }
  }, [searchQuery]);

  const fetchLocations = async (query: any) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query,
        )}&types=geocode&components=country:IN&key=${GOOGLE_MAP_API_KEY}`,
      );

      const apiResults = response.data.predictions.map(
        (prediction: any) => prediction.description,
      );
      setFilteredLocations(apiResults);
      // filteredLocations.current = apiResults;
    } catch (error) {
      console.error('Error fetching locations from API:', error);
    }
  };

  const handleLocationSelect = async (location: any) => {
    const nameWithoutCountry = location.replace(/,?\s*India$/, '').trim();
    const CityName = nameWithoutCountry.split(',')[0].trim();
    setSearchQuery(CityName);
    setDropdownVisible(false);

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location,
        )}&key=${GOOGLE_MAP_API_KEY}`,
      );
      const results = response.data.results;

      if (results.length > 0) {
        const state = results[0].address_components.find((component: any) =>
          component.types.includes('administrative_area_level_1'),
        );

        if (state) {
          setSelectedState(state.long_name);
        }
      }
    } catch (error) {
      console.error('Error fetching district from API:', error);
    }

    setFilteredLocations([]);
    // filteredLocations.current = [];
  };

  return (
    <StyledView style={{paddingHorizontal: RPW(5)}}>
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
            onFocus={() => {
              setIsFocused(true);
              setDropdownVisible(true);
            }}
            onChangeText={text => {
              setSearchQuery(text);
              setFilteredLocations([]);
              setDropdownVisible(true);
            }}
          />

          {/* Location Dropdown */}
          {dropdownVisible && searchQuery && filteredLocations.length > 0 && (
            <StyledView className="absolute top-20 w-full bg-white border border-gray rounded-lg z-50">
              {filteredLocations.map((location, index) => (
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
            value={selectedState ? selectedState : ''}
            secure={false}
            inputMode={'text'}
            onChangeText={text => {
              setSelectedState(text);
            }}
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
    </StyledView>
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
