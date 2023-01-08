import { createSlice } from '@reduxjs/toolkit';

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState: {
    mode: 'light',
  },
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const userPreferencesActions = userPreferencesSlice.actions;
export default userPreferencesSlice;
