import { configureStore, combineReducers } from '@reduxjs/toolkit';
import jsonInputSlice from './jsonInputSlice';
import jmesOutputSlice from './jmesOutputSlice';
import userPreferencesSlice from './userPreferencesSlice';

const rootReducer = combineReducers({
  jsonInput: jsonInputSlice.reducer,
  jmesOutput: jmesOutputSlice.reducer,
  userPreferences: userPreferencesSlice.reducer,
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;

export default store;
