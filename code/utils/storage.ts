import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppState } from '../types';
import { Character } from '../types/classes';

export async function save(character: Character) {
  const { name, universe } = character;
  const key = `${universe}:${name}`;
  character.dateAdded = new Date();
  await AsyncStorage.setItem(key, JSON.stringify(character));
}

export async function get(key: string) {
  const character = await AsyncStorage.getItem(key);
  return JSON.parse(character!);
}

export async function getAll(): Promise<Array<Character>> {
  const keys = await AsyncStorage.getAllKeys();
  const stores = await AsyncStorage.multiGet(keys);
  const characters = stores.map(([key, value]) => {
    const character = JSON.parse(value!) as Character;
    character.id = key;
    return character;
  });
  return characters;
}

export async function ingestExampleData(appState: AppState) {
  const characters = [];
  for (let i = 0; i < 30; i++) {
    const character = Character.buildRandomCharacter(appState);
    const { name, universe } = character;
    const key = `${universe}:${name}`;
    const pair = [key, JSON.stringify(character)];
    characters.push(pair);
  }
  await AsyncStorage.multiSet(characters);
}

export async function clearAllData() {
  await AsyncStorage.clear();
}
