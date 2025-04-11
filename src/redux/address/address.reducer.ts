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
  saveCityId: (state: AddressState, action: PayloadAction<string>) => {
    state.cityId = action.payload;
  },
  savePrimaryAddress: (state: AddressState, action: PayloadAction<string>) => {
    state.address = action.payload;
  },
  clearAddressList: (state: AddressState) => {
    state.addresses = [];
  },
};
