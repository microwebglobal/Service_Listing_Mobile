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
import {useAppSelector} from '../../redux';
import {Button} from '../../components/rneui';
import {setUser} from '../../redux/user/user.slice';
import {Controller, useForm} from 'react-hook-form';
import InputField from '../../components/InputFeild';
import {userUpdate} from '../../redux/user/user.action';
import Feather from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '../../components/DateTimePicker';
import {UserDetailEntity} from '../../redux/user/user.entity';
import {Screen, useNav} from '../../navigation/RootNavigation';
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

export const SignUpScreen: Screen<'SignUp'> = ({route}) => {
  const {phone, mode} = route.params;
  const navigation = useNav();
  const dispatch = useDispatch();
  const [imageURI, setImageURI] = useState<string>();
  const [date, setDate] = useState(new Date());
  const [selectDate, setSelectDate] = useState<string>('');
  const user = useAppSelector(state => state.user.user);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<UserDetailEntity>({defaultValues: {mobile: phone}});

  const submit = (data: UserDetailEntity) => {
    imageURI && (data.photo = imageURI);
    if (mode === 'login') {
      data.id = user?.id;
      userUpdate(user?.id, user?.name, user?.email, user?.gender, user?.dob);
    }
    dispatch(setUser(data));
    navigation.navigate('SelectLocation', {mode: mode});
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
            name="mobile"
            label="Mobile"
            control={control}
            errors={errors.mobile}
            rules={{
              required: true,
              pattern: /^[0-9]{10}$/,
              minLength: 10,
              maxlength: 10,
            }}
            placeHolder="Mobile"
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
            name="gender"
            label="Gender"
            control={control}
            errors={errors.gender}
            rules={{required: true}}
            placeHolder="Gender"
          />

          <StyledView className="mb-3">
            <StyledText className="mb-2 text-base text-black font-medium">
              Date of Birth
            </StyledText>
            <Controller
              name="dob"
              control={control}
              render={({field: {onChange, onBlur}}) => (
                <StyledView className="flex-row overflow-auto items-center">
                  <StyledView className="w-full">
                    <InputField
                      placeHolder={'mm/dd/yyyy'}
                      value={selectDate}
                      secure={false}
                      inputMode={'none'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  </StyledView>
                  <StyledView className="-ml-12">
                    <DateTimePicker
                      mode="date"
                      currentDate={new Date()}
                      onChange={(day: Date) => {
                        setDate(day);
                        setSelectDate(date.toLocaleDateString());
                      }}
                    />
                  </StyledView>
                </StyledView>
              )}
              rules={{required: selectDate === ''}}
            />
            {errors.dob && (
              <StyledText className="text-error">
                {'Date of birth is required'}
              </StyledText>
            )}
          </StyledView>
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
            : name === 'email'
            ? 'Please enter valid email address'
            : name === 'gender'
            ? 'Gender is required'
            : 'Full name is required'}
        </StyledText>
      )}
    </StyledView>
  );
};
