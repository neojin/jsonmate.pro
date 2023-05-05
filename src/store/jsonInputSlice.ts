import { createSlice } from '@reduxjs/toolkit';

// TODO - consider doing all the validations for repair and formatting
// in here, that way whenever input it set, it just all happens
// and you dont need to do it in the react component
const jsonInputSlice = createSlice({
  name: 'jsonInput',
  initialState: {
    input: '',
    valid: false,
    error: '',
  },
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
    setValid: (state, action) => {
      state.valid = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    reset: (state) => {
      state.input = '';
      state.valid = false;
      state.error = '';
    },
    set: (state, action) => {
      state.input = action.payload.input;
      state.valid = action.payload.valid;
      state.error = action.payload.error;
    },
  },
});

export const jsonInputActions = jsonInputSlice.actions;
export default jsonInputSlice;
