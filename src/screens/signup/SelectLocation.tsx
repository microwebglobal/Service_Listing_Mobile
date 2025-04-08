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
// import {AddressForm} from '../../components/AddressForm';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SearchBarComponent} from '../../components/Searchbar';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {AddressEntity} from '../../redux/address/address.entity';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fetchLocations, getCityDetails} from '../../utils/location';
// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetView,
// } from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {LoadingIndicator} from '../../components/LoadingIndicator';

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
  // const snapPoints = useMemo(() => ['98%'], []);
  // const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [addressList, setAddressList] = useState<Array<AddressEntity>>([]);
  // const handleClosePress = () => {
  //   bottomSheetRef.current?.close();
  // };

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
      // setAddressList([
      //   ...addressList,
      //   {
      //     type: 'other',
      //     line1: '',
      //     line2: '',
      //     city: data?.city,
      //     state: data?.state,
      //     postal_code: data?.postal_code,
      //     is_primary: false,
      //   },
      // ]);
      const selectedAddress: any = {
        type: 'other',
        line1: '',
        line2: '',
        city: data?.city,
        state: data?.state,
        postal_code: data?.postal_code,
        is_primary: false,
        latitude: data?.latitude,
        longitude: data?.longitude,
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

  const submitFinish = () => {
    navigation.navigate('LoginSuccess');
    // setLoading(true);
    // addressList.map(async (address: AddressEntity) => {
    //   await instance
    //     .post('/users/addresses', {
    //       type: address?.type,
    //       line1: address?.line1,
    //       line2: address?.line2,
    //       city: address?.city,
    //       state: address?.state,
    //       postal_code: address?.postal_code,
    //     })
    //     .then(() => {
    //       navigation.navigate('LoginSuccess');
    //     })
    //     .catch(error => {
    //       console.log('Error:', error);
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     });
    // });
  };

  // const submit = (data: AddressEntity) => {
  //   setAddressList([...addressList, data]);
  //   handleClosePress();
  // };

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

          {/* <StyledView className="mt-6">
            <StyledTouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                bottomSheetRef.current?.expand();
              }}>
              <StyledText className="mb-5 text-base text-primary mt-2  font-PoppinsRegular">
                Set Location Manually
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView> */}

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

      {/* <BottomSheet
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
      </BottomSheet> */}
    </StyledSafeAreaView>
  );
};
