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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '../../components/rneui';
import Icon from 'react-native-vector-icons/FontAwesome';
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
                <TextInput
                  placeholder="Contact number"
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
              navigation.navigate('SignUp');
            }}>
            <Text className="mb-2 text-base font-medium text-primary underline">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-12 justify-center items-center">
          <Text className="mb-5"> ─────────── Or continue with ───────────</Text>
          <TouchableOpacity onPress={() => {}}>
            {/* Google Icon */}
            <Icon
              name="google"
              color={Colors.Black}
              onPress={() => {}}
            />
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
