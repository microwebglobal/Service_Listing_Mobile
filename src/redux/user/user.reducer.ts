import {PayloadAction} from '@reduxjs/toolkit';
import {UserDetailEntity, UserState} from './user.entity';

export default {
  setUser: (
    state: UserState,
    action: PayloadAction<UserDetailEntity | null>,
  ) => {
    state.user = action.payload;
  },
  setId: (state: UserState, action: PayloadAction<number>) => {
    state.user!.id = action.payload;
  },
  logOut: (state: UserState) => {
    state.user = null;
  },
};
