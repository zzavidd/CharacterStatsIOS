import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

import type { AppState } from '../types';

const initialState: AppState = {
  types: [],
  abilities: [],
  moves: []
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
    },
    setMoves: (state, action) => {
      state.moves = action.payload;
    }
  }
});

const store = configureStore({
  reducer: typeSlice.reducer
});

export default store;
export const { setTypes, setAbilities, setMoves } = typeSlice.actions;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
