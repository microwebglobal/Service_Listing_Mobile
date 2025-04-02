import {
  Text,
  View,
  Keyboard,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {API_BASE} from '@env';
import {styled} from 'nativewind';
import {Colors} from '../../utils/Colors';
import {Button} from '../../components/rneui';
import AppHeader from '../../components/AppHeader';
import GoogleIcon from '../../assets/svgs/GoogleIcon';
import {userLogin} from '../../redux/user/user.action';
import CountDown from 'react-native-countdown-component';
import {Screen, useNav} from '../../navigation/RootNavigation';
import OTPInputView from '@twotalltotems/react-native-otp-input';

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
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const VerificationScreen: Screen<'Verification'> = ({route}) => {
  const {phone} = route.params;
  const navigation = useNav();
  const [loading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(60);
  const [otp, setOtp] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const submit = async () => {
    otp?.length !== 6 ? setError(true) : setError(false);
    try {
      if (!error) {
        const response = await userLogin({mobile: phone, otp: otp});
        if (response?.success) {
          if (response.firstTimeLogin) {
            navigation.navigate('SignUp');
          } else {
            navigation.navigate('LoginSuccess');
          }
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
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledKeyboardAvoidingView>
        <AppHeader back={true} />
        <StyledScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginHorizontal: RPW(5),
            paddingTop: RPH(5),
          }}>
          <StyledView>
            <StyledView className="items-center mb-5">
              <StyledText className="text-2xl text-black font-medium">
                Enter OTP
              </StyledText>
              <StyledText className="mt-3 text-lg font-normal text-dark">
                Enter the 6 Digit Code Sent To
              </StyledText>
              <StyledText className="mt-3 text-lg font-normal text-dark">
                Your Phone
              </StyledText>
            </StyledView>

            {/* OTP input */}
            <StyledView className="flex-1 my-2 items-start">
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
                <StyledText className="text-error text-start">
                  {'Verification code is only 6 digit number'}
                </StyledText>
              )}
              {!error && isValid && (
                <StyledText className="text-error">
                  {'Invalid or expired OTP'}
                </StyledText>
              )}
            </StyledView>

            <StyledView className="mt-3 flex-row items-center">
              <StyledText className="text-base font-normal text-dark">
                OTP will expire in
              </StyledText>
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
              <StyledText className="text-base font-normal text-dark">
                seconds
              </StyledText>
            </StyledView>

            {/* Button */}
            <StyledView className="my-5">
              <Button
                loading={loading}
                title={'Login'}
                onPress={(Keyboard.dismiss(), submit)}
                primary
              />
            </StyledView>

            <StyledView className="flex-row justify-center">
              <StyledText className="mb-2 text-base font-normal text-dark">
                Didn't receive the SMS?{'  '}
              </StyledText>
              <StyledTouchableOpacity
                onPress={() => {
                  setCount(count + count * 0.0001);
                  resendOTP();
                }}>
                <StyledText className="mb-2 text-base font-medium text-primary underline">
                  Resend it
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
          </StyledView>
        </StyledScrollView>
      </StyledKeyboardAvoidingView>
    </StyledSafeAreaView>
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
