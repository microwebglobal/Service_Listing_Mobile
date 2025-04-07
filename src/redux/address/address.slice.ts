import {AddressState} from './address.entity';
import {createSlice} from '@reduxjs/toolkit';
import addressReducer from './address.reducer';

export const initialState: AddressState = {
  addresses: [],
  address: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState: initialState,
  reducers: addressReducer,
});

export const {saveAddressList, savePrimaryAddress, clearAddressList} =
  addressSlice.actions;
export default addressSlice.reducer;
