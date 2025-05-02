import {
  View,
  Text,
  FlatList,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {styled} from 'nativewind';
import React, {useCallback, useState} from 'react';
import classNames from 'classnames';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {Screen} from '../../navigation/RootNavigation';
import {useFocusEffect} from '@react-navigation/native';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';

interface Notification {
  notification_id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  created_at: string;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};
const RPH = (percentage: number) => {
  return (percentage / 100) * screenHeight;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledFlatList = styled(FlatList);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const NotificationScreen: Screen<'Notification'> = () => {
  const today = new Date();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  let notificationTime: string[] = [];

  const fetchNotifications = async () => {
    await instance
      .get('/notification')
      .then(response => {
        setNotifications(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const markAsRead = async (notificationId: number) => {
    await instance.put(`/notification/${notificationId}/read`, {}).then(() => {
      fetchNotifications();
    });
  };

  const deleteNotification = async (notificationId: number) => {
    await instance.delete(`/notification/${notificationId}`, {}).then(() => {
      fetchNotifications();
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, []),
  );

  const checkNotificationTime = (date: Date) => {
    let result = '';
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const differenceInTime = today.getTime() - date.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    if (date.toDateString() === today.toDateString()) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
      return formattedTime;
    } else if (date.toDateString() === yesterday.toDateString()) {
      result =
        'Yesterday' +
        ' . ' +
        date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
    } else if (differenceInDays < 7) {
      result =
        date.toLocaleDateString('en-US', {
          weekday: 'long',
        }) +
        ' . ' +
        date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
    } else {
      result = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }

    if (!notificationTime.includes(result)) {
      notificationTime.push(result);
    }
    return result;
  };

  const _renderNotification = ({item}: any) => {
    // render right swipe action
    const renderActions = () => (
      <StyledView className="bg-error w-10 items-center justify-center rounded-lg">
        <StyledTouchableOpacity
          onPress={() => deleteNotification(item.notification_id)}>
          <MaterialIcons name="delete-outline" size={25} color={Colors.White} />
        </StyledTouchableOpacity>
      </StyledView>
    );

    return (
      <Swipeable renderRightActions={renderActions}>
        <StyledView className="p-2 rounded-lg bg-white">
          <StyledView className="items-center justify-between mt-2 mb-4">
            <StyledText className="text-sm font-PoppinsMedium text-slate-400">
              {checkNotificationTime(new Date(item.created_at))}
            </StyledText>
          </StyledView>

          <StyledTouchableOpacity
            className="bg-white rounded-lg shadow-sm shadow-black"
            onPress={() => {
              markAsRead(item.notification_id);
            }}>
            <StyledView className="p-3">
              <StyledText
                className={classNames({
                  'text-base font-PoppinsMedium text-black': !item.isRead,
                  'text-base font-PoppinsMedium text-black opacity-50':
                    item.isRead,
                })}>
                {item.title}
              </StyledText>
              <StyledText
                className={classNames({
                  'mt-1 text-sm font-PoppinsRegular text-black': !item.isRead,
                  'mt-1 text-sm font-PoppinsRegular text-black opacity-50':
                    item.isRead,
                })}>
                {item.message}
              </StyledText>
            </StyledView>
          </StyledTouchableOpacity>
        </StyledView>
      </Swipeable>
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <AppHeader back={true} title="Notifications" />
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: RPW(1)}}>
        {notifications.length > 0 ? (
          <StyledView className="mb-5">
            <GestureHandlerRootView>
              <StyledFlatList
                horizontal={false}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                data={notifications}
                keyExtractor={(item: any) => item.notification_id.toString()}
                renderItem={({item}) => _renderNotification({item})}
              />
            </GestureHandlerRootView>
          </StyledView>
        ) : (
          <StyledView
            className="flex-1 justify-center items-center"
            style={{height: RPH(70)}}>
            <StyledText className="mt-2 text-sm text-dark text-center font-PoppinsRegular">
              No notifications available
            </StyledText>
          </StyledView>
        )}
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
