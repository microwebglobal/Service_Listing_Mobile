import {
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {styled} from 'nativewind';
import {useDispatch} from 'react-redux';
import {Colors} from '../../utils/Colors';
import {useAppSelector} from '../../redux';
import {instance} from '../../api/instance';
import {setId} from '../../redux/user/user.slice';
import AppHeader from '../../components/AppHeader';
import {useNav} from '../../navigation/RootNavigation';
import {useFocusEffect} from '@react-navigation/native';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface UserData {
  u_id: number;
  name: string;
  email: string;
  mobile: string;
  pw: string;
  nic: string;
  dob: string;
  photo: string;
  gender: string;
  email_verified: boolean;
  mobile_verified: boolean;
  acc_balance: string;
  balance_updated_at: string;
}

interface sectionItemProps {
  title: string;
  edit: boolean;
  icon_name: string;
  value?: string;
  onPress?: () => void;
}

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const ProfileScreen = () => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['30%'], []);
  const user = useAppSelector(state => state.user.user);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = React.useState<UserData>();

  const fetchUserData = useCallback(() => {
    instance.get(`/customer-profiles/user/${user?.id}`).then(response => {
      setUserData(response.data);
      dispatch(setId(response.data.u_id));
      setIsLoading(false);
    });
  }, [dispatch, user?.id]);

  useFocusEffect(fetchUserData);

  const updateGender = async (gender: string) => {
    await instance
      .put(`users/profile/${user?.id}`, {
        gender,
      })
      .then(() => {
        fetchUserData();
      })
      .catch(e => console.log(e));
  };

  const sectionHeader = (header: string) => {
    return (
      <StyledView>
        <StyledText
          className="my-3 text-base font-PoppinsMedium text-primary tracking-wider"
          style={{paddingHorizontal: RPW(5)}}>
          {header}
        </StyledText>
        <StyledView className="h-[0.5] bg-lightGrey" />
      </StyledView>
    );
  };

  const sectionItem = (data: sectionItemProps) => {
    return (
      <StyledView className="border-t border-lightGrey">
        <StyledTouchableOpacity
          onPress={() => {
            data.onPress ? data.onPress() : null;
          }}>
          <StyledView className="flex-row items-center justify-between">
            <StyledView className="my-3 flex-row items-center space-x-3">
              <MaterialCommunityIcons
                name={data.icon_name}
                size={22}
                color={Colors.Dark}
              />
              <StyledView>
                <StyledText className="text-dark text-base font-PoppinsMedium">
                  {data.title}
                </StyledText>
                {data.value && (
                  <StyledView className="flex-row items-baseline space-x-1">
                    <StyledText className="text-base text-gray font-PoppinsRegular">
                      {data.value}
                    </StyledText>
                    {userData !== undefined ? (
                      (data.title === 'Mobile' && userData?.mobile_verified) ||
                      (data.title === 'Email' && userData?.email_verified) ? (
                        <StyledView className="w-3 h-3 rounded-full bg-green-500 items-center">
                          <MaterialCommunityIcons
                            name="check"
                            size={12}
                            color={Colors.White}
                          />
                        </StyledView>
                      ) : null
                    ) : null}
                  </StyledView>
                )}
              </StyledView>
            </StyledView>
            {data.edit && (
              <StyledView className="-mr-2">
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={Colors.Gray}
                />
              </StyledView>
            )}
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    );
  };

  const selectGender = (gender: string) => {
    return (
      <StyledView className="py-3 border-t border-lightGrey">
        <StyledTouchableOpacity
          onPress={() => {
            bottomSheetRef.current?.close();
            updateGender(gender);
          }}>
          <StyledText className="text-base text-black text-center font-PoppinsRegular">
            {gender}
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="Your Profile" />
      <StyledScrollView showsVerticalScrollIndicator={false}>
        <StyledView
          className="py-3 bg-lightGrey"
          style={{paddingHorizontal: RPW(5)}}>
          <StyledText className="text-black text-sm font-PoppinsRegular">
            {
              'Additional information you give will help us provide you a more personalized experience.'
            }
          </StyledText>
          <StyledView className="my-3 flex-row items-center">
            <StyledView className="basis-10/12 h-1 bg-primary rounded-full" />
            <StyledView className="basis-2/12 h-1 bg-white rounded-full" />
          </StyledView>
          <StyledView className="flex-row justify-between">
            <StyledText className="text-black font-PoppinsRegular">
              8 of 10 <StyledText className="text-primary">complete</StyledText>
            </StyledText>
            <StyledView className="flex-row items-center space-x-1">
              <Text className="text-primary">Your information is secure</Text>
              <MaterialIcons
                name="verified-user"
                size={20}
                color={Colors.Primary}
              />
            </StyledView>
          </StyledView>
        </StyledView>

        <StyledView className="my-2">
          {sectionHeader('Your Information')}
          <StyledView style={{paddingHorizontal: RPW(5)}}>
            {sectionItem({
              title: 'Full Name',
              edit: true,
              icon_name: 'account-outline',
              value: userData?.name,
              onPress: () =>
                navigation.navigate('EditProfile', {itemName: 'Full Name'}),
            })}
            {sectionItem({
              title: 'Mobile',
              edit: true,
              icon_name: 'cellphone',
              value: userData?.mobile,
              onPress: () =>
                navigation.navigate('EditProfile', {itemName: 'Mobile'}),
            })}
            {sectionItem({
              title: 'Email',
              edit: true,
              icon_name: 'email-outline',
              value: userData?.email,
              onPress: () =>
                navigation.navigate('EditProfile', {itemName: 'Email'}),
            })}
            {sectionItem({
              title: 'Gender',
              edit: true,
              icon_name: 'gender-male-female',
              value: userData?.gender,
              onPress: () => {
                bottomSheetRef.current?.expand();
              },
            })}
            {sectionItem({
              title: 'Locations',
              edit: true,
              icon_name: 'map-marker-radius-outline',
              onPress: () => navigation.navigate('EditLocation'),
            })}
          </StyledView>
        </StyledView>

        <StyledView className="h-1 bg-lightGrey" />

        <StyledView className="my-2">
          {sectionHeader('Your preferences')}
          <StyledView style={{paddingHorizontal: RPW(5)}}>
            {sectionItem({
              title: 'App Language',
              edit: true,
              icon_name: 'earth',
            })}
            {sectionItem({
              title: 'Notification',
              edit: true,
              icon_name: 'bell-outline',
            })}
          </StyledView>
        </StyledView>
      </StyledScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough={true} />
        )}
        index={-1}>
        <BottomSheetView>
          <StyledText className="py-4 text-lg text-black font-PoppinsMedium text-center">
            Select your gender
          </StyledText>
          {selectGender('Female')}
          {selectGender('Male')}
          {selectGender('Other')}
        </BottomSheetView>
      </BottomSheet>
    </StyledSafeAreaView>
  );
};
