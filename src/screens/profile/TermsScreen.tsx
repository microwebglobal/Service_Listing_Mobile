import {View, Text, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import React from 'react';
import AppHeader from '../../components/AppHeader';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const TermsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="Terms and Conditions" />
      <ScrollView
        className="flex-grow pt-5"
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: RPW(5)}}>
        <View>
          <Text className="text-sm text-black text-justify">
            {
              'Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern our relationship with you in relation to this website.'
            }
          </Text>
        </View>
        <View className="mt-5">
          <Text className="text-base text-black font-medium">
            1. Acceptance of Terms
          </Text>
          <Text className="mt-2 text-sm text-black text-justify">
            {
              'By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.'
            }
          </Text>
        </View>
        <View className="mt-5">
          <Text className="text-base text-black font-medium">
            2. Use of the Website
          </Text>
          <Text className="mt-2 text-sm text-black text-justify">
            {
              'The content of the pages of this website is for your general information and use only. It is subject to change without notice'
            }
          </Text>
        </View>
        <View className="mt-5">
          <Text className="text-base text-black font-medium">
            3. Intellectual Property
          </Text>
          <Text className="mt-2 text-sm text-black text-justify">
            {
              'This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.'
            }
          </Text>
        </View>
        <View>
          <Text className="text-base text-black font-medium">
            4. Limitation of Liability
          </Text>
          <Text className="mt-2 text-sm text-black text-justify">
            {
              'Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services, or information available through this website meet your specific requirements.'
            }
          </Text>
        </View>
        <View className="mt-5">
          <Text className="text-base text-black font-medium">
            5. Changes to Terms
          </Text>
          <Text className="mt-2 text-sm text-black text-justify">
            {
              'We reserve the right to modify these terms and conditions at any time. By using this website, you agree to be bound by the current version of these Terms and Conditions.'
            }
          </Text>
        </View>
        <View className="mt-5">
          <Text className="text-base text-black font-medium">
            6. Governing Law
          </Text>
          <Text className="mt-2 text-sm text-black text-justify">
            {
              'Your use of this website and any dispute arising out of such use is subject to the laws of your country or region.'
            }
          </Text>
        </View>
        <View className="mt-5 mb-20">
          <Text className="text-base text-black font-medium">
            7. Contact Us
          </Text>
          <Text className="mt-2 text-sm text-black text-justify">
            {
              'If you have any questions about these Terms and Conditions, please contact us at '
            }
            <Text className="text-sm text-primary">
              {'support@example.com.'}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
