import {PayloadAction} from '@reduxjs/toolkit';
import {AddressEntity, AddressState} from './address.entity';

export default {
  saveAddressList: (
    state: AddressState,
    action: PayloadAction<Array<AddressEntity | null>>,
  ) => {
    state.addresses = [];
    action.payload.forEach(address => {
      if (address !== undefined) {
        state.addresses.push(address);
      }
    });
  },
  setPrimaryCityID: (state: AddressState, action: PayloadAction<string>) => {
    state.addresses = [];
    state.addresses.push({} as AddressEntity);
    if (state.addresses[0]) {
      state.addresses[0].cityId = action.payload;
    }
  },
  clearAddressList: (state: AddressState) => {
    state.addresses = [];
  },
};
