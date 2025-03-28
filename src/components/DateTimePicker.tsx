import {View, Platform, TouchableOpacity} from 'react-native';
import React from 'react';
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { styled } from 'nativewind';
import {Colors} from '../utils/Colors';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
  mode: string;
  currentDate: Date;
  onChange: (date: Date) => void;
}

export default function DateTimePicker(props: Props) {
  if (Platform.OS === 'android') {
    return <AndroidDateTimePicker {...props} />;
  }
  if (Platform.OS === 'ios') {
    return <IOSDateTimePicker {...props} />;
  }
  return null;
}

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const AndroidDateTimePicker: React.FC<Props> = ({
  mode,
  onChange,
  currentDate,
}) => {
  const showDateTimePicker = () => {
    DateTimePickerAndroid.open({
      mode: mode === 'time' ? 'time' : 'date',
      value: currentDate,
      maximumDate: new Date(),
      minuteInterval: 30,
      onChange: (_, date?: Date) => onChange(date || new Date()),
      display: mode === 'time' ? 'spinner' : 'calendar',
      positiveButton: {label: 'OK', textColor: Colors.Primary},
      negativeButton: {label: 'Cancel', textColor: Colors.Gray},
    });
  };

  return (
    <StyledView className="p-2 items-center justify-between">
      <StyledTouchableOpacity onPress={showDateTimePicker}>
        {mode === 'date' ? (
          <Feather name="calendar" size={26} color={Colors.Dark} />
        ) : (
          <Feather name="clock" size={26} color={Colors.Dark} />
        )}
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export const IOSDateTimePicker: React.FC<Props> = ({
  mode,
  onChange,
  currentDate,
}) => {
  return (
    <RNDateTimePicker
      mode={mode === 'time' ? 'time' : 'date'}
      display="spinner"
      accentColor="black"
      value={currentDate}
      minuteInterval={30}
      maximumDate={new Date()}
      onChange={(_, date?: Date) => onChange(date || new Date())}
    />
  );
};
