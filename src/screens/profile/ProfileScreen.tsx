import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {Colors} from '../../utils/Colors';
import {useAppSelector} from '../../redux';
import {instance} from '../../api/instance';
import {setId} from '../../redux/user/user.slice';
import {useNav} from '../../navigation/RootNavigation';
import {useFocusEffect} from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../../components/AppHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const ProfileScreen = () => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const [userData, setUserData] = React.useState<UserData>();
  const user = useAppSelector(state => state.user.user);

  useFocusEffect(
    useCallback(() => {
      instance.get(`/customer-profiles/user/${user?.id}`).then(response => {
        setUserData(response.data);
        dispatch(setId(response.data.u_id));
      });
    }, [dispatch, user?.id]),
  );

  const profileInfoItem = (
    title: string,
    edit: boolean,
    icon_name: string,
    value?: string,
  ) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            title === 'Locations'
              ? navigation.navigate('EditLocation')
              : title === 'Terms and Conditions' ||
                title === 'Privacy' ||
                title === 'About QProz'
              ? navigation.navigate('Terms')
              : navigation.navigate('EditProfile', {itemName: title})
          }>
          <View className="flex-row items-center justify-between">
            <View className="my-3 flex-row items-center space-x-3">
              <MaterialCommunityIcons
                name={icon_name}
                size={22}
                color={Colors.Gray}
              />
              <View>
                <Text className="text-dark text-base font-medium">{title}</Text>
                {value && (
                  <View className="flex-row items-baseline space-x-1">
                    <Text className="text-base text-gray">{value}</Text>
                    {/* Check whether email or mobile verified */}
                    {userData !== undefined ? (
                      (title === 'Mobile' && userData?.mobile_verified) ||
                      (title === 'Email' && userData?.email_verified) ? (
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
            {edit && (
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

  return (
    <SafeAreaView className="flex-1">
      <AppHeader back={true} title="Your Profile" />
      <ScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}>
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

        {/* Your Information Section */}
        <View
          className="mt-1 pb-5 bg-white"
          style={{paddingHorizontal: RPW(5)}}>
          <Text className="my-3 text-base font-medium text-primary tracking-wider">
            Your Information
          </Text>

          <View className="bg-white">
            {profileInfoItem(
              'Full Name',
              true,
              'account-outline',
              userData?.name,
            )}
            {profileInfoItem(
              'Mobile',
              true,
              'phone-in-talk-outline',
              userData?.mobile,
            )}
            {profileInfoItem('Email', true, 'email-outline', userData?.email)}
            {profileInfoItem(
              'Gender',
              true,
              'gender-male-female',
              userData?.gender,
            )}
            {profileInfoItem('Locations', true, 'map-marker-account-outline')}
          </View>
        </View>

        {/* General Section */}
        <View
          className="mt-1 pb-5 bg-white"
          style={{paddingHorizontal: RPW(5)}}>
          <Text className="my-3 text-base font-medium text-primary tracking-wider">
            Your preferences
          </Text>

          <View className="bg-white">
            {profileInfoItem('App Language', true, 'earth')}
            {profileInfoItem('Notification', true, 'bell-outline')}
          </View>
        </View>

        {/* About App Section */}
        <View
          className="mt-1 pb-5 bg-white"
          style={{paddingHorizontal: RPW(5)}}>
          <Text className="my-3 text-base font-medium text-primary tracking-wider">
            General
          </Text>

          <View>
            {profileInfoItem('Support', true, 'help-circle-outline')}
            {profileInfoItem('Rate Us', true, 'star-outline')}
            {profileInfoItem('Privacy', true, 'security')}
            {profileInfoItem(
              'Terms and Conditions',
              true,
              'file-document-outline',
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
