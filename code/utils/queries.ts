import { gql } from '@apollo/client';

export default gql`
  {
    abilities: pokemon_v2_ability(
      distinct_on: name
      order_by: { name: asc }
      where: { is_main_series: { _eq: true } }
    ) {
      id
      name
      generation: generation_id
      effects: pokemon_v2_abilityeffecttexts(
        where: { language_id: { _eq: 9 } }
      ) {
        effect
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
      effect: pokemon_v2_moveeffect {
        texts: pokemon_v2_moveeffecteffecttexts {
          text: effect
        }
      }
    }
    types: pokemon_v2_type(
      order_by: { name: asc }
      where: { id: { _lt: 10000 } }
    ) {
      id
      name
    }
  }
`;
