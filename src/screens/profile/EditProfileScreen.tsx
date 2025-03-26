import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import {Screen} from '../../navigation/RootNavigation';
import AppHeader from '../../components/AppHeader';
import {useForm, Controller} from 'react-hook-form';
import InputField from '../../components/InputFeild';
import {Button} from '../../components/rneui';
import {useNavigation} from '@react-navigation/native';
import {instance} from '../../api/instance';
import {useAppSelector} from '../../redux';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const EditProfileScreen: Screen<'EditProfile'> = ({route}) => {
  const {itemName} = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ProfileData>();
  const user = useAppSelector(state => state.user.user);

  const submit = async (data: ProfileData) => {
    try {
      const response =
        itemName === 'Full Name'
          ? await instance.put(`users/profile/${user?.id}`, {
              name: `${data.firstName} ${data.lastName}`,
            })
          : await instance.put('users/profile/7', data);
      if (response.status === 200) {
        navigation.goBack();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader title="Your Account" back={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: RPW(6)}}>
        {/*  */}
        <View className="mt-10">
          {itemName === 'Full Name' && (
            <View>
              <Text className="text-3xl text-black font-semibold">
                {itemName}
              </Text>
              <Text className="mt-5 text-base text-black text-clip">
                This is the name you would like other people to use when
                referring to you
              </Text>
              <View className="mt-8 mb-3 space-y-4">
                <View>
                  <Text className="mb-2 text-base text-black font-medium">
                    First Name
                  </Text>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <InputField
                        placeHolder={'First name'}
                        value={value}
                        secure={false}
                        inputMode={'text'}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    )}
                    rules={{required: true}}
                  />
                  {errors.firstName && (
                    <Text className="text-error">
                      {'First name is required'}
                    </Text>
                  )}
                </View>

                <View>
                  <Text className="mb-2 text-base text-black font-medium">
                    Last Name
                  </Text>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <InputField
                        placeHolder={'Last name'}
                        value={value}
                        secure={false}
                        inputMode={'text'}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    )}
                    rules={{required: true}}
                  />
                  {errors.lastName && (
                    <Text className="text-error">
                      {'Last name is required'}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
        {/*  */}
        <View>
          {itemName === 'Email' && (
            <View>
              <Text className="text-3xl text-black font-semibold">
                {itemName}
              </Text>
              <Text className="mt-5 text-base text-black text-clip">
                You'll use this email to receive messages, sign in, and recover
                your account.
              </Text>

              <View className="mt-8 mb-2">
                <Controller
                  name="email"
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <InputField
                      placeHolder={'Email'}
                      value={value}
                      secure={false}
                      inputMode={'email'}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  )}
                  rules={{required: true, pattern: /^\S+@\S+$/i}}
                />
                {errors.email && (
                  <Text className="text-error">
                    {'Please enter valid email address'}
                  </Text>
                )}
              </View>

              <Text className="text-sm text-black">
                A verification code to be sent to this email.
              </Text>
            </View>
          )}
        </View>
        {/*  */}
        <View>{itemName === 'Password' && <Text>{itemName}</Text>}</View>
        {/*  */}
        <View>
          {itemName === 'Mobile' && (
            <View>
              <Text className="text-3xl text-black font-semibold">
                {itemName}
              </Text>
              <Text className="mt-5 text-base text-black text-clip">
                You'll use this email to get notifications, sign in, and recover
                your account.
              </Text>

              <View className="mt-8 mb-2">
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

              <Text className="text-sm text-black">
                A verification code to be sent to this number.
              </Text>
            </View>
          )}
        </View>

        <View className="mt-20 mb-5">
          <Button
            loading={loading}
            title={'Update'}
            onPress={(Keyboard.dismiss(), handleSubmit(submit))}
            primary
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
