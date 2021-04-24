import { GenericListItem, PokeAbility, PokeMove, PokeType } from '../types';

export function isType(item: GenericListItem): item is PokeType {
  return !isAbility(item) && !isMove(item);
}

export function isAbility(item: GenericListItem): item is PokeAbility {
  return 'generation' in item;
}

export function isMove(item: GenericListItem): item is PokeMove {
  return 'power' in item;
}