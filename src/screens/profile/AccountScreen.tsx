import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Dialog} from '@rneui/base';
import {useDispatch} from 'react-redux';
import {UserData} from './ProfileScreen';
import {Colors} from '../../utils/Colors';
import {useAppSelector} from '../../redux';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import {useNav} from '../../navigation/RootNavigation';
import {useFocusEffect} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {userLogout} from '../../redux/user/user.action';
import ImagePicker from 'react-native-image-crop-picker';
import {logOut, setId} from '../../redux/user/user.slice';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

interface sectionItemProps {
  title: string;
  edit: boolean;
  icon_name: string;
  onPress?: () => void;
}

export const AccountScreen = () => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const [imageURI, setImageURI] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = React.useState<UserData>();
  const user = useAppSelector(state => state.user.user);

  useFocusEffect(
    useCallback(() => {
      instance.get(`/customer-profiles/user/${user?.id}`).then(response => {
        setUserData(response.data);
        dispatch(setId(response.data.u_id));
        setIsLoading(false);
      });
    }, [dispatch, user?.id]),
  );

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const logout = async () => {
    await instance.post('/auth/logout').then(() => {
      toggleDialog();
      navigation.navigate('SignIn');
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
      dispatch(logOut());
      userLogout();
    });
  };

  const choosePhotoFromGallery = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImageURI(image.path);
    });
  };

  const sectionItem = (data: sectionItemProps) => {
    return (
      <View className="border-b border-lightGrey">
        <TouchableOpacity onPress={() => (data.onPress ? data.onPress() : {})}>
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

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color={Colors.Black} />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}>
        <View
          className="pt-10 pb-5 bg-white"
          style={{paddingHorizontal: RPW(5)}}>
          <View className="items-center justify-center">
            {imageURI && (
              <Image
                source={{uri: imageURI}}
                className="w-28 h-28 rounded-full"
              />
            )}
            {!imageURI && (
              <View className="w-28 h-28 rounded-full bg-primary items-center justify-center">
                <FontAwesome name="user-o" size={40} color={Colors.White} />
              </View>
            )}
            <TouchableOpacity
              className="p-2.5 bg-primary rounded-full relative left-8 -top-10 border-4 border-white"
              onPress={choosePhotoFromGallery}>
              <Feather name="camera" size={18} color={Colors.White} />
            </TouchableOpacity>
          </View>

          <View className="-mt-6 items-center justify-center">
            <TouchableOpacity
              className="flex-row items-center space-x-1"
              onPress={() => navigation.navigate('Profile')}>
              <Text className="text-black text-lg font-medium">
                {userData?.name ? userData.name : 'Your Name'}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={25}
                color={Colors.Dark}
              />
            </TouchableOpacity>
          </View>

          <View className="my-5 items-center">
            <Button
              size="sm"
              title="Premium Plus User"
              onPress={() => navigation.navigate('Profile')}
            />
          </View>

          <View className="p-3 bg-lightGrey rounded-lg">
            <View className="flex-row justify-between">
              <Text className="text-black">
                8 of 10 <Text className="text-primary">complete</Text>
              </Text>
              <Text className="text-primary">Complete now</Text>
            </View>
            <View className="my-3 flex-row items-center">
              <View className="basis-10/12 h-1 bg-primary rounded-full" />
              <View className="basis-2/12 h-1 bg-white rounded-full" />
            </View>
            <Text className="text-black text-sm">
              {
                'Additional information you give will help us provide you a more personalized experience.'
              }
            </Text>
          </View>

          <View className="my-5 p-3 bg-lightGrey rounded-lg">
            <View className="flex-row justify-between items-center">
              <Text className="basis-3/4 text-black text-base font-medium">
                {"Don't miss out your valuable promotions"}
              </Text>
              <FontAwesome6 name="tags" size={25} color={Colors.Dark} />
            </View>
            <Text className="mt-2 text-black text-sm">
              {
                'Get the latest promotions and offers from your favorite brands and stores.'
              }
            </Text>
          </View>

          {sectionItem({
            title: 'Help and Support',
            edit: true,
            icon_name: 'help-circle-outline',
          })}
          {sectionItem({
            title: 'Payment',
            edit: true,
            icon_name: 'wallet-outline',
          })}
          {sectionItem({
            title: 'About Us',
            edit: true,
            icon_name: 'alert-circle-outline',
            onPress: () => navigation.navigate('AboutUs'),
          })}

          <TouchableOpacity
            className="mt-3 flex-row items-center space-x-3"
            onPress={toggleDialog}>
            <Feather name="log-out" size={20} color={Colors.Error} />
            <Text className="text-error text-base font-medium">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Dialog */}
        <Dialog
          isVisible={visible}
          onBackdropPress={toggleDialog}
          overlayStyle={styles.dialog}>
          <Text className="mb-5 text-base text-black font-medium text-center">
            Are you sure you want {'\n'}to logout?
          </Text>

          <View className="space-y-5">
            <View className="">
              <Button error title="Logout" size="md" onPress={logout} />
            </View>
            <View className="">
              <Button title="Cancel" size="md" onPress={toggleDialog} />
            </View>
          </View>
        </Dialog>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dialog: {
    padding: 15,
    width: '75%',
    backgroundColor: Colors.White,
    borderRadius: 15,
  },
});
