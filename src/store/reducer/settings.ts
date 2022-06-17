import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  logo?: string;
  hideFromInvoice: boolean;

  business_name: string;
  owner_name: string;
  address: string;
  phone: string;
  website?: string;
  email?: string;
}

const initialState: SettingsState = {
  logo: '',
  hideFromInvoice: true,
  business_name: '',
  phone: '',
  address: '',
  owner_name: '',
  website: '',
  email: '',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettingsState: (state, data: PayloadAction<SettingsState>) => {
      state.business_name = data.payload.business_name ?? state.business_name;
      state.phone = data.payload.phone ?? state.phone;
      state.address = data.payload.address ?? state.address;
      state.email = data.payload.email ?? state.email;
      state.logo = data.payload.logo ?? state.logo;
      state.website = data.payload.website ?? state.website;
      state.hideFromInvoice =
        data.payload.hideFromInvoice ?? state.hideFromInvoice;
      state.owner_name = data.payload.owner_name ?? state.owner_name;
    },

    resetSettingsState: (state) => {
      state.business_name = '';
      state.phone = '';
      state.address = '';
      state.email = '';
      state.hideFromInvoice = true;
      state.logo = '';
      state.website = '';
      state.owner_name = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateSettingsState, resetSettingsState } =
  settingsSlice.actions;

export default settingsSlice.reducer;
