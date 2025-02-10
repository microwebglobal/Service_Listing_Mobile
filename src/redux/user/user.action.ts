import {Dispatch} from '@reduxjs/toolkit';
import {dispatchable} from '../dispatchable';
import {LoginParams, LoginResponse} from './user.entity';
import {instance} from '../../api/instance';
import {AxiosResponse} from 'axios';
import {saveTokenToStorage} from '../../utils/token-storage';
import {setId} from './user.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function extractToken(cookieString: string, tokenName: string) {
  const tokenRegex = new RegExp(`${tokenName}=([^;]+)`);
  const match = cookieString.match(tokenRegex);
  return match ? match[1] : null;
}

export const userLogin = dispatchable(({mobile, otp}: LoginParams) => {
  return async (dispatch: Dispatch) => {
    try {
      const response: AxiosResponse<LoginResponse> = await instance.post(
        '/auth/customer/login/verify-otp',
        {mobile, otp},
      );

      const cookieString: Array<string> = response.headers['set-cookie'];
      const accessToken = extractToken(cookieString[0], 'accessToken');
      const refreshToken = extractToken(cookieString[0], 'refreshToken');

      if (accessToken && refreshToken) {
        await saveTokenToStorage(accessToken, refreshToken);
      }

      if (response.status === 200) {
        dispatch(setId(response.data.id));
        return {
          success: true,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  };
});

// Check if the token is still valid otherwise refresh the token
export const refreshTokens = dispatchable(() => {
  return async () => {
    try {
      const response = await instance.post('/auth/refresh');

      const cookieString: Array<string> = response.headers['set-cookie'];
      const accessToken = extractToken(cookieString[0], 'accessToken');
      const refreshToken = extractToken(cookieString[0], 'refreshToken');

      if (accessToken && refreshToken) {
        await saveTokenToStorage(accessToken, refreshToken);
      }
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
      };
    }
  };
});

export const userLogout = dispatchable(() => {
  return async () => {
    try {
      await AsyncStorage.clear();
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  };
});

export const userUpdate = dispatchable((name: any, email: any) => {
  return async () => {
    try {
      const result = await instance.put(`/users/profile/${7}`, {
        name: name,
        email: email,
        gender: null,
        dob: null,
      });

      const {status} = result;

      if (status === 200) {
        return {
          success: true,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  };
});
