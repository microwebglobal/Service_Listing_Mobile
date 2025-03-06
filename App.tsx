import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './src/navigation/RootNavigator';
import {ButtonProps, createTheme, ThemeProvider} from '@rneui/themed';
import {Platform, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {Colors} from './src/utils/Colors';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';

export const FONT_FAMILY = 'Poppins';

const checkPermission = () => {
  messaging()
    .hasPermission()
    .then(enabled => {
      if (enabled) {
        getToken();
      } else {
        requestPermission();
      }
    })
    .catch(error => {
      console.log('error checking permissions ' + error);
    });
};

async function requestPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getToken();
  } else {
    console.log('permission rejected');
  }
}

const getToken = async () => {
  await messaging().getToken();
};

const handleNotification = async () => {
  messaging().onMessage(async remoteMessage => {
    PushNotification.createChannel(
      {
        channelId: 'channel-id',
        channelName: 'My channel',
        channelDescription: 'A channel to categories your notifications',
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      created => console.log(`createChannel returned '${created}'`),
    );

    PushNotification.localNotification({
      channelId: 'channel-id',
      title: remoteMessage.notification?.title,
      message: remoteMessage.notification?.body ?? '',
    });
  });
};

const theme = createTheme({
  lightColors: {
    primary: '#5f60b9',
    secondary: '#263446',
    grey0: '#788AA5',
    white: '#FFFFFF',
    black: '#000000',
    error: '#C62B3B',
  },
  darkColors: {
    primary: '#5f60b9',
    secondary: '#263446',
    grey0: '#788AA5',
    white: '#FFFFFF',
    black: '#000000',
    error: '#C62B3B',
  },
  mode: 'light',
  components: {
    Button: (
      props: ButtonProps & {
        primary?: boolean;
        secondary?: boolean;
        error?: boolean;
        black?: boolean;
        default?: boolean;
      },
      themeColor,
    ) => ({
      capitalize: true,
      titleStyle: {
        paddingHorizontal: 5,
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
        lineHeight: props.size === 'md' ? 25 : props.size === 'sm' ? 22 : 30,
        color:
          props.primary || props.black
            ? themeColor.colors.white
            : props.default
            ? themeColor.colors.primary
            : props.error
            ? themeColor.colors.white
            : themeColor.colors.primary,
        fontSize: props.size === 'sm' ? 14 : 18,
        marginTop: Platform.OS === 'ios' ? 3 : 0,
      },
      buttonStyle: {
        borderRadius: props.size === 'sm' ? 8 : 10,
        borderWidth: props.primary || props.secondary ? 0 : 1,
        borderColor: props.black
          ? themeColor.colors.black
          : themeColor.colors.primary,
        backgroundColor: props.primary
          ? themeColor.colors.primary
          : props.error
          ? themeColor.colors.error
          : props.black
          ? themeColor.colors.black
          : themeColor.colors.white,
      },
    }),
  },
});

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      className="bg-white border-l-4 border-green-500"
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      className="bg-white border-l-4 border-red-500"
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
    />
  ),
};

function App(): React.JSX.Element {
  useEffect(() => {
    checkPermission();
    handleNotification();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView>
          <ThemeProvider theme={theme}>
            <SafeAreaProvider>
              <RootNavigator />
              <Toast config={toastConfig} position="top" topOffset={60} />
            </SafeAreaProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  text1Style: {
    fontSize: 16,
    fontWeight: 'semibold',
  },
  text2Style: {
    fontSize: 14,
    color: Colors.Dark,
    fontWeight: 'normal',
  },
});

export default App;
