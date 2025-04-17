import {
  View,
  Text,
  Keyboard,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {styled} from 'nativewind';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import AppHeader from '../../components/AppHeader';
import {Address} from '../category/CategoryScreen';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SearchBarComponent} from '../../components/Searchbar';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import {fetchLocations, getCityDetails} from '../../utils/location';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const SelectLocation: Screen<'SelectLocation'> = () => {
  const navigation = useNav();
  const [searchQuery, setSearchQuery] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [addressList, setAddressList] = useState<Array<Address>>([]);

  const fetchAddress = useCallback(() => {
    try {
      instance.get('/users/addresses').then(response => {
        setAddressList(response.data);
      });
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, [fetchAddress]),
  );

  const handleTextChange = useCallback(
    async (text: string) => {
      setSearchQuery(text);
      setDropdownVisible(true);
      setFilteredLocations(await fetchLocations(searchQuery));
    },
    [searchQuery],
  );

  const handleLocationSelect = async (location: any) => {
    getCityDetails(location).then((data: any) => {
      const selectedAddress: any = {
        type: 'other',
        line1: '',
        line2: '',
        city: data?.city,
        state: data?.state,
        postal_code: data?.postal_code,
        is_primary: false,
        location: {
          coordinates: [data?.longitude, data?.latitude],
        },
      };
      navigation.navigate('AddressDetails', {
        address: selectedAddress,
        isEdit: false,
      });
    });

    setFilteredLocations([]);
    setDropdownVisible(false);
  };

  const submitFinish = () => {
    navigation.navigate('LoginSuccess');
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView showsVerticalScrollIndicator={false}>
        <AppHeader back={true} />
        <StyledView
          style={{
            marginHorizontal: RPW(5),
          }}>
          <StyledView className="my-8">
            <StyledText className="text-xl  font-PoppinsMedium text-black">
              Select Your Location
            </StyledText>
            <StyledText className="mt-3 text-base  font-PoppinsRegular text-dark">
              Add multiple addresses to your account for easy access.
            </StyledText>
          </StyledView>

          {/* SearchBar */}
          <StyledView className="flex-1">
            <SearchBarComponent
              placeholder={'Search your city'}
              iconName={'search'}
              onChange={(text: string) => {
                handleTextChange(text);
              }}
            />

            {/* Location Dropdown */}
            {dropdownVisible && searchQuery && filteredLocations.length > 0 && (
              <StyledView className="absolute top-[52px] w-full bg-white border border-gray rounded-md z-50">
                {filteredLocations.map((location, index) => (
                  <StyledTouchableOpacity
                    key={index}
                    className="flex-row items-center px-2 py-3 border-b border-gray last:border-b-0"
                    onPress={() => handleLocationSelect(location)}>
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={Colors.Black}
                    />
                    <StyledText
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      className="flex-1 ml-2 text-sm text-black font-PoppinsRegular">
                      {location}
                    </StyledText>
                  </StyledTouchableOpacity>
                ))}
              </StyledView>
            )}
          </StyledView>

          <StyledView className="mt-5" />

          {/* Render Address list */}
          {addressList.map((address, index) => (
            <StyledView
              key={index}
              className="py-2 mb-2 flex-row items-center justify-between border-b border-lightGrey">
              <StyledView className="flex-row items-center space-x-5">
                <StyledView className="py-2">
                  {address?.type === 'home' && (
                    <AntDesign name="home" size={20} color={Colors.Black} />
                  )}
                  {address?.type === 'work' && (
                    <MaterialIcons
                      name="work-outline"
                      size={18}
                      color={Colors.Black}
                    />
                  )}
                  {address?.type === 'other' && (
                    <Octicons name="location" size={18} color={Colors.Black} />
                  )}
                </StyledView>
                <StyledView>
                  <StyledText
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    className="basis-4/5 text-black text-base font-PoppinsRegular">
                    {address?.line1} {address?.line2} {address?.city}{' '}
                    {address?.state}
                  </StyledText>
                  <StyledText
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    className="text-gray text-base font-PoppinsRegular">
                    {'Postal code: '}
                    {address.postal_code}
                  </StyledText>
                </StyledView>
              </StyledView>
              <StyledTouchableOpacity
                onPress={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    navigation.navigate('AddressDetails', {
                      address: address,
                      isEdit: true,
                    });
                  }, 1000);
                }}>
                <MaterialIcons name="edit" size={18} color={Colors.Dark} />
              </StyledTouchableOpacity>
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
            title={'Continue'}
            onPress={() => {
              Keyboard.dismiss();
              submitFinish();
            }}
            primary
          />
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
};
