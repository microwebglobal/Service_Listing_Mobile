import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {styled} from 'nativewind';
import {Dialog} from '@rneui/base';
import {useDispatch} from 'react-redux';
import {UserData} from './ProfileScreen';
import {Colors} from '../../utils/Colors';
import {useAppSelector} from '../../redux';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import {clearCart} from '../../redux/cart/cart.slice';
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
import {LoadingIndicator} from '../../components/LoadingIndicator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import classNames from 'classnames';

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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const AccountScreen = () => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const tabBarHeight = useBottomTabBarHeight();
  const [imageURI, setImageURI] = useState<string>();
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = React.useState<UserData>();
  const user = useAppSelector(state => state.user.user);
  const [count, setCount] = useState<number>(0);
  const optionalFields = useMemo(
    () => ['email_verified', 'mobile_verified'],
    [],
  );
  const requiredFields = useMemo(
    () => ['email', 'gender', 'nic', 'dob', 'mobile', 'photo'],
    [],
  );

  const calProgressBarCount = useCallback(
    (userDetails: UserData) => {
      let completedCount = 0;
      requiredFields.forEach(field => {
        if (userDetails?.[field as keyof UserData]) {
          completedCount++;
        }
      });
      optionalFields.forEach(field => {
        if (userDetails?.[field as keyof UserData]) {
          completedCount++;
        }
      });
      setCount(completedCount);
    },
    [optionalFields, requiredFields],
  );

  useFocusEffect(
    useCallback(() => {
      instance.get(`/customer-profiles/user/${user?.id}`).then(response => {
        setUserData(response.data);
        calProgressBarCount(response.data);
        dispatch(setId(response.data.u_id));
        setIsLoading(false);
      });
    }, [calProgressBarCount, dispatch, user?.id]),
  );

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const logout = async () => {
    await instance.post('/auth/logout').then(() => {
      toggleDialog();
      dispatch(clearCart());
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
      <StyledView className="border-b border-lightGrey">
        <TouchableOpacity onPress={() => (data.onPress ? data.onPress() : {})}>
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
        </TouchableOpacity>
      </StyledView>
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView
        className="flex-grow"
        showsVerticalScrollIndicator={false}
        style={{marginBottom: tabBarHeight}}>
        <StyledView
          className="mt-16 pb-5 bg-white"
          style={{paddingHorizontal: RPW(5)}}>
          <StyledView className="items-center justify-center">
            {imageURI && (
              <StyledImage
                source={{uri: imageURI}}
                className="w-28 h-28 rounded-full"
              />
            )}
            {!imageURI && (
              <StyledView className="w-28 h-28 rounded-full bg-primary items-center justify-center">
                <FontAwesome name="user-o" size={40} color={Colors.White} />
              </StyledView>
            )}
            <StyledTouchableOpacity
              className="p-2.5 bg-primary rounded-full relative left-8 -top-10 border-4 border-white"
              onPress={choosePhotoFromGallery}>
              <Feather name="camera" size={18} color={Colors.White} />
            </StyledTouchableOpacity>
          </StyledView>

          <StyledView className="-mt-6 items-center justify-center">
            <StyledTouchableOpacity
              className="flex-row items-center space-x-1"
              onPress={() =>
                navigation.navigate('Profile', {
                  completedCount: count,
                  totalCount: requiredFields.length + optionalFields.length,
                })
              }>
              <StyledText className="text-black text-lg font-PoppinsMedium">
                {userData?.name ? userData.name : 'Your Name'}
              </StyledText>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={25}
                color={Colors.Dark}
              />
            </StyledTouchableOpacity>
          </StyledView>

          <StyledView className="mt-5 p-3 bg-lightGrey rounded-lg">
            <StyledView className="flex-row justify-between">
              <StyledText className="text-black font-PoppinsRegular">
                {count} of {requiredFields.length + optionalFields.length}{' '}
                <StyledText className="text-primary font-PoppinsRegular">
                  complete
                </StyledText>
              </StyledText>
              <StyledText className="text-primary font-PoppinsRegular">
                Complete now
              </StyledText>
            </StyledView>
            <StyledView className="flex-1 my-3 flex-row items-center">
              <StyledView
                className={classNames(
                  `h-1 bg-primary rounded-full , ${
                    count === 0
                      ? 'basis-0'
                      : count === 1
                      ? 'basis-1/12'
                      : count === 2
                      ? 'basis-2/12'
                      : count === 3
                      ? 'basis-4/12'
                      : count === 4
                      ? 'basis-6/12'
                      : count === 5
                      ? 'basis-7/12'
                      : count === 6
                      ? 'basis-9/12'
                      : count === 7
                      ? 'basis-11/12'
                      : 'basis-full'
                  }`,
                )}
              />
              <StyledView className={'flex-1 h-1 bg-white rounded-full'} />
            </StyledView>
            <StyledText className="text-black text-sm font-PoppinsRegular">
              {
                'Additional information you give will help us provide you a more personalized experience.'
              }
            </StyledText>
          </StyledView>

          <StyledView className="my-5 p-3 bg-lightGrey rounded-lg">
            <StyledView className="flex-row justify-between items-center">
              <StyledText className="basis-3/4 text-black text-base font-PoppinsMedium">
                {"Don't miss out your valuable promotions"}
              </StyledText>
              <FontAwesome6 name="tags" size={25} color={Colors.Dark} />
            </StyledView>
            <StyledText className="mt-2 text-black text-sm font-PoppinsRegular">
              {
                'Get the latest promotions and offers from your favorite brands and stores.'
              }
            </StyledText>
          </StyledView>

          {sectionItem({
            title: 'Help and Support',
            edit: true,
            icon_name: 'help-circle-outline',
          })}
          {sectionItem({
            title: 'Wallet',
            edit: true,
            icon_name: 'wallet-outline',
            onPress: () =>
              navigation.navigate('Wallet', {
                accBalance: userData?.acc_balance || '0',
              }),
          })}
          {sectionItem({
            title: 'About Us',
            edit: true,
            icon_name: 'alert-circle-outline',
            onPress: () => navigation.navigate('AboutUs'),
          })}

          <StyledTouchableOpacity
            className="mt-3 flex-row items-center space-x-3"
            onPress={toggleDialog}>
            <Feather name="log-out" size={20} color={Colors.Error} />
            <StyledText className="text-error text-base font-PoppinsMedium">
              Logout
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Logout Dialog */}
        <Dialog
          isVisible={visible}
          onBackdropPress={toggleDialog}
          overlayStyle={styles.dialog}>
          <StyledText className="mb-5 text-base text-black font-PoppinsMedium text-center">
            Are you sure you want {'\n'}to logout?
          </StyledText>

          <StyledView className="space-y-5">
            <StyledView className="">
              <Button error title="Logout" size="md" onPress={logout} />
            </StyledView>
            <StyledView className="">
              <Button title="Cancel" size="md" onPress={toggleDialog} />
            </StyledView>
          </StyledView>
        </Dialog>
      </StyledScrollView>
    </StyledSafeAreaView>
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
