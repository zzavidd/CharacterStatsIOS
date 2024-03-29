import { useQuery } from '@apollo/client';
import { capitalCase } from 'capital-case';
import { useMemo } from 'react';
import invariant from 'tiny-invariant';

import CSColor from '../constants/colors';
import type { Type } from '../constants/enums';
import { QUERY_ABILITIES } from '../queries';

export default function useAbilities(): ApolloResult<PokeAbilityMap> {
  const { data, error, loading } = useQuery<{ abilities: RawAbility[] }>(
    QUERY_ABILITIES,
  );

  const abilityMap = useMemo(() => {
    return data?.abilities.reduce((acc, rawAbility) => {
      const { id, generation } = rawAbility;
      const commonType = determineAbilityType(rawAbility);
      const ability: PokeAbility = {
        id,
        name: capitalCase(rawAbility.name),
        generation,
        commonType,
        color: CSColor.TYPE[commonType],
        description: rawAbility.description[0]?.text,
      };
      acc[id] = ability;
      return acc;
    }, {} as Record<number, PokeAbility>);
  }, [data]);

  return { data: abilityMap, error, loading };
}

/**
 * Finds the most common type held by a specified ability's candidates.
 * @param ability The specified ability.
 * @returns The most common type.
 */
function determineAbilityType(ability: RawAbility): Type {
  const { candidates } = ability;
  const types: Type[] = [];

  candidates.forEach((candidate) => {
    candidate.pokemon.types.forEach(({ type }) => {
      types.push(capitalCase(type.name) as Type);
    });
  });

  const sortedTypes = types.sort((a, b) => {
    const first = types.filter((type) => type === a).length;
    const second = types.filter((type) => type === b).length;
    return first - second;
  });
  const mostCommonType = sortedTypes.pop();
  invariant(mostCommonType, 'No type fits this ability.');
  return mostCommonType;
}
