import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { CartItem } from './cart';
import { Customer } from './customer';
import * as _ from 'lodash';

// const InvoiceItemMap = new Map<string, CartItem[]>();
// export type InvoiceItemType = typeof InvoiceItemMap;

/**
 const arr = [
  {
    'UDHUD':[
      {name:'d'},
      {name:'dd'},
    ]
  },
  {
    'UDHCC':[
      {name:'c'},
      {name:'cc'}
    ]
  }
]

const xx = _.filter(arr, function(c){
  return c['UDHCC'];
})[0]['UDHCC']

console.log(xx);
]
 */

export interface Invoice {
  _id: string;
  createdAt: string;

  customer: Customer;
  invoiceNumber: string;
  invoiceDate: string;

  invoiceItems: CartItem[];

  discount?: number;
  shippingCharge?: number;
  subTotal: number;
  tax?: number;
  total: number;
  status: 'paid' | 'unpaid';
  notes?: string;
}

export interface CurInvUpdate {
  discount: number;
  shippingCharge: number;
  tax: number;
  status: 'paid' | 'unpaid';
  notes: string;
}

export type InvoiceItemSingle = {
  [key: string]: Invoice[];
};

export interface InvoiceState {
  currentInvoice: Invoice | undefined;
  invoices: InvoiceItemSingle[] | [];
  currentPdfUri: string;
}

