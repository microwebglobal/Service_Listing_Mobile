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
// import CountDown from 'react-native-countdown-component';
import axios from 'axios';
import {API_BASE} from '@env';

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

const VerificationScreen: Screen<'Verification'> = ({route}) => {
  const {phone} = route.params;
  const navigation = useNav();
  const [loading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(60);
  const [alertVisible, setAlertVisible] = useState<boolean>(true);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignInData>();

  const submit = (data: SignInData) => {
    setLoading(true);
    axios
      .post(`${API_BASE}/auth/customer/login/verify-otp`, {
        mobile: phone,
        otp: data.otp,
      })
      .then(function (response) {
        console.log(response);
        navigation.navigate('LoginSuccess');
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setLoading(false);
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
        <View className="items-center mb-5">
          <Text className="text-2xl text-black font-bold">
            OTP Verification
          </Text>
        </View>
        <View className="mb-5">
          <Text className="text-base font-normal text-black">
            OTP Code has been already sent to {phone}
          </Text>
        </View>

        <View className="gap-5 mb-3">
          {/* phone input */}
          <View>
            <Text className="mb-2 text-base font-normal text-black">
              {'Enter OTP number'}
            </Text>
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
          </View>
        </View>

        {/* Resend verification code */}
        <View className="mt-3 flex-row justify-between">
          <Text className="text-base font-medium text-dark">
            Didn't receive OTP Code?
          </Text>
          <TouchableOpacity>
            <Text className="text-base font-medium text-primary">
              Resend Code
            </Text>
          </TouchableOpacity>
          {/* <CountDown
            until={count}
            size={15}
            style={{width: RPW(8), height: 40}}
            onFinish={() =>
              alertVisible &&
              Alert.alert('OTP has expired', 'Request new OTP', [
                {
                  text: 'Request',
                  onPress: () => {
                    setCount(count + count * 0.0001);
                    // resendCode();
                  },
                  style: 'cancel',
                },
              ])
            }
            digitStyle={{backgroundColor: Colors.White}}
            digitTxtStyle={{
              color: Colors.Primary,
            }}
            timeToShow={['S']}
            timeLabels={{s: undefined}}
            running={true}
          /> */}
          {/* <Text className="text-base font-normal text-primary">seconds</Text> */}
        </View>
      </ScrollView>

      {/* Button */}
      <View
        className="fixed bottom-10"
        style={{
          marginHorizontal: RPW(8),
        }}>
        <Button
          loading={loading}
          title={'Verify & Proceed'}
          onPress={(Keyboard.dismiss(), handleSubmit(submit))}
          primary
        />
      </View>
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

export default VerificationScreen;
