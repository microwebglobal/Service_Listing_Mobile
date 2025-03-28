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
import axios from 'axios';
import {API_BASE} from '@env';
import {styled} from 'nativewind';
import {useDispatch} from 'react-redux';
import {Colors} from '../../utils/Colors';
import {useAppSelector} from '../../redux';
import {Button} from '../../components/rneui';
import AppHeader from '../../components/AppHeader';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNav} from '../../navigation/RootNavigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SearchBarComponent} from '../../components/Searchbar';
import {AddressEntity} from '../../redux/address/address.entity';
import {saveAddressList} from '../../redux/address/address.slice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {AddressForm} from '../../components/AddressForm';

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

export const SelectLocation = () => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['98%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const user = useAppSelector(state => state.user.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>();
  const [addressList, setAddressList] = useState<Array<AddressEntity>>([]);
  const handleClosePress = () => {
    bottomSheetRef.current?.close();
  };

  const submitFinish = () => {
    dispatch(saveAddressList(addressList));
    setLoading(true);
    axios
      .post(`${API_BASE}/auth/customer/login/send-otp`, {
        mobile: user?.mobile,
      })
      .then(() => {
        user?.mobile &&
          navigation.navigate('Verification', {phone: user?.mobile});
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
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
            <StyledText className="text-2xl font-medium text-black">
              Select Your Location
            </StyledText>
            <StyledText className="mt-3 text-base font-medium text-dark">
              Add Multiple Locations
            </StyledText>
          </StyledView>

          <StyledView className="flex-row mb-6 items-center flex justify-between">
            <StyledView className="flex-1">
              <SearchBarComponent
                placeholder="Add location on map"
                iconName="location-outline"
                onSearch={(text: string) => {
                  setSearchText(text);
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

          <StyledView>
            <StyledTouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                bottomSheetRef.current?.expand();
              }}>
              <StyledText className="mb-5 text-base text-primary mt-2">
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
                    className="basis-4/5 text-black text-base">
                    {item?.line1} {item?.line2} {item?.city} {item?.state}
                  </StyledText>
                  <StyledText
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    className="text-gray text-base">
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
            onSubmit={(data) => submit(data)}
          />
        </BottomSheetView>
      </BottomSheet>
    </StyledSafeAreaView>
  );
};
