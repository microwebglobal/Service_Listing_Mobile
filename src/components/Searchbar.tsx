import React, {useState} from 'react';
import {SearchBar} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SearchBarProps {
  placeholder: string;
  iconName: string;
  onSearch: (text: string) => void;
}

export const SearchBarComponent = ({placeholder, iconName, onSearch}: SearchBarProps) => {
  const [searchText, setSearchText] = useState<string>();
  const updateSearch = (text: string) => {
    setSearchText(text);
  };

  const icon = (
    <Ionicons name={iconName} size={20} color={Colors.Dark} />
  );

  return (
    <View className="flex-row items-center">
      <View className="flex-1 w-auto">
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
          onSubmitEditing={() => {
            searchText && onSearch(searchText);
            setSearchText(undefined);
          }}
          returnKeyType="search"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ContainerStyle: {
    padding: 0,
    backgroundColor: Colors.White,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  inputContainerStyle: {
    backgroundColor: Colors.White,
    borderRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.Gray,
    elevation: 2,
  },
  InputText: {
    height: 50,
    color: Colors.Dark,
    fontSize: 17,
  },
});
