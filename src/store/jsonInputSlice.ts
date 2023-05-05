import { createSlice } from '@reduxjs/toolkit';
import { jsonrepair, JSONRepairError } from 'jsonrepair';

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
    setAndValidate: (state, action) => {
      state.input = action.payload.input;

      try {
        const repairJson = jsonrepair(removeQuotes(state.input));
        const parsedJson = JSON.parse(removeQuotes(repairJson));
        const json = JSON.stringify(parsedJson, null, 2); // this will throw if it's not valid JSON
        state.input = json;
        state.valid = true;
        state.error = '';
      } catch (e) {
        if (e instanceof SyntaxError) {
          state.valid = false;
          state.error = e.message;
        }
        if (e instanceof JSONRepairError) {
          state.valid = false;
          state.error = `Repair Error: ${e.message}`;
        }
      }
    },
  },
});

const removeQuotes = (str: string) => {
  // there is a bug in jsonrepair that doesn't handle quotes correctly
  // so we remove them here
  // TODO: numbers still get returned as valid JSON

  const stripped = str.replace(/^\s+|\s+$/g, '');
  if (
    (stripped.startsWith('"') && stripped.endsWith('"')) ||
    (stripped.startsWith("'") && stripped.endsWith("'"))
  ) {
    return stripped.slice(1, -1);
  }
  return stripped;
};
export const jsonInputActions = jsonInputSlice.actions;
export default jsonInputSlice;
