import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Image,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useNav} from '../../navigation/RootNavigation';
import {Colors} from '../../utils/Colors';
import {Button} from '../../components/rneui';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import {useFocusEffect} from '@react-navigation/native';

interface SignUpData {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  mobile: string;
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

export const SignUpScreen = () => {
  const navigation = useNav();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageURI, setImageURI] = useState<string>('');
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignUpData>();

  const submit = (data: SignUpData) => {
    // save form data into storage

    setLoading(false);
    Alert.alert('Form Data', JSON.stringify(data));
    navigation.navigate('SelectLocation');
  };

  //   const takePhotoFromCamera = async () => {
  //     ImagePicker.openCamera({
  //       width: 300,
  //       height: 400,
  //       cropping: true,
  //     }).then(image => {
  //       setImageURI(image.path);
  //     });
  //   };

  const choosePhotoFromGallery = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImageURI(image.path);
    });
  };

  // Back handler function
  const handlerBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  useFocusEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handlerBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handlerBackPress);
    };
  });

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: RPW(8),
          marginTop: RPH(5),
        }}>
        {/* Image selection */}
        <View className="mt-3 items-center justify-center">
          {imageURI?.length > 0 ? (
            <Image
              source={{uri: imageURI}}
              className="w-28 h-28 rounded-full"
            />
          ) : (
            <View className="w-28 h-28 rounded-full bg-primary items-center justify-center">
              <FontAwesome name="user-o" size={40} color={Colors.White} />
            </View>
          )}
          <TouchableOpacity
            className="p-2.5 bg-primary rounded-full relative left-8 -top-10 border-4 border-white"
            onPress={choosePhotoFromGallery}>
            <Feather name="camera" size={18} color={Colors.White} />
          </TouchableOpacity>
        </View>

        <View className="mb-8 items-center">
          <Text className="text-2xl font-medium text-black">
            Let's Set You Up!
          </Text>
          <Text className="mt-3 text-base font-medium text-dark">
            Sign Up To Continue
          </Text>
        </View>

        {/* User Details Form */}
        <View className="gap-5 mb-3">
          <View>
            <Controller
              name="fullName"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  placeholder="Full Name"
                  style={styles.input}
                  value={value}
                  inputMode="text"
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
            {errors.fullName && (
              <Text className="text-error">{'Full name is required'}</Text>
            )}
          </View>

          <View>
            <Controller
              name="userName"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  placeholder="User Name"
                  style={styles.input}
                  value={value}
                  inputMode="text"
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
            {errors.fullName && (
              <Text className="text-error">{'User name is required'}</Text>
            )}
          </View>

          <View>
            <Controller
              name="email"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={value}
                  inputMode="email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true}}
            />
            {errors.fullName && (
              <Text className="text-error">
                {'Please enter valid email address'}
              </Text>
            )}
          </View>

          <View>
            <Controller
              name="password"
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  placeholder="Password"
                  secureTextEntry={true}
                  style={styles.input}
                  value={value}
                  inputMode="text"
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
              rules={{required: true, minLength: 8, maxLength: 15}}
            />
            {errors.password && (
              <Text className="text-error">
                {'Password must be between 8 to 15 characters'}
              </Text>
            )}
          </View>

          <View>
            <Controller
              name="mobile"
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
            {errors.fullName && (
              <Text className="text-error">
                {'Please enter valid mobile number'}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          marginHorizontal: RPW(8),
          marginBottom: RPH(3),
        }}>
        {/* Button */}
        <View className="my-5">
          <Button
            loading={loading}
            title={'Continue'}
            onPress={(Keyboard.dismiss(), handleSubmit(submit))}
            primary
          />
        </View>

        <View className="flex-row justify-center">
          <Text className="text-base font-normal text-dark">
            Already have an account?{'  '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignIn');
            }}>
            <Text className="text-base font-medium text-primary underline">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
