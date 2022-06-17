import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as _ from 'lodash';
import { CartItem } from './cart';

export interface Product {
  _id: string;
  createdAt: string;

  name: string;
  category: string;
  image: string;
  unitPrice: number | '';
  inStock: number | '';

  discount?: number | '';
  description?: string;
  notes?: string;
  isShown: boolean;

  quantity?: number;
  itemTotal?: number;
}

export interface ProductState {
  products: Product[] | [];
}

const initialState: ProductState = {
  products: [],
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct: (state, data: PayloadAction<{ product: Product }>) => {
      state.products = [...state.products, data.payload.product];
    },

    editProduct: (state, data: PayloadAction<{ product: Product }>) => {
      const updatedProduct = data.payload.product;
      const products = [...state.products];

      const updatedProducts = _.map(products, (product) => {
        return product._id === updatedProduct._id
          ? { ...updatedProduct }
          : product;
      });

      state.products = [...updatedProducts];
    },

    updateProductForCart: (
      state,
      data: PayloadAction<{
        _id: string;
        dir: 'up' | 'down' | 'change';
        qty: number;
      }>
    ) => {
      const { _id, qty, dir } = data.payload;
      const products = [...state.products];

      const productToUpdate = _.filter(products, (product) => {
        return product._id === _id;
      })[0];

      const indexOfTarget = _.indexOf(products, productToUpdate, 0);

      if (dir === 'change') {
        const updatedCProduct = {
          ...productToUpdate,
          quantity: qty,
          itemTotal:
            +productToUpdate.unitPrice * qty - (productToUpdate.discount || 0),
        };

        state.products[indexOfTarget] = updatedCProduct;
        return;
      }

      const newQty = dir === 'up' ? qty + 1 : qty > 0 ? qty - 1 : 0;

      const updatedProduct = {
        ...productToUpdate,
        quantity: newQty,
        itemTotal:
          +productToUpdate.unitPrice * newQty - (productToUpdate.discount || 0),
      };

      state.products[indexOfTarget] = updatedProduct;
    },

    clearProductFromCart: (state) => {
      const products = [...state.products];

      const productNotToUpdate = _.filter(products, (product) => {
        const qty = product.quantity || 0;
        return qty === 0;
      });

      const productsToUpdate = _.filter(products, (product) => {
        const qty = product.quantity || 0;
        return qty > 0;
      }).map((p) => {
        p.quantity = 0;
        p.itemTotal = 0;
        return p;
      });

      state.products = [...productNotToUpdate, ...productsToUpdate];
    },

    updateProductInStockCount: (
      state,
      data: PayloadAction<{
        invoiceItems: CartItem[];
      }>
    ) => {
      const { invoiceItems } = data.payload;
      const products = [...state.products];

      invoiceItems.forEach((invItem) => {
        const productToUpdate = _.filter(products, (p) => {
          return p._id === invItem.itemId;
        })[0];
        const indexOfTarget = _.indexOf(products, productToUpdate, 0);

        const newStock = +productToUpdate.inStock - +invItem.quantity;

        const updatedProduct: Product = {
          ...productToUpdate,
          inStock: newStock >= 0 ? newStock : 0,
        };

        state.products[indexOfTarget] = updatedProduct;
      });
    },

    deleteProduct: (state, data: PayloadAction<{ _id: string }>) => {
      const products = [...state.products];
      const updatedProducts = _.remove(
        products,
        (cus) => cus._id !== data.payload._id
      );
      state.products = [...updatedProducts];
    },

    importProduct: (state, data: PayloadAction<{ products: Product[] }>) => {
      state.products = data.payload.products;
    },

    deleteAllProduct: (state) => {
      state.products = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addProduct,
  editProduct,
  deleteProduct,
  importProduct,
  deleteAllProduct,
  updateProductForCart,
  updateProductInStockCount,
  clearProductFromCart,
} = productSlice.actions;

export default productSlice.reducer;
