import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {useAppSelector} from '../../redux';

interface UserData {
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
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const [userData, setUserData] = React.useState<UserData>();
  const user = useAppSelector(state => state.user.user);

  useEffect(() => {
    instance.get(`/customer-profiles/user/${user?.id}`).then(response => {
      setUserData(response.data);
    });
  }, [user?.id]);

  const profileInfoItem = (
    title: string,
    value: string,
    edit: boolean,
    icon_name: string,
  ) => {
    return (
      <View style={{paddingHorizontal: RPW(6)}}>
        <View className="flex-row items-center justify-between">
          <View className="my-3 flex-row items-center space-x-3">
            <MaterialCommunityIcons
              name={icon_name}
              size={25}
              color={Colors.Gray}
            />
            <View>
              <Text className="text-dark text-base font-medium">{title}</Text>
              {value && <Text className="text-base text-gray">{value}</Text>}
            </View>
          </View>
          {edit && (
            <TouchableOpacity className="-mr-2" onPress={() => {}}>
              <MaterialCommunityIcons
                name="chevron-right"
                size={30}
                color={Colors.Gray}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <AppHeader title="Your Profile" back={true} />
      <View className="h-5 bg-white" />
      <ScrollView
        className="flex-grow bg-lightGrey"
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}>
        {/* Your Information Section */}
        <View>
          <Text
            className="my-3 text-sm font-medium text-primary uppercase tracking-wider"
            style={{paddingHorizontal: RPW(6)}}>
            Your Information
          </Text>

          <View className="bg-white">
            {profileInfoItem(
              'Name',
              userData?.name ?? '',
              false,
              'account-outline',
            )}
            {profileInfoItem(
              'Email',
              userData?.email ?? '',
              true,
              'email-outline',
            )}
            {profileInfoItem('Password', '', true, 'lock-outline')}
            {profileInfoItem(
              'Contact Number',
              userData?.mobile ?? '',
              true,
              'phone-in-talk-outline',
            )}
            {profileInfoItem(
              'Locations',
              '',
              true,
              'map-marker-account-outline',
            )}
          </View>
        </View>

        {/* General Section */}
        <View>
          <Text
            className="my-3 text-sm font-medium text-primary uppercase tracking-wider"
            style={{paddingHorizontal: RPW(6)}}>
            General
          </Text>

          <View className="bg-white">
            {profileInfoItem('App Language', '', true, 'earth')}
            {profileInfoItem('Notifications', '', true, 'bell-outline')}
            {profileInfoItem('Support', '', true, 'help-circle-outline')}
            {profileInfoItem('Rate Us', '', true, 'star-outline')}
          </View>
        </View>

        {/* About App Section */}
        <View className="mb-5">
          <Text
            className="my-3 text-sm font-medium text-primary uppercase tracking-wider"
            style={{paddingHorizontal: RPW(6)}}>
            About App
          </Text>

          <View className="bg-white">
            {profileInfoItem('Privacy Policy', '', true, 'shield-outline')}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
