import {
  Text,
  View,
  Keyboard,
  TextInput,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useState} from 'react';
import React from 'react';
import {styled} from 'nativewind';
import {useDispatch} from 'react-redux';
import {Colors} from '../../utils/Colors';
import {useAppSelector} from '../../redux';
import {instance} from '../../api/instance';
import {Button} from '../../components/rneui';
import {Calendar} from 'react-native-calendars';
import AppHeader from '../../components/AppHeader';
import {Controller, useForm} from 'react-hook-form';
import InputField from '../../components/InputFeild';
import {clearCart} from '../../redux/cart/cart.slice';
import {StackActions} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Arrow from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '../../components/DateTimePicker';
import {Screen, useNav} from '../../navigation/RootNavigation';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

export const ScheduleScreen: Screen<'ServiceSchedule'> = ({route}) => {
  const navigation = useNav();
  const dispatch = useDispatch();
  const {address, date, time} = route.params;
  const today = new Date();
  const todayDate = today.toISOString().split('T')[0];
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [timeValue, onChangeTimeValue] = useState<string>(time ? time : '');
  const [selectDate, setSelectDate] = useState<string>(date ? date : todayDate);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ServiceForm>({
    defaultValues: {address: address},
  });
  const cart = useAppSelector((state: any) => state.cart.cart);
  const cityId = useAppSelector((state: any) => state.address.cityId);

  function convertTo24HourFormat(timeString: string) {
    const [hour, minute, period] = timeString.split(':');
    let formattedHour = parseInt(hour, 10);
    if (
      (formattedHour < 12 && period[3] + period[4] === 'PM') ||
      (formattedHour === 12 && period[3] + period[4] === 'AM')
    ) {
      formattedHour += 12;
    }
    return `${formattedHour}:${minute}`;
  }

  const submit = async (data: ServiceForm) => {
    let formatTime = convertTo24HourFormat(timeValue);
    const payload: BookingPayload = {
      cityId: cityId,
      items: [...cart],
      bookingDate: selectDate,
      startTime: formatTime,
      serviceAddress: data.address,
      serviceLocation: '',
      customerNotes: data.note,
    };
    setLoading(true);
    await instance
      .post('cart/add', payload)
      .then(res => {
        res.status === 200 &&
          (dispatch(clearCart()),
          navigation.dispatch(StackActions.pop(2)),
          navigation.navigate('Cart'));
      })
      .catch(e => {
        console.log(e.message);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledScrollView showsVerticalScrollIndicator={false}>
        <AppHeader back={true} title="Schedule Service" />
        <StyledView className="mb-6 mt-1">
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
        </StyledView>

        {/* Service Details Form */}
        <StyledView style={{marginHorizontal: RPW(6)}}>
          <StyledView className="gap-5 mb-3">
            <StyledView>
              <StyledView className="flex-row space-x-2 items-baseline">
                <Icon name="clock" size={18} color={Colors.Primary} />
                <StyledText className="mb-2 text-base text-black font-medium first-letter:capitalize">
                  {'Select time slot'}
                </StyledText>
              </StyledView>

              <Controller
                name="timeSlot"
                control={control}
                render={({field: {onChange, onBlur}}) => (
                  <StyledView className="flex-row overflow-auto">
                    <StyledView className="w-full">
                      <InputField
                        placeHolder={'Choose a time'}
                        value={timeValue}
                        secure={false}
                        inputMode={'none'}
                        onBlur={onBlur}
                        onChangeText={onChange}
                      />
                    </StyledView>
                    <StyledView className="-ml-12">
                      <DateTimePicker
                        mode="time"
                        currentDate={new Date()}
                        onChange={(time: Date) => {
                          onChangeTimeValue(time.toLocaleTimeString());
                        }}
                      />
                    </StyledView>
                  </StyledView>
                )}
                rules={{required: timeValue ? false : true}}
              />
              {errors.timeSlot && (
                <StyledText className="text-error">
                  {'Please fill out this field.'}
                </StyledText>
              )}
              {error && (
                <StyledText className="text-error">
                  {'Please select a time between 11:00 AM and 8:30 PM.'}
                </StyledText>
              )}
            </StyledView>

            <StyledView>
              <StyledView className="flex-row items-baseline space-x-2">
                <SimpleLineIcons
                  name="location-pin"
                  size={18}
                  color={Colors.Primary}
                />
                <StyledText className="mb-2 text-base text-black font-medium">
                  Service Address
                </StyledText>
              </StyledView>

              <Controller
                name="address"
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <StyledView className="flex-row items-center justify-between border-[1.5px] border-gray rounded-md">
                    <StyledTextInput
                      placeholder="Select address"
                      className="px-3 h-12 text-base text-black"
                      value={value}
                      inputMode="text"
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('SelectAddress', {
                          date: selectDate,
                          time: timeValue,
                        });
                      }}>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={25}
                        color={Colors.Gray}
                      />
                    </TouchableOpacity>
                  </StyledView>
                )}
                rules={{required: true}}
              />
              {errors.address && (
                <StyledText className="text-error">
                  {'Please fill out this field.'}
                </StyledText>
              )}
            </StyledView>

            <StyledView>
              <StyledView className="flex-row items-center space-x-2 mb-1">
                <Feather
                  name="message-square"
                  size={18}
                  color={Colors.Primary}
                />
                <StyledText className="mb-2 text-base text-black font-medium">
                  Special Instructions
                </StyledText>
              </StyledView>

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
            </StyledView>
          </StyledView>
          <StyledView className="my-5">
            <Button
              primary
              title={'Confirm Booking'}
              loading={loading}
              onPress={(Keyboard.dismiss(), handleSubmit(submit))}
            />
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
