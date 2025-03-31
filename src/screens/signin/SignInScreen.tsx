import {
  Text,
  View,
  Keyboard,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {API_BASE} from '@env';
import {styled} from 'nativewind';
import {Button} from '../../components/rneui';
import {Controller, useForm} from 'react-hook-form';
import InputField from '../../components/InputFeild';
import GoogleIcon from '../../assets/svgs/GoogleIcon';
import {useNav} from '../../navigation/RootNavigation';
// import auth from '@react-native-firebase/auth';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';

interface SignInData {
  phone: string;
}

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
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const SignInScreen = () => {
  const navigation = useNav();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignInData>();

  const submit = (data: SignInData) => {
    setLoading(true);
    axios
      .post(`${API_BASE}/auth/customer/login/send-otp`, {
        mobile: data.phone,
      })
      .then(response => {
        navigation.navigate('Verification', {phone: data.phone, mode: 'login'});
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: '',
  //   });
  // }, []);

  // async function onGoogleButtonPress() {
  //   try {
  //     // Check if your device supports Google Play
  //     await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  //     // Get the users ID token
  //     const idToken = await GoogleSignin.signIn();

  //     console.log(idToken);
  //     Alert.alert('Success Login');

  //     // Create a Google credential with the token
  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  //     // Sign-in the user with the credential
  //     return auth().signInWithCredential(googleCredential);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView>
        <StyledScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginHorizontal: RPW(5),
            paddingTop: RPH(10),
          }}>
          <StyledView className="my-8 items-center">
            <StyledText className="text-2xl font-medium text-black">
              {'Welcome back'}!
            </StyledText>
            <StyledText className="mt-3 text-lg font-normal text-dark">
              {'Enter Your Contact Number To '}
            </StyledText>
            <StyledText className="mt-3 text-lg font-normal text-dark">
              {'Sign In'}
            </StyledText>
          </StyledView>

          <StyledView className="gap-5 mb-3">
            <StyledView>
              <Controller
                name="phone"
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
              {errors.phone && (
                <StyledText className="text-error">
                  {'Please enter valid mobile number'}
                </StyledText>
              )}
            </StyledView>
          </StyledView>

          <StyledView className="my-5">
            <Button
              loading={loading}
              title={'Send OTP'}
              onPress={(Keyboard.dismiss(), handleSubmit(submit))}
              primary
            />
          </StyledView>

          <StyledView className="flex-row justify-center">
            <StyledText className="mb-2 text-base font-normal text-dark">
              Don't have an account?{'  '}
            </StyledText>
            <StyledTouchableOpacity
              onPress={() => {
                navigation.navigate('SignUp', {mode: 'signup'});
              }}>
              <StyledText className="mb-2 text-base font-medium text-primary underline">
                Sign Up
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          <StyledView className="mt-12 justify-center items-center">
            <StyledView className="flex-row items-baseline">
              <StyledView className="w-full h-0.5 bg-slate-300" />
              <StyledView className="mx-3">
                <StyledText className="mb-5 text-base font-medium">
                  Or continue with
                </StyledText>
              </StyledView>
              <StyledView className="w-full h-0.5 bg-slate-300" />
            </StyledView>
            <StyledTouchableOpacity
              className="p-1 bg-lightGrey rounded-full"
              onPress={() => {}}>
              <GoogleIcon />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledScrollView>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};
