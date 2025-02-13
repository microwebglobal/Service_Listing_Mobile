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
  onBlur?: (event: any) => void;
  onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onChangeText: (text: string) => void;
}

const StyledInput = styled(TextInput);

const InputField = ({
  value,
  placeHolder,
  inputMode,
  secure,
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
      className={`border-2 rounded-md h-12 px-3 text-base text-dark ${
        isFocused ? 'border-dark' : 'border-gray'
      }`}
      value={value}
      inputMode={inputMode}
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
