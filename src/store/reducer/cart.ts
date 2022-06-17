import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as _ from 'lodash';
import moment from 'moment';
import customer, { Customer } from './customer';

export interface CartItem {
  _id: string;
  createdAt: string;
  itemId: string;

  name: string;
  unitPrice: number | '';
  discount: number | '';
  inStock: number | '';

  quantity: number | '';
  itemTotal: number;
}

export interface CartState {
  customer: Customer | undefined;
  carts: CartItem[] | [];
  cartTotal: number;
}

const initialState: CartState = {
  customer: undefined,
  carts: [],
  cartTotal: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (state, data: PayloadAction<{ cart: CartItem[] }>) => {
      const newCarts = data.payload.cart;

      let cartTotal = 0;
      newCarts.forEach((cart) => {
        cartTotal += cart.itemTotal;
      });

      state.carts = newCarts;
      state.cartTotal = cartTotal;
    },

    updateCart: (
      state,
      data: PayloadAction<{
        _id: string;
        dir: 'up' | 'down' | 'change';
        qty: number;
        disc: number;
      }>
    ) => {
      const { _id, qty, dir, disc } = data.payload;
      const carts = [...state.carts];

      const cartToUpdate = _.filter(carts, (cart) => {
        return cart._id === _id;
      })[0];

      const indexOfTarget = _.indexOf(carts, cartToUpdate, 0);

      if (dir === 'change') {
        const updatedCCart = {
          ...cartToUpdate,
          quantity: qty,
          discount: disc,
          itemTotal: +cartToUpdate.unitPrice * qty - disc,
        };

        state.carts[indexOfTarget] = updatedCCart;

        let cartTotal = 0;
        state.carts.forEach((cart) => {
          cartTotal += cart.itemTotal;
        });

        state.cartTotal = cartTotal;

        return;
      }

      const newQty = dir === 'up' ? qty + 1 : qty > 0 ? qty - 1 : 0;

      const updatedCart = {
        ...cartToUpdate,
        quantity: newQty,
        discount: disc,
        itemTotal: +cartToUpdate.unitPrice * newQty - disc,
      };

      state.carts[indexOfTarget] = updatedCart;

      let cartTotal = 0;
      state.carts.forEach((cart) => {
        cartTotal += cart.itemTotal;
      });

      state.cartTotal = cartTotal;
    },

    deleteCart: (state, data: PayloadAction<{ _id: string }>) => {
      const carts = [...state.carts];
      const updatedCarts = _.remove(
        carts,
        (cus) => cus._id !== data.payload._id
      );

      let cartTotal = 0;
      updatedCarts.forEach((cart) => {
        cartTotal += cart.itemTotal;
      });
      state.cartTotal = cartTotal;
      state.carts = updatedCarts;
    },

    addCustomerToCart: (state, data: PayloadAction<{ customer: Customer }>) => {
      state.customer = data.payload.customer;
    },

    clearCart: (state) => {
      state.cartTotal = 0;
      state.customer = undefined;
      state.carts = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCart, updateCart, deleteCart, addCustomerToCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
