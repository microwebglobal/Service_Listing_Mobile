import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Image,
  BackHandler,
} from 'react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useNav} from '../../navigation/RootNavigation';
import {Colors} from '../../utils/Colors';
import {Button} from '../../components/rneui';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setUser} from '../../redux/user/user.slice';
import {UserDetailEntity} from '../../redux/user/user.entity';
import InputField from '../../components/InputFeild';

// Get screen dimension
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// RPW and RPH are functions to set responsive width and height
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

export const SignUpScreen = () => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const [imageURI, setImageURI] = useState<string>();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<UserDetailEntity>();

  const submit = (data: UserDetailEntity) => {
    imageURI && (data.photo = imageURI);
    dispatch(setUser(data));
    navigation.navigate('SelectLocation');
  };

  //   const takePhotoFromCamera = async () => {
  //     ImagePicker.openCamera({
  //       width: 300,
  //       height: 400,
  //       cropping: true,
  //     }).then(image => {
  //       setImageURI(image.path);
  //     });
  //   };

  const choosePhotoFromGallery = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImageURI(image.path);
    });
  };

  // Back handler function
  const handlerBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  useFocusEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handlerBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handlerBackPress);
    };
  });

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: RPW(5),
          paddingVertical: RPH(5),
        }}>
        {/* Image selection */}
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

        <View className="mb-8 items-center">
          <Text className="text-2xl font-medium text-black">
            Let's Set You Up!
          </Text>
          <Text className="mt-3 text-base font-medium text-dark">
            Sign Up To Continue
          </Text>
        </View>

        {/* User Details Form */}
        <View className="gap-5 mb-3">
          <View>
            <Controller
              name="name"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  placeHolder={'Full Name'}
                  value={value}
                  secure={false}
                  inputMode={'text'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
            {errors.name && (
              <Text className="text-error">{'Full name is required'}</Text>
            )}
          </View>

          <View>
            <Controller
              name="userName"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  placeHolder={'User Name'}
                  value={value}
                  secure={false}
                  inputMode={'text'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
            {errors.name && (
              <Text className="text-error">{'User name is required'}</Text>
            )}
          </View>

          <View>
            <Controller
              name="email"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  placeHolder={'email'}
                  value={value}
                  secure={false}
                  inputMode={'email'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true, pattern: /^\S+@\S+$/i}}
            />
            {errors.email && (
              <Text className="text-error">
                {'Please enter valid email address'}
              </Text>
            )}
          </View>

          <View>
            <Controller
              name="password"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  placeHolder={'Password'}
                  value={value}
                  secure={true}
                  inputMode={'text'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true, minLength: 8, maxLength: 15}}
            />
            {errors.password && (
              <Text className="text-error">
                {'Password must be between 8 to 15 characters'}
              </Text>
            )}
          </View>

          <View>
            <Controller
              name="mobile"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  placeHolder={'Contact number'}
                  value={value}
                  secure={false}
                  inputMode={'numeric'}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true, minLength: 10, maxLength: 10}}
            />
            {errors.mobile && (
              <Text className="text-error">
                {'Please enter valid mobile number'}
              </Text>
            )}
          </View>
        </View>
        <View>
          <View className="my-5">
            <Button
              loading={false}
              title={'Continue'}
              onPress={(Keyboard.dismiss(), handleSubmit(submit))}
              primary
            />
          </View>

          <View className="flex-row justify-center">
            <Text className="text-base font-normal text-dark">
              Already have an account?{'  '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignIn');
              }}>
              <Text className="text-base font-medium text-primary underline">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
