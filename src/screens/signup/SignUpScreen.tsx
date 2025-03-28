import {
  View,
  Text,
  Image,
  Keyboard,
  Dimensions,
  ScrollView,
  BackHandler,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {styled} from 'nativewind';
import {useDispatch} from 'react-redux';
import {Colors} from '../../utils/Colors';
import {Button} from '../../components/rneui';
import {setUser} from '../../redux/user/user.slice';
import {Controller, useForm} from 'react-hook-form';
import InputField from '../../components/InputFeild';
import {useNav} from '../../navigation/RootNavigation';
import Feather from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {UserDetailEntity} from '../../redux/user/user.entity';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

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
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: RPW(5),
          paddingVertical: RPH(5),
        }}>
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

        <StyledView className="mb-6 items-center">
          <StyledText className="text-2xl font-medium text-black">
            Let's Set You Up!
          </StyledText>
          <StyledText className="mt-3 text-base font-medium text-dark">
            Sign Up To Continue
          </StyledText>
        </StyledView>

        {/* User Details Form */}
        <StyledView>
          <SignUpFormField
            name="name"
            label="Full Name"
            control={control}
            errors={errors.name}
            rules={{required: true}}
            placeHolder="Full Name"
          />
          <SignUpFormField
            name="userName"
            label="User Name"
            control={control}
            errors={errors.userName}
            rules={{required: true}}
            placeHolder="User Name"
          />
          <SignUpFormField
            name="email"
            label="Email"
            control={control}
            errors={errors.email}
            rules={{required: true, pattern: /^\S+@\S+$/i}}
            placeHolder="Email"
          />
          <SignUpFormField
            name="password"
            label="Password"
            control={control}
            errors={errors.password}
            rules={{required: true, minLength: 8, maxLength: 15}}
            placeHolder="Password"
          />
          <SignUpFormField
            name="mobile"
            label="Mobile"
            control={control}
            errors={errors.mobile}
            rules={{required: true, minLength: 10, maxLength: 10}}
            placeHolder="Mobile"
          />
        </StyledView>
        <StyledView className="mb-28">
          <StyledView className="my-5">
            <Button
              loading={false}
              title={'Continue'}
              onPress={(Keyboard.dismiss(), handleSubmit(submit))}
              primary
            />
          </StyledView>

          <StyledView className="flex-row justify-center">
            <StyledText className="text-base font-normal text-dark">
              Already have an account?{'  '}
            </StyledText>
            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate('SignIn');
              }}>
              <StyledText className="text-base font-medium text-primary underline">
                Sign In
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

interface SignUpFormFieldProps {
  rules: any;
  errors: any;
  control: any;
  name: string;
  label: string;
  placeHolder: string;
}

const SignUpFormField: React.FC<SignUpFormFieldProps> = ({
  name,
  label,
  rules,
  errors,
  control,
  placeHolder,
}) => {
  return (
    <StyledView className="mb-2">
      <StyledText className="mb-2 text-base text-black font-medium">
        {label}
      </StyledText>
      <Controller
        name={name}
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <InputField
            placeHolder={placeHolder}
            value={value}
            secure={name === 'password' ? true : false}
            inputMode={
              name === 'mobile'
                ? 'numeric'
                : name === 'email'
                ? 'email'
                : 'text'
            }
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={rules}
      />
      {errors && (
        <StyledText className="text-error">
          {name === 'mobile'
            ? 'Please enter valid mobile number'
            : name === 'password'
            ? 'Password must be between 8 to 15 characters'
            : name === 'email'
            ? 'Please enter valid email address'
            : name === 'userName'
            ? 'User name is required'
            : name === 'name'
            ? 'Full name is required'
            : ''}
        </StyledText>
      )}
    </StyledView>
  );
};
