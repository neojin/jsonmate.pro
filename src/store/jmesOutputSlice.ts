import { createSlice } from '@reduxjs/toolkit';

const jmesOutputSlice = createSlice({
  name: 'jmesOutput',
  initialState: {
    output: '',
    showPanel: false,
    error: '',
  },
  reducers: {
    setOutput: (state, action) => {
      state.output = action.payload;
    },
    setShowPanel: (state, action) => {
      state.showPanel = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    reset: (state) => {
      state.output = '';
      state.showPanel = false;
      state.error = '';
    },
    set: (state, action) => {
      state.output = action.payload.output;
      state.showPanel = action.payload.showPanel;
      state.error = action.payload.error;
    },
  },
});

export const jmesOutputActions = jmesOutputSlice.actions;
export default jmesOutputSlice;
