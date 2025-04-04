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
import {styled} from 'nativewind';

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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

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
    <StyledSafeAreaView className="flex-1 bg-white">
      <AppHeader title="Your Account" back={true} />
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: RPW(6)}}>
        <StyledView className="mt-10">
          {itemName === 'Full Name' && (
            <StyledView>
              <StyledText className="text-3xl text-black font-PoppinsMedium">
                {itemName}
              </StyledText>
              <StyledText className="mt-5 text-base text-black text-clip font-PoppinsRegular">
                This is the name you would like other people to use when
                referring to you
              </StyledText>
              <StyledView className="mt-8 mb-3 space-y-4">
                <StyledView>
                  <StyledText className="mb-2 text-base text-black font-PoppinsMedium">
                    First Name
                  </StyledText>
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
                    <StyledText className="text-error font-PoppinsRegular">
                      {'First name is required'}
                    </StyledText>
                  )}
                </StyledView>

                <StyledView>
                  <StyledText className="mb-2 text-base text-black font-PoppinsMedium">
                    Last Name
                  </StyledText>
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
                    <StyledText className="text-error font-PoppinsRegular">
                      {'Last name is required'}
                    </StyledText>
                  )}
                </StyledView>
              </StyledView>
            </StyledView>
          )}
        </StyledView>
        {/*  */}
        <StyledView>
          {itemName === 'Email' && (
            <StyledView>
              <StyledText className="text-3xl text-black font-PoppinsMedium">
                {itemName}
              </StyledText>
              <StyledText className="mt-5 text-base text-black text-clip font-PoppinsRegular">
                You'll use this email to receive messages, sign in, and recover
                your account.
              </StyledText>

              <StyledView className="mt-8 mb-2">
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
                  <StyledText className="text-error font-PoppinsRegular">
                    {'Please enter valid email address'}
                  </StyledText>
                )}
              </StyledView>

              <StyledText className="text-sm text-black font-PoppinsRegular">
                A verification code to be sent to this email.
              </StyledText>
            </StyledView>
          )}
        </StyledView>

        <StyledView>
          {itemName === 'Mobile' && (
            <StyledView>
              <StyledText className="text-3xl text-black font-PoppinsMedium">
                {itemName}
              </StyledText>
              <StyledText className="mt-5 text-base text-black text-clip font-PoppinsRegular">
                You'll use this email to get notifications, sign in, and recover
                your account.
              </StyledText>

              <StyledView className="mt-8 mb-2">
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
                  <StyledText className="text-error font-PoppinsRegular">
                    {'Please enter valid mobile number'}
                  </StyledText>
                )}
              </StyledView>

              <StyledText className="text-sm text-black font-PoppinsRegular">
                A verification code to be sent to this number.
              </StyledText>
            </StyledView>
          )}
        </StyledView>

        <StyledView className="mt-20 mb-5">
          <Button
            loading={loading}
            title={'Update Now'}
            onPress={(Keyboard.dismiss(), handleSubmit(submit))}
            primary
          />
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
