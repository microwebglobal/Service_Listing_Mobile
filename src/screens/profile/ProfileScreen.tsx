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
import AppHeader from '../../components/AppHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import {useAppSelector} from '../../redux';
import {useDispatch} from 'react-redux';
import {setId} from '../../redux/user/user.slice';
import {useNav} from '../../navigation/RootNavigation';

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
  const navigation = useNav();
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const [userData, setUserData] = React.useState<UserData>();
  const user = useAppSelector(state => state.user.user);

  useEffect(() => {
    instance.get(`/customer-profiles/user/${user?.id}`).then(response => {
      setUserData(response.data);
      dispatch(setId(response.data.u_id));
    });
  }, [dispatch, user?.id]);

  const profileInfoItem = (
    title: string,
    value: string,
    edit: boolean,
    icon_name: string,
  ) => {
    return (
      <View style={{paddingHorizontal: RPW(6)}}>
        <TouchableOpacity
          onPress={() =>
            title !== 'Locations'
              ? navigation.navigate('EditProfile', {itemName: title})
              : navigation.navigate('EditLocation')
          }>
          <View className="flex-row items-center justify-between">
            <View className="my-3 flex-row items-center space-x-3">
              <MaterialCommunityIcons
                name={icon_name}
                size={25}
                color={Colors.Gray}
              />
              <View>
                <Text className="text-dark text-base font-medium">{title}</Text>
                {value && (
                  <View className="flex-row items-baseline space-x-1">
                    <Text className="text-base text-gray">{value}</Text>
                    {/* Check whether email or mobile verified */}
                    {userData !== undefined ? (
                      (title === 'Contact Number' &&
                        userData?.mobile_verified) ||
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
                  size={30}
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
              true,
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
