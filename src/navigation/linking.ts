import {Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

export interface RemoteMessage {
  collapseKey: string;
  data: {navigationId: string};
  from: string;
  messageId: string;
  notification: {android: {}; body: string; title: string};
  originalPriority: number;
  priority: number;
  sentTime: number;
  ttl: number;
}

const config = {
  screens: {
    Splash: 'splash',
    SignUp: 'signup',
    SignIn: 'signin',
    SelectedItems: 'cart',
    Notification: 'notification',
    CustomerTabsNavigator: {
      screens: {
        HomeTab: {
          screens: {
            Home: 'home',
          },
        },
        CategoryTab: {
          screens: {
            Category: 'services',
            SubCategory: 'services/subcategory',
            ServiceType: 'services/service-type',
          },
        },
        Ticket: 'ticket',
        BookingTab: {
          screens: {
            Booking: 'booking',
            BookingDetails: 'booking/details',
          },
        },
        ProfileTab: {
          screens: {
            Profile: 'profile',
            EditProfile: 'profile/edit',
          },
        },
      },
    },
  },
};

const NAVIGATION_IDS = ['notification', 'booking', 'category', 'profile'];

function buildDeepLinkFromNotificationData(data = {} as RemoteMessage['data']) {
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.log('Unverified navigationId', navigationId);
    return null;
  }
  if (navigationId === 'category') {
    return 'https://qp-microwebstudios-com/services';
  } else if (navigationId === 'booking') {
    return 'https://qp-microwebstudios-com/booking';
  } else if (navigationId === 'profile') {
    return 'https://qp-microwebstudios-com/profile';
  } else {
    return 'https://qp-microwebstudios-com/notification';
  }
}

const linking: any = {
  prefixes: ['https://qp-microwebstudios-com'],
  config,

  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    // When the application is opened from a quit state.
    const message: any = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },

  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

    // When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(
      (remoteMessage: any) => {
        const url = buildDeepLinkFromNotificationData(remoteMessage.data);
        if (typeof url === 'string') {
          listener(url);
        }
      },
    );

    // When the application is running, local notification.
    const localUnsubscribe = messaging().onMessage(
      async (remoteMessage: any) => {
        PushNotification.configure({
          onNotification: function (notification) {
            if (notification.userInteraction) {
              const url = buildDeepLinkFromNotificationData(remoteMessage.data);
              if (typeof url === 'string') {
                listener(url);
              }
            }
            notification.finish(PushNotificationIOS.FetchResult.NoData);
          },
        });
      },
    );

    return () => {
      linkingSubscription.remove();
      unsubscribe();
      localUnsubscribe();
    };
  },
};

export default linking;
