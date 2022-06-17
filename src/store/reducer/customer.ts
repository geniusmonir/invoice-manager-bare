import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as _ from 'lodash';

export interface Customer {
  _id: string;
  createdAt: string;
  business_name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface CustomerState {
  customers: Customer[] | [];
}

const initialState: CustomerState = {
  customers: [],
};

export const registerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    addCustomer: (state, data: PayloadAction<{ customer: Customer }>) => {
      state.customers = [...state.customers, data.payload.customer];
    },

    editCustomer: (state, data: PayloadAction<{ customer: Customer }>) => {
      const updatedCustomer = data.payload.customer;
      const customers = [...state.customers];

      const updatedCustomers = _.map(customers, (cus) => {
        return cus._id === updatedCustomer._id ? { ...updatedCustomer } : cus;
      });

      state.customers = [...updatedCustomers];
    },

    deleteCustomer: (state, data: PayloadAction<{ _id: string }>) => {
      const customers = [...state.customers];
      const updatedCustomers = _.remove(
        customers,
        (cus) => cus._id !== data.payload._id
      );
      state.customers = [...updatedCustomers];
    },

    importCustomer: (state, data: PayloadAction<{ customers: Customer[] }>) => {
      state.customers = data.payload.customers;
    },

    deleteAllCustomer: (state) => {
      state.customers = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addCustomer,
  editCustomer,
  deleteCustomer,
  importCustomer,
  deleteAllCustomer,
} = registerSlice.actions;

export default registerSlice.reducer;
