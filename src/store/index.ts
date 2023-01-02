import { configureStore, combineReducers } from '@reduxjs/toolkit';
import jsonInputSlice from './jsonInputSlice';

const rootReducer = combineReducers({
  jsonInput: jsonInputSlice.reducer,
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;

export default store;
