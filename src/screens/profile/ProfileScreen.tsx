import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Colors} from '../../utils/Colors';
import {useAppSelector} from '../../redux';
import {instance} from '../../api/instance';
import {setId} from '../../redux/user/user.slice';
import AppHeader from '../../components/AppHeader';
import {useNav} from '../../navigation/RootNavigation';
import {useFocusEffect} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
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

export const ProfileScreen = () => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const snapPoints = useMemo(() => ['30%'], []);
  const user = useAppSelector(state => state.user.user);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
      .put('users/profile/7', {
        gender,
      })
      .then(() => {
        fetchUserData();
      })
      .catch(e => console.log(e));
  };

  const sectionHeader = (header: string) => {
    return (
      <View>
        <Text
          className="my-3 text-base font-medium text-primary tracking-wider"
          style={{paddingHorizontal: RPW(5)}}>
          {header}
        </Text>
        <View className="h-[0.5] bg-lightGrey" />
      </View>
    );
  };

  const sectionItem = (data: sectionItemProps) => {
    return (
      <View className="border-t border-lightGrey">
        <TouchableOpacity
          onPress={() => {
            data.onPress ? data.onPress() : null;
          }}>
          <View className="flex-row items-center justify-between">
            <View className="my-3 flex-row items-center space-x-3">
              <MaterialCommunityIcons
                name={data.icon_name}
                size={22}
                color={Colors.Dark}
              />
              <View>
                <Text className="text-dark text-base font-medium">
                  {data.title}
                </Text>
                {data.value && (
                  <View className="flex-row items-baseline space-x-1">
                    <Text className="text-base text-gray">{data.value}</Text>
                    {userData !== undefined ? (
                      (data.title === 'Mobile' && userData?.mobile_verified) ||
                      (data.title === 'Email' && userData?.email_verified) ? (
                        <View className="w-3 h-3 rounded-full bg-green-500 items-center">
                          <MaterialCommunityIcons
                            name="check"
                            size={12}
                            color={Colors.White}
                          />
                        </View>
                      ) : null
                    ) : null}
                  </View>
                )}
              </View>
            </View>
            {data.edit && (
              <View className="-mr-2">
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={Colors.Gray}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const selectGender = (gender: string) => {
    return (
      <View className="py-3 border-t border-lightGrey">
        <TouchableOpacity
          onPress={() => {
            bottomSheetRef.current?.close();
            setIsOpen(false);
            updateGender(gender);
          }}>
          <Text className="text-base text-black text-center">{gender}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color={Colors.Black} />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="Your Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-3 bg-lightGrey" style={{paddingHorizontal: RPW(5)}}>
          <Text className="text-black text-sm">
            {
              'Additional information you give will help us provide you a more personalized experience.'
            }
          </Text>
          <View className="my-3 flex-row items-center">
            <View className="basis-10/12 h-1 bg-primary rounded-full" />
            <View className="basis-2/12 h-1 bg-white rounded-full" />
          </View>
          <View className="flex-row justify-between">
            <Text className="text-black">
              8 of 10 <Text className="text-primary">complete</Text>
            </Text>
            <View className="flex-row items-center space-x-1">
              <Text className="text-primary">Your information is secure</Text>
              <MaterialIcons
                name="verified-user"
                size={20}
                color={Colors.Primary}
              />
            </View>
          </View>
        </View>

        <View className="my-2">
          {sectionHeader('Your Information')}
          <View style={{paddingHorizontal: RPW(5)}}>
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
                setIsOpen(true);
              },
            })}
            {sectionItem({
              title: 'Locations',
              edit: true,
              icon_name: 'map-marker-radius-outline',
              onPress: () => navigation.navigate('EditLocation'),
            })}
          </View>
        </View>

        <View className="h-1 bg-lightGrey" />

        <View className="my-2">
          {sectionHeader('Your preferences')}
          <View style={{paddingHorizontal: RPW(5)}}>
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
          </View>
        </View>
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}>
        <BottomSheetView style={styles.contentContainer}>
          <Text className="py-4 text-lg text-black font-medium text-center">
            Select your gender
          </Text>
          {selectGender('Female')}
          {selectGender('Male')}
          {selectGender('Other')}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.Dark,
  },
});
