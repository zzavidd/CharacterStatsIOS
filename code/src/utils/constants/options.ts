import type { Character } from '../../models/Character';

export const Universes = [
  { id: 1, name: 'DC' },
  { id: 2, name: 'Marvel' },
  { id: 3, name: 'Smash' },
  { id: 4, name: 'Sonic' },
  { id: 5, name: 'Ben 10' },
  { id: 6, name: 'Gyvenimas' },
];

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
