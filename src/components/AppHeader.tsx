import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../utils/Colors';

interface AppHeaderProps {
  back: boolean;
  title?: string;
}

const AppHeader = ({back, title}: AppHeaderProps) => {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center py-5 bg-white">
      <View className="basis-1/6 items-center">
        {back && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back-ios-new"
              size={24}
              color={Colors.Black}
            />
          </TouchableOpacity>
        )}
      </View>
      {title && (
        <View className="basis-2/3 items-center">
          <Text className="text-xl text-dark font-medium">{title}</Text>
        </View>
      )}
      <View className="basis-1/6 items-center" />
    </View>
  );
};

export default AppHeader;
