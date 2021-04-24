/**
 * Makes a request to an external GraphQL endpoint.
 * @param query The GraphQL query to run.
 * @param callback The logic to handle the result.
 */
export default async function request(
  query: string,
  callback: (data: any) => void
) {
  fetch('https://beta.pokeapi.co/graphql/v1beta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  })
    .then((res) => res.json())
    .then((results) => {
      callback(results.data);
    });
}

export const Queries = {
  ABILITY: `
  {
    abilities: pokemon_v2_ability(distinct_on: name, order_by: {name: asc}, where: {is_main_series: {_eq: true}}) {
      id
      name
      generation: generation_id
      effects: pokemon_v2_abilityeffecttexts(where: {language_id: {_eq: 9}}) {
        effect
      }
    }
  }
  `,
  MOVE: `
  {
    moves: pokemon_v2_move(where: {pp: {_is_null: false, _gt: 1}, generation_id: {_lt: 7}}, order_by: {name: asc}) {
      id
      name
      accuracy
      power
      pp
      typeId: type_id
      damageClass: pokemon_v2_movedamageclass {
        name
      }
      effect: pokemon_v2_moveeffect {
        texts: pokemon_v2_moveeffecteffecttexts {
          text: effect
        }
      }
    }
  }    
  `,
  TYPE: `
  {
    types: pokemon_v2_type(order_by: {name: asc}, where: {id: {_lt: 10000}}) {
      id
      name
    }
  }     
  `
};
