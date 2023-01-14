import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppState } from '../types';
import { Character } from '../types/classes';

/**
 * Retrieve character from storage using specified ID.
 * @param id The ID of the character to retrieve.
 * @returns The character.
 */
export async function get(id: string): Promise<Character> {
  const character = await AsyncStorage.getItem(id);
  return JSON.parse(character!);
}

/**
 * Retrieve all character from storage.
 * @returns The list of characters.
 */
export async function getAll(): Promise<Character[] | void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(keys);
    const characters = stores.map(([, value]) => {
      const character = JSON.parse(value!) as Character;
      return character;
    });
    return characters;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Insert a character into storage.
 * @param character The character details.
 */
export async function insert(character: Character): Promise<void> {
  const { name, universe } = character;
  character.id = `${universe}:${name}`;
  character.dateAdded = new Date();
  await AsyncStorage.setItem(character.id, JSON.stringify(character));
}

/**
 * Update a character in storage.
 * @param character The character details.
 */
export async function update(character: Character): Promise<void> {
  await AsyncStorage.mergeItem(character.id, JSON.stringify(character));
}

/**
 * Remove a character from storage.
 * @param id The ID of the character to remove.
 */
export async function remove(id: string): Promise<void> {
  await AsyncStorage.removeItem(id);
}

/**
 * Ingests example characters into storage.
 * @param appState The current app state.
 */
export async function ingestExampleData(appState: AppState): Promise<void> {
  const characters: [string, string][] = [];
  for (let i = 0; i < 30; i++) {
    const character = Character.buildRandomCharacter(appState);
    const pair: [string, string] = [character.id, JSON.stringify(character)];
    characters.push(pair);
  }
  await AsyncStorage.multiSet(characters);
}

/**
 * Clears all data from storage.
 */
export async function clearAllData(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  } catch (err) {
    console.error(err);
  }
}
