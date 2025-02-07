import {Dispatch} from '@reduxjs/toolkit';
import {dispatchable} from '../dispatchable';
import {LoginParams, LoginResponse, UserDetailEntity} from './user.entity';
import {actions} from './user.slice';
import {instance} from '../../api/instance';
import {AxiosResponse} from 'axios';
import {
  getRefreshToken,
  getToken,
  removeTokens,
  saveTokenToStorage,
} from '../../utils/token-storage';

export const userLogin = dispatchable(({mobile, otp}: LoginParams) => {
  return async (dispatch: Dispatch) => {
    try {
      const result: AxiosResponse<LoginResponse> = await instance.post(
        '/auth/customer/login/verify-otp',
        {mobile, otp},
      );

      const {status, data} = result;

      if (status === 200) {
        // const getUserDetail: AxiosResponse<UserDetailEntity> =
        //   await instance.get('/users/addresses', {
        //     headers: {
        //       Authorization: `Bearer ${data.accessToken}`,
        //     },
        //   });

        // await saveTokenToStorage(data.accessToken, data.refreshToken);
        await saveTokenToStorage(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzM4ODk3Mzc1LCJleHAiOjE3Mzg5ODM3NzV9.J_LI8zn6zHGJ0Ah7gpeEpPd-PDVi0RiMzzuNzIvO6g0',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidG9rZW5WZXJzaW9uIjowLCJpYXQiOjE3Mzg4OTczNzUsImV4cCI6MTc0NjY3MzM3NX0.4-J0YTRwTGSHOINKWhsr_48N5ciDTM851nJzEX31auc',
        );

        // dispatch(actions['user/set-user'](getUserDetail.data));

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
export const refreshToken = dispatchable(() => {
  return async () => {
    try {
      const tokenFromKeychain = await getToken();
      console.log('---------',tokenFromKeychain);
      // const refreshTokenFromKeychain = await getRefreshToken();

      if (!tokenFromKeychain) {
        return {
          success: false,
        };
      }

      return {
        success: true,
      };

      // renew tokens
      // const response = await instance.post('/refresh', {
      //   refreshToken: refreshTokenFromKeychain,
      // });

      // const {status, data} = response;

      // if (status === 200) {
      //   await saveTokenToStorage(data.token, data.refreshToken);
      //   return {
      //     success: true,
      //   };
      // }
    } catch (error: any) {
      return {
        success: false,
      };
    }
  };
});

export const userLogout = dispatchable(() => {
  return async (dispatch: Dispatch) => {
    try {
      const result = await removeTokens();

      if (result.success) {
        dispatch(actions['user/set-user'](null));
        return {
          success: true,
        };
      }
    } catch (error) {
      return {
        success: false,
      };
    }
  };
});
