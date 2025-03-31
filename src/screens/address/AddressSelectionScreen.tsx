import {
  View,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {styled} from 'nativewind';
import {Colors} from '../../utils/Colors';
import {instance} from '../../api/instance';
import AppHeader from '../../components/AppHeader';
import {Address} from '../category/CategoryScreen';
import {useFocusEffect} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SearchBarComponent} from '../../components/Searchbar';
import {Screen, useNav} from '../../navigation/RootNavigation';
import {LoadingIndicator} from '../../components/LoadingIndicator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;
const RPW = (percentage: number) => {
  return (percentage / 100) * screenWidth;
};

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export const AddressSelectionScreen: Screen<'SelectAddress'> = ({route}) => {
  const navigation = useNav();
  const {date, time} = route.params;
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 2];
  // console.log('===//', prevRoute.name.toString());
  const [isLoading, setIsLoading] = useState(true);
  const [addressList, setAddressList] = useState<Array<Address>>([]);

  const fetchAddress = useCallback(() => {
    try {
      instance.get('/users/addresses').then(response => {
        setAddressList(response.data);
      });
    } catch (e) {
      console.log('Error ', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setPrimaryAddress = useCallback(
    (id: number) => {
      try {
        instance.patch(`/users/addresses/${id}/primary`).then(() => {
          navigation.pop();
        });
      } catch (e) {
        console.log('Error ', e);
      }
    },
    [navigation],
  );

  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, [fetchAddress]),
  );

  const _renderAddress = (address: Address) => {
    return (
      <StyledView
        key={address.id}
        style={{paddingHorizontal: RPW(6)}}
        className="flex-row flex-wrap border-b border-lightGrey items-center justify-between">
        <StyledTouchableOpacity
          className="flex-1 py-5"
          onPress={() => {
            const selectedAddress: string = address.line2
              ? address.line1 +
                ' ' +
                address.line2 +
                ', ' +
                address.city +
                ', ' +
                address.state
              : address.line1 + ', ' + address.city + ', ' + address.state;
            prevRoute.name.toString() === 'TabNavigator'
              ? setPrimaryAddress(address.id)
              : (navigation.pop(),
                navigation.replace('ServiceSchedule', {
                  address: selectedAddress,
                  date: date,
                  time: time,
                }));
          }}>
          <StyledView className="flex-row items-center gap-x-5 overflow-hidden">
            {address.type === 'work' ? (
              <MaterialIcons
                name="work-outline"
                size={20}
                color={Colors.Black}
              />
            ) : address.type === 'home' ? (
              <AntDesign name="home" size={22} color={Colors.Black} />
            ) : (
              <Octicons name="location" size={22} color={Colors.Black} />
            )}
            {address.line2 ? (
              <StyledText
                numberOfLines={2}
                ellipsizeMode="tail"
                className="basis-3/4 text-base text-black">
                {address.line1 +
                  ' ' +
                  address.line2 +
                  ', ' +
                  address.city +
                  ', ' +
                  address.state}
              </StyledText>
            ) : (
              <StyledText
                numberOfLines={2}
                ellipsizeMode="tail"
                className="basis-3/4 text-base text-black">
                {address.line1 + ', ' + address.city + ', ' + address.state}
              </StyledText>
            )}
          </StyledView>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity
          onPress={() => {
            navigation.navigate('AddressDetails', {address: address});
          }}>
          <MaterialIcons name="edit" size={18} color={Colors.Dark} />
        </StyledTouchableOpacity>
      </StyledView>
    );
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <StyledScrollView className="bg-white" showsVerticalScrollIndicator={false}>
      <AppHeader title={'Addresses'} back={true} />
      <StyledView className="my-5">
        <StyledView style={{paddingHorizontal: RPW(5)}}>
          <SearchBarComponent
            placeholder={'Search for your location'}
            iconName={'search'}
            onSearch={(text: string) => {
              prevRoute.name.toString() === 'TabNavigator'
                ? navigation.pop()
                : (navigation.pop(),
                  navigation.replace('ServiceSchedule', {
                    address: text,
                    date: date,
                    time: time,
                  }));
            }}
          />

          <StyledTouchableOpacity
            className="my-5 flex-row items-center gap-x-3"
            onPress={() => {}}>
            <MaterialIcons
              name="my-location"
              size={20}
              color={Colors.Primary}
            />
            <StyledText className="text-base text-primary font-medium">
              Use current location
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
        <StyledView className="h-2 bg-lightGrey" />

        <StyledText
          className="mt-5 mb-2 text-lg text-black"
          style={{paddingHorizontal: RPW(5)}}>
          Available Addresses
        </StyledText>

        <FlatList
          horizontal={false}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          data={addressList}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => _renderAddress(item)}
        />
      </StyledView>
    </StyledScrollView>
  );
};
