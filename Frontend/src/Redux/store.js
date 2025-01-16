import { configureStore } from '@reduxjs/toolkit';
import rememberMeReducer from './RememberMeSlice'; // Uvezi reducer, ne akciju

export const store = configureStore({
  reducer: {
    rememberMe: rememberMeReducer,  // Dodeljuješ reducer sa imenom "rememberMe"
  },
});

export default store;
