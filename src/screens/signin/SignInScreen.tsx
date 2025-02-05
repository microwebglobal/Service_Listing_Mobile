import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '../../components/rneui';
import axios from 'axios';
import {API_BASE} from '@env';

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
  const navigation = useNavigation();
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

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: RPW(8),
          marginTop: RPH(10),
        }}>
        {/* Image */}
        <View className="items-center ">
          <Image
            source={require('../../assets/app-images/logo.png')}
            style={styles.imageStyle}
          />
        </View>

        <View className="my-8 items-center">
          <Text className="text-3xl font-semibold text-black">
            {'Welcome back'}!
          </Text>
          <Text className="mt-3 text-xl font-normal text-dark">
            {'Please login to your account.'}
          </Text>
        </View>

        <View className="gap-5 mb-3">
          {/* phone input */}
          <View>
            <Text className="mb-2 text-lg font-normal text-black">
              Mobile Number
            </Text>
            <Controller
              name="phone"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  placeholder="Enter your mobile number"
                  secureTextEntry={true}
                  style={styles.input}
                  value={value}
                  inputMode="numeric"
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
        <View className="mb-10">
          <Button
            loading={loading}
            title={'Request OTP'}
            onPress={(Keyboard.dismiss(), handleSubmit(submit))}
            primary
          />
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
  imageStyle: {
    height: RPH(20),
    width: RPW(60),
    resizeMode: 'contain',
  },
});
