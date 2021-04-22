export type AppInitialState = {
  types: PokeMeta[];
  abilities: PokeMeta[];
};

export interface PokeMeta {
  name: string;
  url: string;
}
