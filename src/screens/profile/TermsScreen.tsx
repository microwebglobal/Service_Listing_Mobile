import {View, Text, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import React from 'react';
import AppHeader from '../../components/AppHeader';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const section = (title: string, paragraph: string) => {
  return (
    <View className="mt-5">
      <Text className="text-base text-black font-medium">{title}</Text>
      <Text className="mt-2 text-sm text-black text-justify">{paragraph}</Text>
    </View>
  );
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
        {section(
          '1. Acceptance of Terms',
          'By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.',
        )}
        {section(
          '2. Use of the Website',
          'The content of the pages of this website is for your general information and use only. It is subject to change without notice.',
        )}
        {section(
          '3. Intellectual Property',
          'This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.',
        )}
        {section(
          '4. Limitation of Liability',
          'Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services, or information available through this website meet your specific requirements.',
        )}
        {section(
          '5. Changes to Terms',
          'We reserve the right to modify these terms and conditions at any time. By using this website, you agree to be bound by the current version of these Terms and Conditions.',
        )}
        {section(
          '6. Governing Law',
          'Your use of this website and any dispute arising out of such use is subject to the laws of your country or region.',
        )}
        {section(
          '6. Governing Law',
          'Your use of this website and any dispute arising out of such use is subject to the laws of your country or region.',
        )}

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
