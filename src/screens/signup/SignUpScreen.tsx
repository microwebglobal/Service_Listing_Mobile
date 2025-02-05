import React, {useState} from 'react';
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native';
import {Screen, useNav} from '../../navigation/RootNavigation.tsx';
import {Colors} from '../../utils/Colors.ts';
import {Controller, useForm} from 'react-hook-form';

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

export const SignUpScreen: Screen<'SignUp'> = () => {
  const navigation = useNav();
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm();

  const submit = (data: any) => {
    const user = {
      name: data.firstName + ' ' + data.lastName,
      email: data.email,
      password: data.password,
      isSignedIn: true,
    };
    navigation.navigate('SignIn');
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: RPW(8),
          marginTop: RPH(10),
          paddingBottom: RPH(20),
        }}>
        <View className="items-center my-8">
          <Text className="text-3xl font-semibold text-black">Sign Up</Text>
          <Text className="mt-3 text-xl font-normal text-dark">
            Sign up to try our amazing services.
          </Text>
        </View>

        <View className="gap-5 mb-3">
          <View>
            {/* Email input */}
            <Text className="mb-2 text-lg font-normal text-black">Email</Text>
            <Controller
              name="email"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  placeholder="Enter your email"
                  style={styles.input}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true, pattern: /^\S+@\S+$/i}}
            />
            {errors.email && (
              <Text className="text-red-600">
                {'Enter valid email address'}
              </Text>
            )}
          </View>

          <View>
            {/* Password input */}
            <Text className="mb-2 text-lg font-normal text-black">
              Password
            </Text>
            <Controller
              name="password"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  style={styles.input}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true, minLength: 6}}
            />
            {errors.password && (
              <Text className="text-red-600">
                {'Password must be at least 6 characters'}
              </Text>
            )}
          </View>

          <View>
            {/* Password input */}
            <Text className="mb-2 text-lg font-normal text-black">
              Confirm Password
            </Text>
            <Controller
              name="confirmPassword"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  placeholder="Enter your confirm password"
                  secureTextEntry={true}
                  style={styles.input}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{
                required: true,
                minLength: 6,
                validate: value => value === watch('password'),
              }}
            />
            {errors.confirmPassword && (
              <Text className="text-red-600">
                {'Confirm password must match password'}
              </Text>
            )}
          </View>
        </View>

        {/* Button */}
        <View className="mt-10 mb-10">
          <Button
            title="Sign Up"
            onPress={(Keyboard.dismiss(), handleSubmit(submit))}
          />
        </View>

        {/* Sign Up */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignIn');
          }}>
          <Text className="text-lg font-normal text-gray text-center">
            {'Already have an account? '}
            <Text className="font-semibold text-primary">{'Sign In'}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.PrimaryBlack,
    borderRadius: 5,
    height: 55,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});
