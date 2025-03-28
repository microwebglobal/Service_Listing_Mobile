import {View, Text, StyleSheet, Dimensions, Keyboard} from 'react-native';
import {Button} from './rneui';
import {styled} from 'nativewind';
import {CheckBox} from '@rneui/themed';
import InputField from './InputFeild';
import React, {useState} from 'react';
import {Colors} from '../utils/Colors';
import {instance} from '../api/instance';
import {Controller, useForm} from 'react-hook-form';
import {Address} from '../screens/category/CategoryScreen';
import {AddressEntity} from '../redux/address/address.entity';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface AddressFormProps {
  btnTitle: string;
  onClose: () => void;
  onSubmit?: (data: AddressEntity) => void;
}

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);

export const AddressForm = ({
  btnTitle,
  onClose,
  onSubmit,
}: AddressFormProps) => {
  const [selectedIndex, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm<Address>();

  const submit = (data: Address) => {
    if (onSubmit) {
      data.type = selectedIndex === 0 ? 'home' : 'work';
      onSubmit(data);
      reset();
    } else {
      try {
        setLoading(true);
        instance
          .post('/users/addresses/', {
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            state: data.state,
            postal_code: data.postal_code,
            type: selectedIndex === 0 ? 'home' : 'work',
          })
          .then(() => {
            reset();
            onClose();
          });
      } catch (e) {
        console.log('Error ', e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <StyledView style={{paddingHorizontal: RPW(5)}}>
      <StyledView className="mb-5 flex-row justify-between w-full items-center">
        <StyledText className="text-lg font-medium text-black">
          Add New Address
        </StyledText>
        <MaterialIcons
          name="close"
          color={Colors.Dark}
          size={22}
          onPress={onClose}
        />
      </StyledView>

      <StyledView className="flex-row mb-3">
        <StyledView>
          <CheckBox
            title="Home"
            checked={selectedIndex === 0}
            onPress={() => setIndex(0)}
            checkedColor={Colors.Black}
            wrapperStyle={styles.wrapperStyle}
            textStyle={styles.textStyle}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
        </StyledView>
        <StyledView>
          <CheckBox
            title="Work"
            checked={selectedIndex === 1}
            onPress={() => setIndex(1)}
            checkedColor={Colors.Black}
            wrapperStyle={styles.wrapperStyle}
            textStyle={styles.textStyle}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
        </StyledView>
      </StyledView>

      <StyledView className="mb-3">
        <AddressFormField
          name={'line1'}
          label="Street Address"
          control={control}
          errors={errors.line1}
          required={true}
          placeHolder={'Street Address'}
        />
        <AddressFormField
          name={'line2'}
          label={'Apartment, suite, etc.'}
          control={control}
          errors={errors.line2}
          required={false}
          placeHolder={'Apartment, suite, etc. (optional)'}
        />

        <StyledView className="flex-row">
          <StyledView className="basis-1/2 pr-2">
            <AddressFormField
              name={'city'}
              label={'City'}
              control={control}
              errors={errors.city}
              required={true}
              placeHolder={'City'}
            />
          </StyledView>
          <StyledView className="basis-1/2 pl-2">
            <AddressFormField
              name={'state'}
              label={'State'}
              control={control}
              errors={errors.state}
              required={true}
              placeHolder={'City'}
            />
          </StyledView>
        </StyledView>

        <AddressFormField
          name={'postal_code'}
          label={'Postal Code'}
          control={control}
          errors={errors.postal_code}
          required={true}
          placeHolder={'Postal code'}
        />
      </StyledView>

      <StyledView className="my-5">
        <Button
          primary
          loading={loading}
          title={btnTitle}
          onPress={(Keyboard.dismiss(), handleSubmit(submit))}
        />
      </StyledView>
    </StyledView>
  );
};

const styles = StyleSheet.create({
  textStyle: {color: Colors.Black, fontSize: 16, fontWeight: 'normal'},
  wrapperStyle: {
    marginTop: -10,
    marginLeft: -20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: Colors.LightGrey,
  },
});

interface AddressFormFieldProps {
  errors: any;
  control: any;
  name: string;
  label: string;
  required: boolean;
  placeHolder: string;
}

const AddressFormField: React.FC<AddressFormFieldProps> = ({
  name,
  label,
  control,
  errors,
  required,
  placeHolder,
}) => {
  return (
    <StyledView className="mb-3">
      <StyledText className="mb-2 text-base text-black font-medium">
        {label}
        {errors && <StyledText className="text-error">{' *'}</StyledText>}
      </StyledText>
      <Controller
        name={name}
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <InputField
            placeHolder={placeHolder}
            value={value}
            secure={false}
            inputMode={'text'}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={{required: required}}
      />
    </StyledView>
  );
};
