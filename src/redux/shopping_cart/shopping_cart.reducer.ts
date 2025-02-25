import {PayloadAction} from '@reduxjs/toolkit';
import {CartState, Booking, BookingItem} from './shopping_cart.entity';

export default {
  setCart: (state: CartState, action: PayloadAction<Booking>) => {
    state.shoppingCart = action.payload;
  },

  addQuantity: (state: CartState, action: PayloadAction<string>) => {
    const index = state.shoppingCart?.BookingItems?.findIndex(
      (cartItem: BookingItem) => cartItem.item_id === action.payload,
    );

    if (state.shoppingCart !== null && index !== -1 && index !== undefined) {
      state.shoppingCart.BookingItems[index].quantity += 1;

      let subTotal: number = parseInt(
        state.shoppingCart.BookingPayment.subtotal,
        10,
      );
      subTotal += parseInt(
        state.shoppingCart.BookingItems[index].unit_price,
        10,
      );

      let tip_amount: number = parseInt(
        state.shoppingCart.BookingPayment.tip_amount,
        10,
      );
      let tax_amount: number = subTotal * 0.18;
      let total_amount: number = subTotal + tax_amount + tip_amount;

      state.shoppingCart.BookingPayment.subtotal = subTotal.toFixed(2);
      state.shoppingCart.BookingPayment.tax_amount = tax_amount.toFixed(2);
      state.shoppingCart.BookingPayment.total_amount = total_amount.toFixed(2);
    }
  },

  reduceQuantity: (state: CartState, action: PayloadAction<string>) => {
    const index = state.shoppingCart?.BookingItems?.findIndex(
      (cartItem: BookingItem) => cartItem.item_id === action.payload,
    );

    if (state.shoppingCart !== null && index !== -1 && index !== undefined) {
      state.shoppingCart.BookingItems[index].quantity -= 1;

      let subTotal: number = parseInt(
        state.shoppingCart.BookingPayment.subtotal,
        10,
      );
      subTotal -= parseInt(
        state.shoppingCart.BookingItems[index].unit_price,
        10,
      );

      let tip_amount: number = parseInt(
        state.shoppingCart.BookingPayment.tip_amount,
        10,
      );
      let tax_amount: number = subTotal * 0.18;
      let total_amount: number = subTotal + tax_amount + tip_amount;

      state.shoppingCart.BookingPayment.subtotal = subTotal.toFixed(2);
      state.shoppingCart.BookingPayment.tax_amount = tax_amount.toFixed(2);
      state.shoppingCart.BookingPayment.total_amount = total_amount.toFixed(2);

      if (state.shoppingCart.BookingItems[index].quantity === 0) {
        state.shoppingCart.BookingItems =
          state.shoppingCart.BookingItems.filter(
            item => item.item_id !== action.payload,
          );
      }
    }
  },

  clearCart: (state: CartState) => {
    state.shoppingCart = null;
  },
};
