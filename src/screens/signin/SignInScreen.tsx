import {
  Text,
  View,
  Image,
  Keyboard,
  Dimensions,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {API_BASE} from '@env';
import {styled} from 'nativewind';
import {Button} from '../../components/rneui';
import {Controller, useForm} from 'react-hook-form';
import InputField from '../../components/InputFeild';
import {useNav} from '../../navigation/RootNavigation';

interface SignInData {
  phone: string;
}

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
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

export const SignInScreen = () => {
  const navigation = useNav();
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
      .then(() => {
        navigation.navigate('Verification', {phone: data.phone});
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView>
        <StyledScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginHorizontal: RPW(5),
            paddingTop: RPH(12),
          }}>
          <StyledView className="items-center justify-center">
            <StyledImage
              source={require('../../assets/app-images/logo.png')}
              className="w-32 h-32 rounded-full"
            />
          </StyledView>
          <StyledView className="my-10 items-center">
            <StyledText className="text-xl font-PoppinsRegular text-black">
              {'Welcome! to'}
              <StyledText className="text-xl font-PoppinsSemiBold text-primary">
                {' Customer'}
              </StyledText>
            </StyledText>
          </StyledView>

          <StyledView className="gap-2 mb-3">
            <StyledView>
              <StyledText className="text-sm text-black font-PoppinsRegular">
                Contact Number to Register or Login
              </StyledText>
            </StyledView>
            <StyledView>
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
                <StyledText className="text-error">
                  {'Please enter valid mobile number'}
                </StyledText>
              )}
            </StyledView>
          </StyledView>

          <StyledView className="my-5">
            <Button
              loading={loading}
              title={'Send OTP'}
              onPress={(Keyboard.dismiss(), handleSubmit(submit))}
              primary
            />
          </StyledView>
        </StyledScrollView>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};
