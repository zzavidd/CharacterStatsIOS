import { useQuery } from '@apollo/client';
import { capitalCase } from 'capital-case';
import { useMemo } from 'react';

import Color from '../constants/colors';
import type { Type } from '../constants/enums';
import { QUERY_TYPES } from '../queries';

export default function useTypes(): ApolloResult<PokeType[]> {
  const { data, error, loading } = useQuery<{ types: RawType[] }>(QUERY_TYPES);
  const types = useMemo(() => {
    return data?.types.map((rawtype) => {
      const typeName = capitalCase(rawtype.name) as Type;
      const marshaledType: PokeType = {
        id: rawtype.id,
        name: typeName,
        color: Color.TYPE[typeName],
      };
      return marshaledType;
    });
  }, [data]);

  return { data: types, error, loading };
}
