import {
  InputModeOptions,
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
} from 'react-native';
import {styled} from 'nativewind';
import React from 'react';
import {Colors} from '../utils/Colors';

interface InputFieldProps {
  placeHolder: string;
  value: string;
  secure: boolean;
  inputMode: InputModeOptions;
  multiline?: boolean;
  onBlur?: (event: any) => void;
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onChangeText: (text: string) => void;
}

const StyledInput = styled(TextInput);

const InputField = ({
  value,
  secure,
  inputMode,
  multiline,
  placeHolder,
  onBlur,
  onChange,
  onChangeText,
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  return (
    <StyledInput
      placeholder={placeHolder}
      placeholderTextColor={Colors.Gray}
      secureTextEntry={secure}
      className={`border-[1.5px] rounded-md h-12 px-3 text-base text-dark ${
        `${isFocused ? 'border-black' : 'border-gray'} ${multiline ? 'h-24' : ''}`
      }`}
      value={value}
      inputMode={inputMode}
      multiline={multiline}
      onChange={onChange}
      onChangeText={onChangeText}
      onBlur={() => {
        onBlur;
        setIsFocused(false);
      }}
      onFocus={() => {
        setIsFocused(true);
      }}
    />
  );
};

export default InputField;
