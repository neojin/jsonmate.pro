import { createSlice } from '@reduxjs/toolkit';

const jmesOutputSlice = createSlice({
  name: 'jmesOutput',
  initialState: {
    output: '',
    showPanel: false,
  },
  reducers: {
    setOutput: (state, action) => {
      state.output = action.payload;
    },
    setShowPanel: (state, action) => {
      state.showPanel = action.payload;
    },
    reset: (state) => {
      state.output = '';
      state.showPanel = false;
    },
    set: (state, action) => {
      state.output = action.payload.output;
      state.showPanel = action.payload.showPanel;
    },
  },
});

export const jmesOutputActions = jmesOutputSlice.actions;
export default jmesOutputSlice;
