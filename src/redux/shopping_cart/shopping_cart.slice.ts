import {CartState} from './shopping_cart.entity';
import shoppingCart from './shopping_cart.reducer';
import {createSlice} from '@reduxjs/toolkit';

export const initialState: CartState = {
  shoppingCart: null,
};

const shoppingCartSlice = createSlice({
  name: 'shopping_cart',
  initialState: initialState,
  reducers: shoppingCart,
});

export const {setCart, addQuantity, reduceQuantity, clearCart} =
  shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
