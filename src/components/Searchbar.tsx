import React, {useState} from 'react';
import {SearchBar} from '@rneui/themed';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SearchBarProps {
  onSearch: (text: string) => void;
}

export const SearchBarComponent = ({onSearch}: SearchBarProps) => {
  const [searchText, setSearchText] = useState<string>('');
  const updateSearch = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  const locationIcon =
    searchText.length === 0 ? (
      <Ionicons name="location-outline" size={20} color={Colors.Black} />
    ) : (
      <Ionicons name="location" size={20} color={Colors.Black} />
    );

  // const cancelIcon = (
  //   <AntDesign name="close" size={20} color={Colors.SecondaryBlue} />
  // );

  return (
    <View className="flex-row items-center">
      <View style={{width: 'auto', flex: 1}}>
        <SearchBar
          placeholder="Add location"
          placeholderTextColor={Colors.Gray}
          value={searchText}
          onChangeText={updateSearch}
          inputMode="text"
          round={true}
          lightTheme={true}
          searchIcon={locationIcon}
          // clearIcon={cancelIcon}
          containerStyle={styles.SearchBarContainerStyle}
          inputStyle={styles.SearchInputText}
          leftIconContainerStyle={styles.SearchIcon}
          onSubmitEditing={() => {
            setSearchText('');
          }}
          returnKeyType="search"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  SearchBarContainerStyle: {
    marginLeft: -7,
    backgroundColor: Colors.White,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  SearchInputText: {
    height: 50,
    color: Colors.Black,
    fontSize: 18,
  },
  SearchIcon: {
    marginLeft: 15,
  },
});
