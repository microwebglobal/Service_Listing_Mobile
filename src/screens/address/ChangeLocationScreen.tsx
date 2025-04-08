import {
  View,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {styled} from 'nativewind';
import {useDispatch} from 'react-redux';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {Address} from '../category/CategoryScreen';
import {useNav} from '../../navigation/RootNavigation';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SearchBarComponent} from '../../components/Searchbar';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fetchLocations, getCityDetails} from '../../utils/location';
import {savePrimaryAddress} from '../../redux/address/address.slice';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const ChangeLocationScreen = () => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
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

  const setPrimaryAddress = useCallback(
    (id: number) => {
      try {
        instance.patch(`/users/addresses/${id}/primary`).then(() => {
          // Update the primary address in the Redux store
          addressList.forEach((address: Address) => {
            if (address.id === id) {
              const addressPrefix = address.line2
                ? address.line1 + ' ' + address.line2
                : address.line1;
              const addressSuffix = address.city + ' ' + address.state;
              dispatch(
                savePrimaryAddress(addressPrefix + ', ' + addressSuffix),
              );
            }
          });
          navigation.pop();
        });
      } catch (e) {
        console.log('Error ', e);
      }
    },
    [addressList, dispatch, navigation],
  );

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
    setIsLoading(true);
    getCityDetails(location).then((data: any) => {
      console.log('City Details: ', data);
      const selectedAddress: any = {
        latitude: data?.latitude,
        longitude: data?.longitude,
        type: 'other',
        line1: '',
        line2: '',
        city: data?.city,
        state: data?.state,
        postal_code: data?.postal_code,
        is_primary: false,
      };
      navigation.navigate('AddressDetails', {
        address: selectedAddress,
        isEdit: false,
      });
    });

    setSearchQuery('');
    setFilteredLocations([]);
    setDropdownVisible(false);
  };

  const _renderAddress = (address: Address) => {
    return (
      <StyledView
        key={address.id}
        style={{paddingHorizontal: RPW(6)}}
        className="flex-row flex-wrap border-b border-lightGrey items-center justify-between">
        <StyledTouchableOpacity
          className="flex-1 py-5"
          onPress={() => {
            setPrimaryAddress(address.id);
          }}>
          <StyledView className="flex-row items-center gap-x-5 overflow-hidden">
            {address.type === 'work' ? (
              <MaterialIcons
                name="work-outline"
                size={20}
                color={Colors.Black}
              />
            ) : address.type === 'home' ? (
              <AntDesign name="home" size={22} color={Colors.Black} />
            ) : (
              <Octicons name="location" size={22} color={Colors.Black} />
            )}
            {address.line2 ? (
              <StyledText
                numberOfLines={2}
                ellipsizeMode="tail"
                className="basis-3/4 text-base text-black font-PoppinsRegular">
                {address.line1 +
                  ' ' +
                  address.line2 +
                  ', ' +
                  address.city +
                  ', ' +
                  address.state}
              </StyledText>
            ) : (
              <StyledText
                numberOfLines={2}
                ellipsizeMode="tail"
                className="basis-3/4 text-base text-black font-PoppinsRegular">
                {address.line1 + ', ' + address.city + ', ' + address.state}
              </StyledText>
            )}
          </StyledView>
        </StyledTouchableOpacity>
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
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <AppHeader title={'Addresses'} back={true} />
      <StyledScrollView showsVerticalScrollIndicator={false}>
        <StyledView className="my-3">
          <StyledView style={{paddingHorizontal: RPW(5)}}>
            <SearchBarComponent
              placeholder={'Search for an address'}
              iconName={'search'}
              onChange={(text: string) => {
                handleTextChange(text);
              }}
            />

            {/* Location Dropdown */}
            {dropdownVisible && searchQuery && filteredLocations.length > 0 && (
              <StyledView className="relative w-full bg-white border border-gray rounded-lg z-50">
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

            <StyledTouchableOpacity
              className="mt-5 flex-row items-center gap-x-3"
              onPress={() => {}}>
              <MaterialIcons
                name="my-location"
                size={20}
                color={Colors.Primary}
              />
              <StyledText className="text-base text-primary font-medium">
                Use current location
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <StyledView className="my-5 h-2 bg-lightGrey" />

          <StyledText
            className="mb-2 text-lg text-black font-PoppinsMedium"
            style={{paddingHorizontal: RPW(5)}}>
            Available Addresses
          </StyledText>

          <FlatList
            horizontal={false}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            data={addressList}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => _renderAddress(item)}
          />
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
