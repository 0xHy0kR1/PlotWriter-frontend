import { configureStore } from '@reduxjs/toolkit';
import scriptReducer from './../scripts/features/scriptSlice';

// Configure the Redux store, combining all slices
export const store = configureStore({
  reducer: {
    scripts: scriptReducer,
  },
});

// Export types for the Redux state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
