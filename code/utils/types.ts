export type AppInitialState = {
  types: PokeType[];
  abilities: PokeAbility[];
  moves: PokeMove[];
};

export type PokeType = {
  id: number;
  name: string;
};

export type PokeAbility = {
  id: number;
  name: string;
  effects: {
    effect: string;
  };
};

export type PokeMove = {
  id: number;
  name: string;
  accuracy: number;
  power: number;
  pp: number;
  typeId: number;
  damageClass: {
    name: string;
  };
  effect: {
    texts: [
      {
        text: string;
      }
    ];
  };
};
