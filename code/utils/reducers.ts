import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

import type { AppInitialState } from './types';

const initialState: AppInitialState = {
  types: [],
  abilities: []
};

const typeSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTypes: (state, action) => {
      state.types = action.payload;
    },
    setAbilities: (state, action) => {
      state.abilities = action.payload;
    }
  }
});

const store = configureStore({
  reducer: typeSlice.reducer
});

export default store;
export const { setTypes, setAbilities } = typeSlice.actions;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
