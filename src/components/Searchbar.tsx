import React, {useState} from 'react';
import {styled} from 'nativewind';
import {Colors} from '../utils/Colors';
import {SearchBar} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SearchBarProps {
  placeholder: string;
  iconName: string;
  onChange: (text: string) => void;
}

const StyledView = styled(View);

export const SearchBarComponent = ({
  placeholder,
  iconName,
  onChange,
}: SearchBarProps) => {
  const [searchText, setSearchText] = useState<string>();
  const updateSearch = (text: string) => {
    setSearchText(text);
    onChange(text);
  };

  const icon = <Ionicons name={iconName} size={20} color={Colors.Dark} />;

  return (
    <StyledView className="flex-row items-center">
      <StyledView className="flex-1 w-auto">
        <SearchBar
          placeholder={placeholder}
          placeholderTextColor={Colors.Gray}
          value={searchText}
          onChangeText={updateSearch}
          inputMode="text"
          lightTheme={true}
          searchIcon={icon}
          containerStyle={styles.ContainerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={styles.InputText}
          returnKeyType="search"
        />
      </StyledView>
    </StyledView>
  );
};

const styles = StyleSheet.create({
  ContainerStyle: {
    padding: 0,
    backgroundColor: Colors.White,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  inputContainerStyle: {
    elevation: 2,
    borderWidth: 1,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: Colors.Gray,
    backgroundColor: Colors.White,
  },
  InputText: {
    height: 48,
    fontSize: 16,
    color: Colors.Black,
    transform: [{translateY: 2}],
    fontFamily: 'Poppins-Regular',
  },
});
