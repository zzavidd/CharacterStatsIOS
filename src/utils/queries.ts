import { gql } from '@apollo/client';

export const QUERY_ABILITIES = gql`
  {
    abilities: pokemon_v2_ability(
      distinct_on: name
      order_by: { name: asc }
      where: { is_main_series: { _eq: true } }
    ) {
      id
      name
      generation: generation_id
      description: pokemon_v2_abilityflavortexts(
        where: { language_id: { _eq: 9 } }
        order_by: { version_group_id: desc }
        limit: 1
      ) {
        text: flavor_text
      }
      candidates: pokemon_v2_pokemonabilities {
        pokemon: pokemon_v2_pokemon {
          types: pokemon_v2_pokemontypes {
            type: pokemon_v2_type {
              name
            }
          }
        }
      }
    }
  }
`;

export const QUERY_MOVES = gql`
  {
    moves: pokemon_v2_move(
      where: { pp: { _is_null: false, _gt: 1 } }
      order_by: { name: asc }
    ) {
      id
      name
      accuracy
      power
      pp
      type: pokemon_v2_type {
        name
      }
      damageClass: pokemon_v2_movedamageclass {
        name
      }
      description: pokemon_v2_moveflavortexts(
        where: { language_id: { _eq: 9 } }
        order_by: { version_group_id: desc }
        limit: 1
      ) {
        text: flavor_text
      }
    }
  }
`;

export const QUERY_TYPES = gql`
  {
    types: pokemon_v2_type(
      order_by: { name: asc }
      where: { id: { _lt: 10000 } }
    ) {
      id
      name
    }
  }
`;
