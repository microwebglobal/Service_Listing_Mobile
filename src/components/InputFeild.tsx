import {
  InputModeOptions,
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
} from 'react-native';
import {styled} from 'nativewind';
import React from 'react';

interface InputFieldProps {
  placeHolder: string;
  value: string;
  secure: boolean;
  inputMode: InputModeOptions;
  onBlur: (event: any) => void;
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
  return (
    <StyledInput
      placeholder={placeHolder}
      secureTextEntry={secure}
      className="border border-gray-400 rounded-md h-14 px-3 text-base text-gray-900"
      value={value}
      inputMode={inputMode}
      onBlur={onBlur}
      onChangeText={onChangeText}
      onChange={onChange}
    />
  );
};

export default InputField;
