import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

// switch off warnings for deprecated modules
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!');
});

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },

  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,

  // Specified if permissions (ios) and token (android and ios) will requested or not,
  // if not, you must call PushNotificationsHandler.requestPermissions() later
  requestPermissions: true,
});

AppRegistry.registerComponent(appName, () => App);