const initialState: InvoiceState = {
  currentInvoice: undefined,
  invoices: [],
  currentPdfUri: '',
};

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setCurrentPdfUri: (state, data: PayloadAction<{ uri: string }>) => {
      state.currentPdfUri = data.payload.uri;
    },
    clearCurrentPdfUri: (state) => {
      state.currentPdfUri = '';
    },
    addToCurrentInvoice: (
      state,
      data: PayloadAction<{ cartItems: CartItem[]; customer: Customer }>
    ) => {
      const { cartItems, customer } = data.payload;
      const _id = Math.random().toString(36).substring(2);
      const createdAt = moment().format();

      let customerInvoices: Invoice[] | [] = [];

      const customerInvoicesArr = _.filter(state.invoices, (c) => {
        return c[customer._id]?.length > 0
          ? c[customer._id][0].customer._id === customer._id
          : false;
      });

      if (!customerInvoicesArr || customerInvoicesArr?.length === 0) {
        customerInvoices = [];
      } else {
        customerInvoices = state.invoices[0][customer._id] || [];
      }

      let invoicesArr: Invoice[] = [];

      state.invoices.forEach((el) => {
        const singleBusinessInvoices = Object.values(el).flat();
        invoicesArr.push(...singleBusinessInvoices);
      });

      const invoiceNumber = String(invoicesArr.length + 1).padStart(4, '0');

      let cartTotal = 0;
      cartItems.forEach((cart) => {
        cartTotal += cart.itemTotal;
      });

      const subTotal =
        cartTotal -
        (state.currentInvoice?.discount || 0) +
        (state.currentInvoice?.shippingCharge || 0);

      const currentInvoice: Invoice = {
        _id,
        createdAt,
        customer,
        invoiceItems: cartItems,
        invoiceDate: createdAt,
        invoiceNumber,
        discount: 0,
        shippingCharge: 0,
        subTotal,
        tax: 0,
        total: subTotal,
        status: 'unpaid',
        notes: '',
      };

      /**
        discount: state.currentInvoice?.discount || 0,
        shippingCharge: state.currentInvoice?.shippingCharge || 0,
        subTotal,
        tax: state.currentInvoice?.tax || 0,
        total: subTotal + (state.currentInvoice?.tax || 0),
        status: state.currentInvoice?.status || 'unpaid',
        notes: state.currentInvoice?.notes || '',
       */

      state.currentInvoice = currentInvoice;
    },
    updateCurrentInvoice: (
      state,
      data: PayloadAction<{ updates: CurInvUpdate }>
    ) => {
      const updates = data.payload.updates;
      const { discount, shippingCharge, tax } = updates;

      let invoiceTotal = 0;
      state.currentInvoice?.invoiceItems.forEach((cart) => {
        invoiceTotal += cart.itemTotal;
      });

      if (state.currentInvoice) {
        const subTotal = invoiceTotal - discount + shippingCharge;
        const updatedInvoice: Invoice = {
          ...state.currentInvoice,
          ...updates,
          subTotal,
          total: subTotal + tax,
        };

        state.currentInvoice = updatedInvoice;
      }
    },

    addToFinalInvoice: (state, data: PayloadAction<{ invoice: Invoice }>) => {
      const { customer } = data.payload.invoice;

      const customerInvoices = _.filter(state.invoices, (c) => {
        return c[customer._id]?.length > 0
          ? c[customer._id][0].customer._id === customer._id
          : false;
      });

      if (!customerInvoices || customerInvoices?.length === 0) {
        state.invoices = [
          ...state.invoices,
          { [customer._id]: [data.payload.invoice] },
        ];
      } else {
        const customerNewInvoices = state.invoices.map((inv) => {
          if (
            inv[customer._id]?.length > 0 &&
            inv[customer._id][0].customer._id === customer._id
          ) {
            inv[customer._id] = [...inv[customer._id], data.payload.invoice];
          }
          return inv;
        });

        state.invoices = [...customerNewInvoices];
      }
    },

    pushUpdateToFinalInvoice: (
      state,
      data: PayloadAction<{ invoice: Invoice }>
    ) => {
      const { customer, _id } = data.payload.invoice;

      const customerInvoices = _.filter(state.invoices, (c) => {
        return c[customer._id]?.length > 0
          ? c[customer._id][0].customer._id === customer._id
          : false;
      });

      if (!customerInvoices || customerInvoices?.length === 0) {
        state.invoices = [
          ...state.invoices,
          { [customer._id]: [data.payload.invoice] },
        ];
      } else {
        const customerNewInvoices = state.invoices.map((inv) => {
          if (
            inv[customer._id]?.length > 0 &&
            inv[customer._id][0].customer._id === customer._id
          ) {
            const filteredInvoicesOfCustomer = _.filter(
              [...inv[customer._id]],
              (i) => {
                return i._id !== _id;
              }
            );

            inv[customer._id] = [
              ...filteredInvoicesOfCustomer,
              data.payload.invoice,
            ];
          }
          return inv;
        });

        state.invoices = [...customerNewInvoices];
      }
    },

    deleteInvoiceFromFinalInvoice: (
      state,
      data: PayloadAction<{ invoice: Invoice }>
    ) => {
      const { customer, _id } = data.payload.invoice;

      const customerInvoices = _.filter(state.invoices, (c) => {
        return c[customer._id]?.length > 0
          ? c[customer._id][0].customer._id === customer._id
          : false;
      });

      if (!customerInvoices || customerInvoices?.length === 0) {
        return;
      } else {
        const customerNewInvoices = state.invoices.map((inv) => {
          if (
            inv[customer._id]?.length > 0 &&
            inv[customer._id][0].customer._id === customer._id
          ) {
            const filteredInvoicesOfCustomer = _.filter(
              [...inv[customer._id]],
              (i) => {
                return i._id !== _id;
              }
            );

            inv[customer._id] = [...filteredInvoicesOfCustomer];
          }
          return inv;
        });

        state.invoices = [...customerNewInvoices];
      }
    },

    addToCurrentInvoiceFE: (
      state,
      data: PayloadAction<{ invoice: Invoice }>
    ) => {
      state.currentInvoice = data.payload.invoice;
    },

    updateInvoiceItemPriceFE: (
      state,
      data: PayloadAction<{
        _id: string;
        price: number;
      }>
    ) => {
      const { _id, price } = data.payload;

      if (!state.currentInvoice) {
        return;
      }

      const carts = [...state.currentInvoice.invoiceItems];

      const cartToUpdate = _.filter(carts, (cart) => {
        return cart._id === _id;
      })[0];

      const indexOfTarget = _.indexOf(carts, cartToUpdate, 0);

      const updatedCCart: CartItem = {
        ...cartToUpdate,
        unitPrice: price,
        itemTotal: price * +cartToUpdate.quantity,
      };

      state.currentInvoice.invoiceItems[indexOfTarget] = updatedCCart;

      let cartTotal = 0;
      state.currentInvoice.invoiceItems.forEach((cart) => {
        cartTotal += cart.itemTotal;
      });

      state.currentInvoice.subTotal =
        cartTotal +
        (state.currentInvoice.discount || 0) -
        (state.currentInvoice.shippingCharge || 0);

      state.currentInvoice.total =
        cartTotal +
        (state.currentInvoice.discount || 0) -
        (state.currentInvoice.shippingCharge || 0) +
        (state.currentInvoice.tax || 0);
    },

    updateInvoiceItemFE: (
      state,
      data: PayloadAction<{
        _id: string;
        dir: 'up' | 'down' | 'change';
        qty: number;
      }>
    ) => {
      const { _id, qty, dir } = data.payload;

      if (!state.currentInvoice) {
        return;
      }

      const carts = [...state.currentInvoice.invoiceItems];

      const cartToUpdate = _.filter(carts, (cart) => {
        return cart._id === _id;
      })[0];

      const indexOfTarget = _.indexOf(carts, cartToUpdate, 0);

      if (dir === 'change') {
        const updatedCCart = {
          ...cartToUpdate,
          quantity: qty,
          itemTotal: +cartToUpdate.unitPrice * qty,
        };

        state.currentInvoice.invoiceItems[indexOfTarget] = updatedCCart;

        let cartTotal = 0;
        state.currentInvoice.invoiceItems.forEach((cart) => {
          cartTotal += cart.itemTotal;
        });

        state.currentInvoice.subTotal =
          cartTotal +
          (state.currentInvoice.discount || 0) -
          (state.currentInvoice.shippingCharge || 0);

        state.currentInvoice.total =
          cartTotal +
          (state.currentInvoice.discount || 0) -
          (state.currentInvoice.shippingCharge || 0) +
          (state.currentInvoice.tax || 0);

        return;
      }

      const newQty = dir === 'up' ? qty + 1 : qty > 0 ? qty - 1 : 0;

      const updatedCart = {
        ...cartToUpdate,
        quantity: newQty,
        itemTotal: +cartToUpdate.unitPrice * newQty,
      };

      updatedCart.itemTotal =
        updatedCart.quantity === 0 ? 0 : updatedCart.itemTotal;

      state.currentInvoice.invoiceItems[indexOfTarget] = updatedCart;

      let cartTotal = 0;
      state.currentInvoice.invoiceItems.forEach((cart) => {
        cartTotal += cart.itemTotal;
      });

      state.currentInvoice.subTotal =
        cartTotal +
        (state.currentInvoice.discount || 0) -
        (state.currentInvoice.shippingCharge || 0);

      state.currentInvoice.total =
        cartTotal +
        (state.currentInvoice.discount || 0) -
        (state.currentInvoice.shippingCharge || 0) +
        (state.currentInvoice.tax || 0);
    },

    deleteInvoiceItemFE: (state, data: PayloadAction<{ _id: string }>) => {
      if (!state.currentInvoice) {
        return;
      }

      const carts = [...state.currentInvoice.invoiceItems];

      const updatedCarts = _.remove(
        carts,
        (cus) => cus._id !== data.payload._id
      );

      let cartTotal = 0;
      updatedCarts.forEach((cart) => {
        cartTotal += cart.itemTotal;
      });

      state.currentInvoice.subTotal =
        cartTotal +
        (state.currentInvoice.discount || 0) -
        (state.currentInvoice.shippingCharge || 0);

      state.currentInvoice.total =
        cartTotal +
        (state.currentInvoice.discount || 0) -
        (state.currentInvoice.shippingCharge || 0) +
        (state.currentInvoice.tax || 0);

      state.currentInvoice.invoiceItems = updatedCarts;
    },

    deleteAllInvoices: (state) => {
      state.invoices = [];
    },

    clearCurrentInvoice: (state) => {
      state.currentInvoice = undefined;
    },

    importInvoice: (
      state,
      data: PayloadAction<{ invoices: InvoiceItemSingle[] | [] }>
    ) => {
      state.invoices = data.payload.invoices;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToCurrentInvoice,
  updateCurrentInvoice,
  updateInvoiceItemPriceFE,
  deleteAllInvoices,
  addToCurrentInvoiceFE,
  updateInvoiceItemFE,
  deleteInvoiceItemFE,
  addToFinalInvoice,
  pushUpdateToFinalInvoice,
  setCurrentPdfUri,
  clearCurrentPdfUri,
  deleteInvoiceFromFinalInvoice,
  clearCurrentInvoice,
  importInvoice,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
