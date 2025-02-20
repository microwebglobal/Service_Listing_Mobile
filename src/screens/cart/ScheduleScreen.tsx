import {
  Text,
  Dimensions,
  ScrollView,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {Button} from '../../components/rneui';
import {Calendar} from 'react-native-calendars';
import {useCallback, useState} from 'react';
import {Colors} from '../../utils/Colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Arrow from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {Input} from '@rneui/themed';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {Controller, useForm} from 'react-hook-form';
import InputField from '../../components/InputFeild';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AppHeader from '../../components/AppHeader';
import {useAppSelector} from '../../redux';
import {useDispatch} from 'react-redux';
import {instance} from '../../api/instance';
import {clearCart} from '../../redux/cart/cart.slice';

interface ServiceForm {
  date: string;
  timeSlot: string;
  address: string;
  note: string;
}

interface BookingPayload {
  cityId: string;
  items: Array<any>;
  bookingDate: string;
  startTime: string;
  serviceAddress: string;
  serviceLocation: any;
  customerNotes: string;
}

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

export const ScheduleScreen: Screen<'ServiceSchedule'> = () => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const today = new Date();
  const todayDate = today.toISOString().split('T')[0];
  const [loading, setLoading] = useState<boolean>(false);
  const [timeValue, onChangeTimeValue] = useState<string>('Choose a time');
  const [selectDate, setSelectDate] = useState<string>(todayDate);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ServiceForm>();
  const cart = useAppSelector((state: any) => state.cart.cart);

  //time picker
  const [date, setDate] = useState(new Date(1598051730000));
  const [show, setShow] = useState<boolean>(false);
  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    onChangeTimeValue(currentDate.toLocaleTimeString());
  };

  const submit = useCallback(
    async (data: ServiceForm) => {
      let formatTime = timeValue.replace('AM', '').replace('PM', '').split(':');
      const payload: BookingPayload = {
        cityId: 'CTY002',
        items: [...cart],
        bookingDate: selectDate,
        startTime: formatTime[0] + ':' + formatTime[1],
        serviceAddress: data.address,
        serviceLocation: '',
        customerNotes: data.note,
      };
      setLoading(true);
      await instance
        .post('cart/add', payload)
        .then(res => {
          res.status === 200 &&
            (dispatch(clearCart()), navigation.navigate('Cart'));
        })
        .catch(function (e) {
          console.log(e.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [cart, dispatch, navigation, selectDate, timeValue],
  );

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <AppHeader back={true} title="Schedule Your Service" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar component */}
        <View className="mb-8">
          <Calendar
            theme={{
              dayTextColor: Colors.Black,
              todayTextColor: Colors.Primary,
              textDisabledColor: Colors.Gray,
              selectedDayTextColor: Colors.White,
              textSectionTitleColor: Colors.Black,
              selectedDayBackgroundColor: Colors.Black,
            }}
            onDayPress={(day: any) => {
              setSelectDate(day.dateString);
            }}
            markedDates={{
              [selectDate]: {
                selected: true,
                disableTouchEvent: true,
              },
            }}
            markingType="custom"
            renderArrow={(direction: string) =>
              direction === 'right' ? (
                <Arrow
                  name="keyboard-arrow-right"
                  size={30}
                  color={Colors.Black}
                />
              ) : (
                <Arrow
                  name="keyboard-arrow-left"
                  size={30}
                  color={Colors.Black}
                />
              )
            }
            firstDay={1}
            minDate={todayDate}
            enableSwipeMonths={true}
            disableAllTouchEventsForDisabledDays={true}
            headerStyle={{color: Colors.White}}
          />
        </View>

        {/* Service Details Form */}
        <View style={{marginHorizontal: RPW(6)}}>
          <View className="gap-5 mb-3">
            <View>
              <View className="flex-row space-x-2 items-baseline">
                <Icon name="clock" size={18} color={Colors.Primary} />
                <Text className="mb-2 text-base text-black font-medium first-letter:capitalize">
                  {'Select time slot'}
                </Text>
              </View>

              <Controller
                name="timeSlot"
                control={control}
                render={({field: {value}}) => (
                  <View>
                    <TouchableOpacity onPress={() => setShow(true)}>
                      {/* <StyledInput
                        className="border-2 border-dark rounded-md h-12 px-3 text-base text-black"
                        value={timeValue}
                        disabled
                        onFocus={() => {
                          setIsFocused(true);
                        }}
                      /> */}
                      <Input value={timeValue} disabled />
                    </TouchableOpacity>
                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={'time'}
                        is24Hour={true}
                        display="spinner"
                        minuteInterval={30}
                        onChange={onChangeDate}
                        positiveButton={{
                          label: 'OK',
                          textColor: Colors.Primary,
                        }}
                      />
                    )}
                  </View>
                )}
                // rules={{required: true}}
              />
              {parseInt(timeValue.split(':')[0], 10) < 11 && (
                <Text className="text-error">
                  {'Please select a time between 11:00 AM and 8:30 PM.'}
                </Text>
              )}
            </View>

            <View>
              <View className="flex-row items-baseline space-x-2">
                <SimpleLineIcons
                  name="location-pin"
                  size={18}
                  color={Colors.Primary}
                />
                <Text className="mb-2 text-base text-black font-medium">
                  Service Address
                </Text>
              </View>

              <Controller
                name="address"
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputField
                    placeHolder={'Enter complete service address'}
                    value={value}
                    secure={false}
                    inputMode={'text'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
                rules={{required: true}}
              />
              {errors.address && (
                <Text className="text-error">
                  {'Please fill out this field.'}
                </Text>
              )}
            </View>

            <View>
              <View className="flex-row items-center space-x-2">
                <Feather
                  name="message-square"
                  size={18}
                  color={Colors.Primary}
                />
                <Text className="mb-2 text-base text-black font-medium">
                  Special Instructions
                </Text>
              </View>

              <Controller
                name="note"
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputField
                    placeHolder={
                      'Any special instructions for the service provider...'
                    }
                    value={value}
                    secure={false}
                    multiline={true}
                    inputMode={'text'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>

          <View className="my-5">
            <Button
              primary
              title={'Confirm Booking'}
              loading={loading}
              onPress={(Keyboard.dismiss(), handleSubmit(submit))}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
