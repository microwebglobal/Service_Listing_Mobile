import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '../utils/Colors';
import {useAppSelector} from '../redux';
import {useNav} from '../navigation/RootNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface AppHeaderProps {
  back: boolean;
  title?: string;
  cartVisible?: boolean;
}

const AppHeader = ({back, title, cartVisible}: AppHeaderProps) => {
  const navigation = useNav();
  const localCart = useAppSelector(state => state.cart.cart) || [];

  return (
    <View className="flex-row items-center py-5 bg-white shadow-sm shadow-black">
      <View className="basis-1/6 items-center">
        {back && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back-ios-new"
              size={20}
              color={Colors.Black}
            />
          </TouchableOpacity>
        )}
      </View>
      {title && (
        <View className="basis-2/3 items-center">
          <Text className="text-lg text-black font-medium">{title}</Text>
        </View>
      )}
      <View className="basis-1/6 items-center">
        {cartVisible && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SelectedItems');
            }}>
            <View>
              {localCart?.length > 0 && (
                <View className="z-10 bg-primary w-5 h-5 rounded-full items-center justify-center absolute -top-2 -right-2">
                  <Text className="text-sm text-white font-normal">
                    {localCart?.length}
                  </Text>
                </View>
              )}

              <Ionicons name={'cart-outline'} size={26} color={Colors.Black} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AppHeader;
