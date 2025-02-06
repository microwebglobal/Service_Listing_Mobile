import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './src/navigation/RootNavigator';
import {ButtonProps, createTheme, ThemeProvider} from '@rneui/themed';
import {Platform} from 'react-native';

export const FONT_FAMILY = 'Poppins';

const theme = createTheme({
  lightColors: {
    primary: '#0070FF',
    secondary: '#263446',
    grey0: '#788AA5',
    white: '#FFFFFF',
    black: '#000',
    error: '#C62B3B',
  },
  darkColors: {
    primary: '#001899',
    secondary: '#263446',
    grey0: '#788AA5',
    error: '#C62B3B',
    black: '#000',
    white: '#FFFFFF',
  },
  mode: 'light',
  components: {
    Button: (
      props: ButtonProps & {
        primary?: boolean;
        secondary?: boolean;
        error?: boolean;
        default?: boolean;
      },
      themeColor,
    ) => ({
      uppercase: true,
      titleStyle: {
        paddingHorizontal: 5,
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
        lineHeight: 30,
        color: props.primary
          ? themeColor.colors.white
          : props.default
          ? themeColor.colors.primary
          : props.error
          ? themeColor.colors.white
          : themeColor.colors.primary,
        fontSize: props.size === 'sm' ? 14 : 18,
        marginTop: Platform.OS === 'ios' ? 3 : 0,
      },
      buttonStyle: {
        borderRadius: 10,
        borderWidth: props.primary ? 0 : 1,
        borderColor: themeColor.colors.primary,
        backgroundColor: props.primary
          ? themeColor.colors.primary
          : props.error
          ? themeColor.colors.error
          : themeColor.colors.white,
      },
    }),
  },
});

function App(): React.JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
