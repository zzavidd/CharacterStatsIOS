import AsyncStorage from '@react-native-async-storage/async-storage';

import { Character } from '../types/classes';

export async function save(character: Character) {
  try {
    const { name, universe } = character;
    const key = `${universe}:${name}`;
    character.dateAdded = new Date();
    await AsyncStorage.setItem(key, JSON.stringify(character));
  } catch (err) {
    console.error(err);
  }
}

export async function get(key: string) {
  try {
    const character = await AsyncStorage.getItem(key);
    return JSON.parse(character!);
  } catch (err) {
    console.error(err);
  }
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

export async function clearAllData() {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    console.error(err);
  }
}
