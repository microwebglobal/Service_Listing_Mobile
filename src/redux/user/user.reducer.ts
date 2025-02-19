import {PayloadAction} from '@reduxjs/toolkit';
import {UserDetailEntity, UserState} from './user.entity';

export default {
  setUser: (state: UserState, action: PayloadAction<UserDetailEntity>) => {
    state.user = action.payload;
  },
  setId: (state: UserState, action: PayloadAction<number>) => {
    if (!state.user) {
      state.user = {} as UserDetailEntity;
    }
    state.user.id = action.payload;
  },
  logOut: (state: UserState) => {
    state.user = {} as UserDetailEntity;
  },
};
