import { useQuery } from '@apollo/client';
import { capitalCase } from 'capital-case';
import { useMemo } from 'react';

import Color from '../constants/colors';
import type { Type } from '../constants/enums';
import { QUERY_MOVES } from '../queries';

export default function useMoves(): ApolloResult<PokeMoveMap> {
  const { data, error, loading } = useQuery<{ moves: RawMove[] }>(QUERY_MOVES);

  const moves = useMemo(() => {
    return data?.moves.reduce<PokeMoveMap>((acc, rawMove) => {
      const { id, accuracy, power, pp } = rawMove;
      const type = capitalCase(rawMove.type.name) as Type;
      const marshaledMove: PokeMove = {
        id,
        accuracy,
        power,
        pp,
        type,
        name: capitalCase(rawMove.name),
        color: Color.TYPE[type],
        damageClass: rawMove.damageClass.name,
        description: rawMove.description[0]?.text,
      };
      acc[id] = marshaledMove;
      return acc;
    }, {});
  }, [data]);

  return { data: moves, error, loading };
}
