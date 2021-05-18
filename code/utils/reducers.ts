import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

import type { AppState } from '../types';

const initialState: AppState = {
  isInitialised: false,
  characters: [],
  abilities: [],
  moves: [],
  types: [],
  sortValue: 1,
  groupValue: 1
};

const appSlice = createSlice({
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
    },
    setCharacters: (state, action) => {
      state.characters = action.payload;
    },
    setSortValue: (state, action) => {
      state.sortValue = action.payload;
    },
    setGroupValue: (state, action) => {
      state.groupValue = action.payload;
    }
  }
});

const store = configureStore({
  reducer: appSlice.reducer
});

export default store;
export const {
  setTypes,
  setAbilities,
  setMoves,
  setCharacters,
  setSortValue,
  setGroupValue
} = appSlice.actions;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
