import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {Button} from '../../components/rneui';
import {Colors} from '../../utils/Colors';
import CountDown from 'react-native-countdown-component';
import axios from 'axios';
import {API_BASE} from '@env';
import GoogleIcon from '../../assets/svgs/GoogleIcon';
import {useAppSelector} from '../../redux';
import AppHeader from '../../components/AppHeader';
import {userLogin, userUpdate} from '../../redux/user/user.action';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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
  const [otp, setOtp] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const user = useAppSelector(state => state.user.user);
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2]; // -2 because -1 is the current route

  const submit = async () => {
    otp?.length !== 6 ? setError(true) : setError(false);
    try {
      if (!error) {
        const response = await userLogin({mobile: phone, otp: otp});
        if (response?.success) {
          if (prevRoute.name === 'SelectLocation') {
            userUpdate(user?.name, user?.email, user?.id);
          }
          navigation.navigate('LoginSuccess');
        } else {
          setIsValid(true);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = () => {
    axios
      .post(`${API_BASE}/auth/customer/login/send-otp`, {
        mobile: phone,
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <AppHeader back={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: RPW(5),
          paddingTop: RPH(5),
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

          {/* OTP input */}
          <View className="flex-1 my-2 items-start">
            <OTPInputView
              pinCount={6}
              autoFocusOnLoad={true}
              keyboardType="number-pad"
              editable={true}
              codeInputFieldStyle={styles.InputStyleBase}
              codeInputHighlightStyle={styles.InputStyleHighLighted}
              onCodeChanged={() => {
                setError(false);
                setIsValid(false);
              }}
              onCodeFilled={code => {
                setOtp(code);
              }}
            />
            {error && (
              <Text className="text-error text-start">
                {'Verification code is only 6 digit number'}
              </Text>
            )}
            {!error && isValid && (
              <Text className="text-error">{'Invalid or expired OTP'}</Text>
            )}
          </View>

          <View className="mt-3 flex-row items-center">
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
              onPress={(Keyboard.dismiss(), submit)}
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

const styles = StyleSheet.create({
  InputStyleBase: {
    fontSize: 20,
    width: 45,
    height: 50,
    color: Colors.Black,
    borderWidth: 1.5,
    borderRadius: 6,
    borderBlockColor: Colors.Gray,
  },
  InputStyleHighLighted: {
    borderColor: Colors.Black,
  },
});
