import {PayloadAction} from '@reduxjs/toolkit';
import {CartState, ItemEntity} from './cart.entity';

export default {
  addItem: (state: CartState, action: PayloadAction<ItemEntity>) => {
    if (state.cart === null) {
      state.cart = [];
    }
    const index = state.cart?.findIndex(
      cartItem => cartItem.itemId === action.payload.itemId,
    );
    if (state.cart !== null && index !== -1 && index !== undefined) {
      state.cart[index].quantity += 1;
    }
    if (index === -1 || index === undefined) {
      state.cart?.push(action.payload);
    }
  },
  reduceQuantity: (state: CartState, action: PayloadAction<string>) => {
    const index = state.cart?.findIndex(
      cartItem => cartItem.itemId === action.payload,
    );
    if (state.cart !== null && index !== -1 && index !== undefined) {
      state.cart[index].quantity -= 1;
    }
  },
  removeItem: (state: CartState, action: PayloadAction<string>) => {
    const index = state.cart?.findIndex(
      cartItem => cartItem.itemId === action.payload,
    );
    if (index !== -1 && index !== undefined) {
      state.cart?.splice(index, 1);
    }
  },
  addMultipleItems: (state: CartState, action: PayloadAction<ItemEntity[]>) => {
    if (state.cart === null) {
      state.cart = [];
    }
    action.payload.forEach(item => {
      const index = state.cart?.findIndex(
        cartItem => cartItem.itemId === item.itemId,
      );
      if (state.cart !== null && index !== -1 && index !== undefined) {
        state.cart[index].quantity += 1;
      }
      if (index === -1 || index === undefined) {
        state.cart?.push(item);
      }
    });
  },
  clearCart: (state: CartState) => {
    state.cart ? (state.cart = []) : null;
  },
};
