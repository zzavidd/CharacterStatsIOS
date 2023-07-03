export const Universes: Record<number, string> = {
  1: 'DC',
  2: 'Marvel',
  3: 'Smash',
  4: 'Sonic',
  5: 'Ben 10',
  6: 'Gyvenimas',
};

export const SortOptions: SortOptions = {
  1: 'name',
  2: 'type1',
  3: 'bst',
};

export const GroupOptions: GroupOptions = {
  2: ['type1', 'Type'],
  3: ['universe', 'Universe'],
};

interface SortOptions {
  [key: number]: keyof Character | 'bst';
}

interface GroupOptions {
  [key: number]: [keyof Character, string];
}
