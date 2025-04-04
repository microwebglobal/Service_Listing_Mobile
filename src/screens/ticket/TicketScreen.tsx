import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React from 'react';
import {styled} from 'nativewind';
import AppHeader from '../../components/AppHeader';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

export const TicketScreen = () => {
  return (
    <StyledSafeAreaView>
      <StyledScrollView>
        <AppHeader back={false} title="Tickets" />
        <StyledView>
          <StyledText>TicketScreen</StyledText>
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};
