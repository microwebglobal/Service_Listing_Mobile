import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import AppHeader from '../../components/AppHeader';
import {Colors} from '../../utils/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from '../../components/rneui';
import {instance} from '../../api/instance';
import {CheckBox} from '@rneui/themed';
import {useNav} from '../../navigation/RootNavigation';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const PaymentScreen = ({route}: any) => {
  const {amount, bookingId} = route.params;
  const navigation = useNav();
  const paymentMethods = ['online', 'cash'];
//   const [paymentMethod, setPaymentMethod] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedIndex, setIndex] = useState(1);

  const submit = useCallback(async () => {
    setLoading(true);
    await instance
      .post(`/booking/${bookingId}/complete-cash-payment`)
      .then(res => {
        console.log(res.data.message);
        navigation.navigate('Tab');
      })
      .catch(function (e) {
        console.log(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [bookingId, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-grow" showsVerticalScrollIndicator={false}>
        <AppHeader back={true} title={'Payment'} />
        <View className="flex-1 my-5" style={{marginHorizontal: RPW(6)}}>
          <Text className="text-xl text-center font-semibold text-black first-letter:capitalize">
            {'Choose payment method'}
          </Text>

          <View className="mt-10 mb-5 p-3 flex-row bg-lightGrey rounded-lg">
            <Text className="text-base text-black first-letter:capitalize">
              {'Total amount: '}
            </Text>
            <Text className="text-base text-black font-bold">
              {' ₹'}
              {amount}
            </Text>
          </View>

          {paymentMethods.map((method: string, index: number) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                //   setPaymentMethod(method);
                  setIndex(index);
                }}>
                <View className="flex-row border-0 rounded-lg items-center">
                  <CheckBox
                    checked={selectedIndex === index}
                    onPress={() => setIndex(index)}
                    checkedColor={Colors.Primary}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                  />
                  {index === 0 ? (
                    <MaterialCommunityIcons
                      name="credit-card-outline"
                      size={30}
                      color={Colors.Dark}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="wallet-outline"
                      size={30}
                      color={Colors.Dark}
                    />
                  )}
                  <Text className="ml-3 text-base text-black">
                    {'Pay '}
                    {method === 'cash' ? 'with ' : ''}
                    <Text className="first-letter:capitalize">{method}</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {selectedIndex === 1 && (
            <View className="p-3 border rounded-lg">
              <Text className="text-base text-black">
                Payment will be collected in cash after service completion
              </Text>
            </View>
          )}

          <View className="my-8">
            <Button
              loading={loading}
              primary
              title="Confirm cash payment"
              onPress={() => {
                submit();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
