import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '../../components/rneui';
import {Colors} from '../../utils/Colors';
import CountDown from 'react-native-countdown-component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {API_BASE} from '@env';
import GoogleIcon from '../../assets/svgs/GoogleIcon';
import {userLogin} from '../../redux/user/user.action';

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
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignInData>();

  const submit = async (data: SignInData) => {
    setLoading(true);
    const result = await userLogin({mobile: phone, otp: data.otp});
    setLoading(false);
    if (result?.success) {
      navigation.navigate('LoginSuccess');
    }
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: RPW(8),
          marginTop: RPH(10),
        }}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back-ios-new"
              size={24}
              color={Colors.Dark}
            />
          </TouchableOpacity>
        </View>

        <View className="items-center mb-5">
          <Text className="text-2xl text-black font-medium">Enter OTP</Text>
          <Text className="mt-3 text-lg font-normal text-dark">
            Enter the 6 Digit Code Sent To
          </Text>
          <Text className="mt-3 text-lg font-normal text-dark">Your Phone</Text>
        </View>

        <View className="gap-5">
          {/* phone input */}
          <View>
            <Controller
              name="otp"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  placeholder="Enter otp"
                  secureTextEntry={true}
                  style={styles.input}
                  value={value}
                  inputMode="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true, minLength: 6, maxLength: 6}}
            />
            {errors.otp && (
              <Text className="text-error">
                {'Verification code is only 6 digit number'}
              </Text>
            )}
            {isValid && (
              <Text className="text-error">
                {'Invalid OTP'}
              </Text>
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
          <Text className="mb-5">
            {' '}
            ─────────── Or continue with ───────────
          </Text>
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

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 5,
    height: 55,
    paddingHorizontal: 10,
    fontSize: 16,
    color: Colors.Dark,
  },
});
