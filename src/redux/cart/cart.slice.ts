import {CartState} from './cart.entity';
import cartReducer from './cart.reducer';
import {createSlice} from '@reduxjs/toolkit';

export const initialState: CartState = {
  cart: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: cartReducer,
});

export const {addItem, addMultipleItems, reduceQuantity, removeItem} = cartSlice.actions;
export default cartSlice.reducer;
