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
import {useNav} from '../../navigation/RootNavigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {styled} from 'nativewind';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

interface sectionItemProps {
  title: string;
  edit: boolean;
  onPress: () => void;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const AboutUsScreen = () => {
  const navigation = useNav();

  const sectionItem = (data: sectionItemProps) => {
    return (
      <StyledView className="border-t border-lightGrey">
        <StyledTouchableOpacity
          onPress={() => {
            data.onPress();
          }}>
          <StyledView className="flex-row my-3 items-center justify-between">
            <StyledText className="text-dark text-base font-PoppinsMedium">
              {data.title}
            </StyledText>
            {data.edit && (
              <StyledView className="-mr-2">
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={Colors.Gray}
                />
              </StyledView>
            )}
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    );
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="About Us" />
      <StyledScrollView style={{paddingHorizontal: RPW(5)}}>
        <StyledText className="my-5 text-xl font-PoppinsMedium text-primary text-center">
          QProz
        </StyledText>
        <StyledView className="">
          <StyledText className="text-sm text-black text-justify font-PoppinsRegular">
            Your trusted partner for seamless and efficient solutions. We
            specialize in delivering high-quality services tailored to your
            needs.
          </StyledText>
        </StyledView>

        <StyledView className="mt-5">
          <StyledView className="my-2 flex-row items-center space-x-3">
            <StyledText className="text-sm text-black font-PoppinsMedium">
              Support Customer
            </StyledText>
            <StyledText className="text-sm text-primary font-PoppinsRegular">
              0114765334
            </StyledText>
          </StyledView>
          <StyledView className="my-2 flex-row items-center space-x-3">
            <StyledText className="text-sm text-black font-PoppinsMedium">
              Website
            </StyledText>
            <StyledTouchableOpacity
              onPress={() =>
                Linking.openURL('https://qp.microwebstudios.com/')
              }>
              <StyledText className="text-sm text-primary font-PoppinsRegular">
                https://qp.microwebstudios.com
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        <StyledView className="my-5">
          <StyledText className="text-sm text-black text-justify font-PoppinsRegular">
            Your trusted partner for seamless and efficient solutions. We
            specialize in delivering high-quality services tailored to your
            needs.
          </StyledText>
        </StyledView>

        {sectionItem({
          title: 'Terms & Conditions',
          edit: true,
          onPress: () => {
            navigation.navigate('Terms');
          },
        })}
        {sectionItem({
          title: 'Privacy Policy',
          edit: true,
          onPress: () => {
            navigation.navigate('Terms');
          },
        })}

        <StyledView className="py-3 flex-row items-center space-x-3 border-t border-lightGrey">
          <StyledText className="text-dark text-base font-PoppinsMedium">
            Follow Us
          </StyledText>
          <StyledView className="flex-row items-center space-x-3">
            <StyledTouchableOpacity onPress={() => {}}>
              <MaterialCommunityIcons
                name="facebook"
                size={25}
                color={Colors.Dark}
              />
            </StyledTouchableOpacity>

            <StyledTouchableOpacity>
              <MaterialCommunityIcons
                name="linkedin"
                size={25}
                color={Colors.Dark}
              />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
