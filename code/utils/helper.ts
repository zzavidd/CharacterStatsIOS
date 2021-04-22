import { capitalCase } from 'capital-case';

import { PokeMeta } from './types';

/**
 * Transforms a type or ability into capital case.
 * @param meta The type or ability to transform.
 * @returns The capital-cased meta.
 */
export function formatMetaName(meta: PokeMeta) {
  meta.name = capitalCase(meta.name);
  return meta;
}

/**
 * The sort function for the list of types or abilities.
 * @param a The first operand.
 * @param b The second operand.
 * @returns True if alphabetical.
 */
export function sortMetaByName(a: PokeMeta, b: PokeMeta) {
  return a.name > b.name;
}
