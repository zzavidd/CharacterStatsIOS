import React from 'react';
import { Text, View } from 'react-native';

import { StatInput } from '../../components/input';
import styles from '../../styles/Form.styles';
import type { Character } from '../../types/classes';
import { Stat } from '../../types/enums';

export default function CharacterStatsForm({
  character,
  baseStatTotal,
  setCharacterStat
}: CharacterStatsFormProps) {
  const commonProps = {
    setCharacterStat,
    style: styles.formStatsField
  };
  return (
    <React.Fragment>
      <Text style={styles.label}>Stats:</Text>
      <View style={styles.formStats}>
        <StatInput
          name={Stat.HP}
          value={character.stats?.hp}
          placeholder={'HP'}
          {...commonProps}
        />
        <StatInput
          name={Stat.ATTACK}
          value={character.stats?.attack}
          placeholder={'Attack'}
          {...commonProps}
        />
        <StatInput
          name={Stat.DEFENCE}
          value={character.stats?.defence}
          placeholder={'Defence'}
          {...commonProps}
        />
      </View>
      <View style={styles.formStats}>
        <StatInput
          name={Stat.SPATK}
          value={character.stats?.spAtk}
          placeholder={'Sp. Atk'}
          {...commonProps}
        />
        <StatInput
          name={Stat.SPDEF}
          value={character.stats?.spDef}
          placeholder={'Sp. Def'}
          {...commonProps}
        />
        <StatInput
          name={Stat.SPEED}
          value={character.stats?.speed}
          placeholder={'Speed'}
          {...commonProps}
        />
      </View>
      <Text style={styles.label}>BST: {baseStatTotal}</Text>
    </React.Fragment>
  );
}

interface CharacterStatsFormProps {
  character: Character;
  baseStatTotal: number;
  setCharacterStat: (value: string, property: Stat) => void;
}
