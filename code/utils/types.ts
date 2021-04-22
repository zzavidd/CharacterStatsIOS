export type AppInitialState = {
  types: PokeMeta[];
  abilities: PokeMeta[];
  moves: PokeMeta[]
};

export interface PokeMeta {
  name: string;
  url: string;
}
