import {RootStackParamList, Screen, useNav} from '../../navigation/RootNavigation';
import {Dimensions, KeyboardAvoidingView, ScrollView, View} from 'react-native';
import React, {useEffect} from 'react';
import LottieView from 'lottie-react-native';
import { StackActions } from '@react-navigation/native';

export interface RemoteMessage {
  collapseKey: string;
  data: {screen: string};
  from: string;
  messageId: string;
  notification: {android: {}; body: string; title: string};
  originalPriority: number;
  priority: number;
  sentTime: number;
  ttl: number;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

export const NotificationHandler: Screen<'NotificationHandler'> = ({route}) => {
  const {remoteMessage} = route.params;
  const navigation = useNav();

  useEffect(() => {
    const handleToken = () => {
      setTimeout(() => {
        navigation.dispatch(StackActions.pop(1));
        navigateToScreen(remoteMessage.data.screen as keyof RootStackParamList);
      }, 1500);
    };

    handleToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, remoteMessage]);

  const navigateToScreen = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen as any);
    switch (screen) {
      case 'Category': {
        navigation.navigate('TabsNavigator', {screen: 'CategoryTab'});
        break;
      }
      case 'Booking': {
        navigation.navigate('TabsNavigator', {screen: 'BookingTab'});
        break;
      }
      case 'Profile': {
        navigation.navigate('TabsNavigator', {screen: 'ProfileTab'});
        break;
      }
      default: {
        navigation.navigate('Notification');
      }
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        className="flex bg-white">
        <View className="flex items-center justify-center h-screen ">
          <LottieView
            source={require('../../assets/animations/loading.json')}
            autoPlay
            loop
            style={{width: RPW(60), height: RPH(60)}}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
