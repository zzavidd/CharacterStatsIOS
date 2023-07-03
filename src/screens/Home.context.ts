import React from 'react';

export const InitialHomeState: HomeState = {
  selectedCharacter: null,
};

const HomeContext = React.createContext<ReactUseState<HomeState>>([
  InitialHomeState,
  () => {},
]);

export default HomeContext;

interface HomeState {
  selectedCharacter: Character | null;
}
