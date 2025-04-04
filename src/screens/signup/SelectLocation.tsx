import {
  View,
  Text,
  Keyboard,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import axios from 'axios';
import {styled} from 'nativewind';
import {GOOGLE_MAP_API_KEY} from '@env';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import AppHeader from '../../components/AppHeader';
import Entypo from 'react-native-vector-icons/Entypo';
import {AddressForm} from '../../components/AddressForm';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {AddressEntity} from '../../redux/address/address.entity';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const SelectLocation: Screen<'SelectLocation'> = () => {
  const navigation = useNav();
  const snapPoints = useMemo(() => ['98%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // const user = useAppSelector(state => state.user.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [addressList, setAddressList] = useState<Array<AddressEntity>>([]);
  const handleClosePress = () => {
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
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
    } catch (error) {
      console.error('Error fetching locations from API:', error);
    }
  };

  const handleLocationSelect = async (location: any) => {
    const nameWithoutCountry = location.replace(/,?\s*India$/, '').trim();
    setSearchQuery(nameWithoutCountry);
    setAddressList([...addressList, nameWithoutCountry]);
    setDropdownVisible(false);

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location,
        )}&key=${GOOGLE_MAP_API_KEY}`,
      );
      const results = response.data.results;

      if (results.length > 0) {
        // const district = results[0].address_components.find((component: any) =>
        //   component.types.includes('administrative_area_level_2'),
        // );
        // if (district) {
        //   setSelectedDistrict(district.long_name);
        // }
      }
    } catch (error) {
      console.error('Error fetching district from API:', error);
    }

    setFilteredLocations([]);
  };

  const submitFinish = () => {
    setLoading(true);
    addressList.map(async (address: AddressEntity) => {
      await instance
        .post('/users/addresses', {
          type: address?.type,
          line1: address?.line1,
          line2: address?.line2,
          city: address?.city,
          state: address?.state,
          postal_code: address?.postal_code,
        })
        .then(() => {
          navigation.navigate('LoginSuccess');
        })
        .catch(error => {
          console.log('Error:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const submit = (data: AddressEntity) => {
    setAddressList([...addressList, data]);
    handleClosePress();
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <AppHeader back={true} />
        <StyledView
          style={{
            marginHorizontal: RPW(5),
          }}>
          <StyledView className="my-8 items-center">
            <StyledText className="text-2xl  font-PoppinsMedium text-black">
              Select Your Location
            </StyledText>
            <StyledText className="mt-3 text-base  font-PoppinsMedium text-dark">
              Add Multiple Locations
            </StyledText>
          </StyledView>

          {/* Location Search Input */}
          <StyledView>
            <StyledView className="flex-row items-center flex justify-between">
              <StyledView className="flex-1">
                <StyledTextInput
                  className="w-full h-12 px-4 bg-white border border-gray rounded-lg text-dark"
                  placeholder="Search your Location..."
                  placeholderTextColor={Colors.Gray}
                  value={searchQuery}
                  onFocus={() => setDropdownVisible(true)}
                  onChangeText={text => {
                    setSearchQuery(text);
                    setFilteredLocations([]);
                    setDropdownVisible(text.length > 0);
                  }}
                />
              </StyledView>
              <StyledView className="w-12 h-12 p-2 ml-2 items-center justify-center rounded-md bg-primary">
                <StyledTouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                  }}>
                  <MaterialIcons
                    name="my-location"
                    size={22}
                    color={Colors.White}
                  />
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>

            {/* Location Dropdown */}
            {dropdownVisible && searchQuery && filteredLocations.length > 0 && (
              <StyledView className="absolute top-12 w-full bg-white border border-gray rounded-lg z-50">
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
                      className="flex-1 ml-2 text-dark  font-PoppinsRegular">
                      {location}
                    </StyledText>
                  </StyledTouchableOpacity>
                ))}
              </StyledView>
            )}
          </StyledView>

          <StyledView className="mt-6">
            <StyledTouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                bottomSheetRef.current?.expand();
              }}>
              <StyledText className="mb-5 text-base text-primary mt-2  font-PoppinsRegular">
                Set Location Manually
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Render Address list */}
          {addressList.map((item, index) => (
            <StyledView
              key={index}
              className="py-2 mb-2 flex-row items-center justify-between border-b border-lightGrey">
              <StyledView className="flex-row items-center space-x-5">
                <StyledView className="py-2">
                  {item?.type === 'home' ? (
                    <AntDesign name="home" size={22} color={Colors.Black} />
                  ) : (
                    <MaterialIcons
                      name="work-outline"
                      size={20}
                      color={Colors.Black}
                    />
                  )}
                </StyledView>
                <StyledView>
                  <StyledText
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    className="basis-4/5 text-black text-base font-PoppinsRegular">
                    {item?.line1} {item?.line2} {item?.city} {item?.state}
                  </StyledText>
                  <StyledText
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    className="text-gray text-base font-PoppinsRegular">
                    {'Postal code: '}
                    {item.postal_code}
                  </StyledText>
                </StyledView>
              </StyledView>
              <Entypo
                name="cross"
                size={20}
                color={Colors.Gray}
                onPress={() => {
                  addressList.splice(index, 1);
                  setAddressList([...addressList]);
                }}
              />
            </StyledView>
          ))}
        </StyledView>
      </StyledScrollView>

      <StyledView
        style={{
          marginHorizontal: RPW(5),
          marginBottom: RPH(2),
        }}>
        <StyledView className="my-5">
          <Button
            loading={loading}
            title={'Continue'}
            onPress={() => {
              Keyboard.dismiss();
              submitFinish();
            }}
            primary
          />
        </StyledView>
      </StyledView>

      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} />
        )}>
        <BottomSheetView>
          <AddressForm
            btnTitle="Save Address"
            onClose={handleClosePress}
            onSubmit={data => submit(data)}
          />
        </BottomSheetView>
      </BottomSheet>
    </StyledSafeAreaView>
  );
};
