import {UserState} from './user.entity';
import userReducer from './user.reducer';
import {createSlice} from '@reduxjs/toolkit';

export const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: userReducer,
});

export const {signUp, setId, logOut} = userSlice.actions;
export default userSlice.reducer;
