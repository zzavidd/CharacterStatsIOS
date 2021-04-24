import AsyncStorage from '@react-native-async-storage/async-storage';

import { Character } from '../types/classes';

export async function save(character: Character) {
  try {
    const { name, universe } = character;
    const key = `${universe}-${name}`;
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
