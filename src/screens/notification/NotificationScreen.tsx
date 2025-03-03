import {View, Text} from 'react-native';
import React from 'react';
import AppHeader from '../../components/AppHeader';
import {Screen} from '../../navigation/RootNavigation';

export const NotificationScreen: Screen<'Notification'> = () => {
  return (
    <View>
      <AppHeader back={true} title="Notifications" />
      <View className="my-3 flex-row space-x-3">
        <Text className="text-base">Title</Text>
      </View>
      <View className="flex-row space-x-3">
        <Text className="text-base">Body</Text>
      </View>
    </View>
  );
};
