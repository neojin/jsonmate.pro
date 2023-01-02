import { configureStore, combineReducers } from '@reduxjs/toolkit';
import jsonInputSlice from './jsonInputSlice';
import jmesOutputSlice from './jmesOutputSlice';

const rootReducer = combineReducers({
  jsonInput: jsonInputSlice.reducer,
  jmesOutput: jmesOutputSlice.reducer,
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;

export default store;
