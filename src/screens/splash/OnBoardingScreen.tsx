import React from 'react';
import {Dimensions, StyleSheet, Image, View} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {useNav} from '../../navigation/RootNavigation';
import {Colors} from '../../utils/Colors';
import classNames from 'classnames';
import {FONT_FAMILY} from '../../../App';
import {Button} from '@rneui/themed';

// Get screen dimension
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// RPH ans RPW are functions to set responsive width and height
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const backgroundColor = (isLight: boolean) =>
  isLight ? Colors.Primary : Colors.White;
const color = (isLight: boolean) => backgroundColor(!isLight);

const Done = ({isLight, ...props}: any) => (
  <Button
    title={'Done'}
    buttonStyle={{
      backgroundColor: backgroundColor(isLight),
    }}
    containerStyle={{
      marginHorizontal: RPW(10),
      width: RPW(23),
    }}
    titleStyle={{color: color(isLight)}}
    {...props}
  />
);

const Next = ({isLight, nextLabel, ...props}: any) => (
  <Button
    title={'Next'}
    buttonStyle={{
      backgroundColor: backgroundColor(isLight),
    }}
    containerStyle={{
      marginHorizontal: RPW(10),
      width: RPW(23),
    }}
    titleStyle={{color: color(isLight)}}
    {...props}>
    {nextLabel}
  </Button>
);

const Skip = ({skipLabel, ...props}: any) => (
  <Button
    title={'Skip'}
    // eslint-disable-next-line react-native/no-inline-styles
    buttonStyle={{
      borderWidth: 1,
      borderColor: Colors.Gray,
      backgroundColor: Colors.White,
    }}
    // eslint-disable-next-line react-native/no-inline-styles
    containerStyle={{
      marginHorizontal: RPW(10),
      width: RPW(23),
    }}
    titleStyle={{color: Colors.Gray}}
    {...props}>
    {skipLabel}
  </Button>
);

const Dots = ({selected}: any) => {
  return (
    <View
      className={classNames('h-2 w-2 mx-1 rounded-full bg-slate-400', {
        'bg-black': selected,
      })}
    />
  );
};

export const OnboardingScreen = () => {
  const navigation = useNav();

  return (
    <Onboarding
      onSkip={() => navigation.navigate('SignIn')}
      onDone={() => navigation.navigate('SignIn')}
      bottomBarColor={Colors.White}
      bottomBarHeight={RPH(15)}
      bottomBarHighlight={true}
      // Custom Components Properties
      DoneButtonComponent={Done}
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DotComponent={Dots}
      // Page Styles
      containerStyles={styles.ContainerStyle}
      //imageContainerStyles={styles.ImageContainerStyles}
      titleStyles={styles.TitleStyles}
      subTitleStyles={styles.SubTitleStyles}
      pages={[
        {
          backgroundColor: Colors.White,
          image: (
            <Image
              source={require('../../assets/app-images/onboarding-1.jpg')}
              style={styles.ImageStyles}
            />
          ),
          title: 'Find High Quality Service Providers Near You',
          subtitle:
            'Without leaving the comfort of your home you can discover and book services in your location..',
        },
        {
          backgroundColor: Colors.White,
          image: (
            <Image
              source={require('../../assets/app-images/onboarding-1.jpg')}
              style={styles.ImageStyles}
            />
          ),
          title: 'View Artisans profiles to see their works with ease',
          subtitle:
            'Are you a customer that loves to see the works of service providers for trust reason we have you covered...',
        },
        {
          backgroundColor: Colors.White,
          image: (
            <Image
              source={require('../../assets/app-images/onboarding-1.jpg')}
              style={styles.ImageStyles}
            />
          ),
          title:
            'Discover top-tier service providers in your area without lifting a finger',
          subtitle:
            'From the comfort of your home, find and book high-quality services tailored to your needs.',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  ContainerStyle: {
    flex: 1,
    paddingHorizontal: RPW(10),
    backgroundColor: Colors.White,
  },
  ImageStyles: {
    width: RPW(70),
    height: RPH(40),
    resizeMode: 'contain',
  },
  TitleStyles: {
    marginTop: -20,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
    color: Colors.Dark,
    fontFamily: FONT_FAMILY,
  },
  SubTitleStyles: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
    color: Colors.Dark,
    fontFamily: FONT_FAMILY,
  },
});
