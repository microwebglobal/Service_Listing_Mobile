import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async () => {
  const accessToken = await AsyncStorage.getItem('token');
  if (!accessToken) {
    return null;
  }
  return accessToken;
};

export const getRefreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) {
    return null;
  }
  return refreshToken;
};

export const saveTokenToStorage = async (
  token: string,
  refreshToken: string,
) => {
  try {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    return {success: true};
  } catch (error) {
    return {success: false};
  }
};
