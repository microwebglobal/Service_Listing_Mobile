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
import {Screen, useNav} from '../../navigation/RootNavigation';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '../../components/rneui';
import {Colors} from '../../utils/Colors';
import CountDown from 'react-native-countdown-component';
import axios from 'axios';
import {API_BASE} from '@env';
import GoogleIcon from '../../assets/svgs/GoogleIcon';
import {userLogin, userUpdate} from '../../redux/user/user.action';
import {useAppSelector} from '../../redux';
import AppHeader from '../../components/AppHeader';
import InputField from '../../components/InputFeild';

interface SignInData {
  otp: string;
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

export const VerificationScreen: Screen<'Verification'> = ({route}) => {
  const {phone} = route.params;
  const navigation = useNav();
  const [loading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(60);
  const [isValid, setIsValid] = useState<boolean>(false);
  const user = useAppSelector(state => state.user.user);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignInData>();
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2]; // -2 because -1 is the current route

  const submit = async (data: SignInData) => {
    setLoading(true);
    const result = await userLogin({mobile: phone, otp: data.otp});
    if (result?.success) {
      if (prevRoute.name === 'SelectLocation') {
        userUpdate(user?.name, user?.email, user?.id);
      }
      navigation.navigate('LoginSuccess');
    }
    setLoading(false);
    setIsValid(true);
  };

  const resendOTP = () => {
    axios
      .post(`${API_BASE}/auth/customer/login/send-otp`, {
        mobile: phone,
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <AppHeader back={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: RPW(8),
          marginTop: RPH(5),
        }}>
        <View>
          <View className="items-center mb-5">
            <Text className="text-2xl text-black font-medium">Enter OTP</Text>
            <Text className="mt-3 text-lg font-normal text-dark">
              Enter the 6 Digit Code Sent To
            </Text>
            <Text className="mt-3 text-lg font-normal text-dark">
              Your Phone
            </Text>
          </View>

          <View className="gap-5">
            {/* phone input */}
            <View>
              <Controller
                name="otp"
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputField
                    placeHolder={'Enter otp'}
                    secure={true}
                    value={value}
                    inputMode={'text'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onChange={() => setIsValid(false)}
                  />
                )}
                rules={{required: true, minLength: 6, maxLength: 6}}
              />
              {errors.otp && (
                <Text className="text-error">
                  {'Verification code is only 6 digit number'}
                </Text>
              )}
              {!errors.otp && isValid && (
                <Text className="text-error">{'Invalid OTP'}</Text>
              )}
            </View>
          </View>

          <View className="flex-row items-center">
            <Text className="text-base font-normal text-dark">
              OTP will expire in
            </Text>
            <CountDown
              until={count}
              size={15}
              style={{width: RPW(8), height: 40}}
              digitStyle={{backgroundColor: Colors.White}}
              digitTxtStyle={{
                color: Colors.Primary,
              }}
              timeToShow={['S']}
              timeLabels={{s: undefined}}
              running={true}
            />
            <Text className="text-base font-normal text-dark">seconds</Text>
          </View>

          {/* Button */}
          <View className="my-5">
            <Button
              loading={loading}
              title={'Login'}
              onPress={(Keyboard.dismiss(), handleSubmit(submit))}
              primary
            />
          </View>

          <View className="flex-row justify-center">
            <Text className="mb-2 text-base font-normal text-dark">
              Didn't receive the SMS?{'  '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setCount(count + count * 0.0001);
                resendOTP();
              }}>
              <Text className="mb-2 text-base font-medium text-primary underline">
                Resend it
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
