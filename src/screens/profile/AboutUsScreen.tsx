import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {Colors} from '../../utils/Colors';
import AppHeader from '../../components/AppHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const AboutUsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="About Us" />
      <ScrollView style={{paddingHorizontal: RPW(5)}}>
        <Text className="my-5 text-xl font-medium text-primary text-center">
          QProz
        </Text>
        <View className="">
          <Text className="text-base text-black text-justify">
            Your trusted partner for seamless and efficient solutions. We
            specialize in delivering high-quality services tailored to your
            needs.
          </Text>
        </View>

        <View className="mt-5">
          <View className="my-2 flex-row items-center space-x-3">
            <Text className="text-base text-black font-medium">
              Support Customer
            </Text>
            <Text className="text-base text-primary">0114765334</Text>
          </View>
          <View className="my-2 flex-row items-center space-x-3">
            <Text className="text-base text-black font-medium">Website</Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://qp.microwebstudios.com/')
              }>
              <Text className="text-base text-primary">
                https://qp.microwebstudios.com
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="my-5">
          <Text className="text-base text-black text-justify">
            Your trusted partner for seamless and efficient solutions. We
            specialize in delivering high-quality services tailored to your
            needs.
          </Text>
        </View>

        <View className="my-3 flex-row items-center space-x-3">
          <Text className="text-dark text-base font-medium">Follow Us</Text>
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity onPress={() => {}}>
              <MaterialCommunityIcons
                name="facebook"
                size={25}
                color={Colors.Dark}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <MaterialCommunityIcons
                name="linkedin"
                size={25}
                color={Colors.Dark}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
