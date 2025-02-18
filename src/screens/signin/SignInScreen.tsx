import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '../../components/rneui';
import axios from 'axios';
import {API_BASE} from '@env';
import GoogleIcon from '../../assets/svgs/GoogleIcon';
import InputField from '../../components/InputFeild';
import {useNav} from '../../navigation/RootNavigation';
// import auth from '@react-native-firebase/auth';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';

interface SignInData {
  phone: string;
}

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
        navigation.navigate('Verification', {phone: data.phone});
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
    <KeyboardAvoidingView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: RPW(8),
          marginTop: RPH(10),
        }}>
        <View className="my-8 items-center">
          <Text className="text-2xl font-medium text-black">
            {'Welcome back'}!
          </Text>
          <Text className="mt-3 text-lg font-normal text-dark">
            {'Enter Your Contact Number To '}
          </Text>
          <Text className="mt-3 text-lg font-normal text-dark">
            {'Sign In'}
          </Text>
        </View>

        <View className="gap-5 mb-3">
          {/* phone input */}
          <View>
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
              <Text className="text-error">
                {'Please enter valid mobile number'}
              </Text>
            )}
          </View>
        </View>

        {/* Button */}
        <View className="my-5">
          <Button
            loading={loading}
            title={'Send OTP'}
            onPress={(Keyboard.dismiss(), handleSubmit(submit))}
            primary
          />
        </View>

        <View className="flex-row justify-center">
          <Text className="mb-2 text-base font-normal text-dark">
            Don't have an account?{'  '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignUp' as never);
            }}>
            <Text className="mb-2 text-base font-medium text-primary underline">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-12 justify-center items-center">
          <View className="flex-row items-baseline">
            <View className="w-full h-0.5 bg-slate-300" />
            <View className="mx-3">
              <Text className="mb-5 text-base font-medium">
                Or continue with
              </Text>
            </View>
            <View className="w-full h-0.5 bg-slate-300" />
          </View>
          <TouchableOpacity
            className="p-1 bg-lightGrey rounded-full"
            onPress={() => {}}>
            <GoogleIcon />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
