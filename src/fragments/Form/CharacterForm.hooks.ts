/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Spec } from 'immutability-helper';
import immutate from 'immutability-helper';
import { useContext } from 'react';

import { CharacterFormContextDispatch } from './CharacterForm.context';

export function useAddMove() {
  const setContext = useContext(CharacterFormContextDispatch);
  return function addMove() {
    setContext((s) =>
      immutate(s, {
        character: {
          learnset: {
            '0': (levelMoveIds = []) => [1, ...levelMoveIds],
          },
        },
        selectedMove: {
          $set: {
            isMenuOpen: true,
            level: '0',
            selectedMoveIndex: 0,
            selectedValue: undefined,
          },
        },
      }),
    );
  };
}

export function useDeleteMove() {
  const setContext = useContext(CharacterFormContextDispatch);
  return function onDeleteMovePress(level: string, moveIndex: number) {
    setContext((s) => {
      let spec: Spec<Character['learnset']> = {};
      if (s.character.learnset[level].length > 1) {
        spec = {
          [level]: { $splice: [[moveIndex, 1]] },
        };
      } else {
        spec = { $unset: [level] };
      }

      return immutate(s, {
        character: {
          learnset: spec,
        },
      });
    });
  };
}

export function useSpreadMoves() {
  const setContext = useContext(CharacterFormContextDispatch);

  return function spreadMoves(maxLevel: number) {
    setContext((s) => {
      const min = 2;
      const max = Math.min(maxLevel, 100);

      const moveCount = Object.entries(s.character.learnset).reduce(
        (acc, [level, moveIds]) => {
          if (Number(level) === 0) {
            acc += moveIds.length;
          } else if (Number(level) >= 2) {
            acc += 1;
          }
          return acc;
        },
        0,
      );

      const deviation = (max - min) / moveCount;

      let currentLevel = 1;
      const newLearnset = Object.entries(s.character.learnset).reduce(
        (acc, [level, moveIds]) => {
          if (Number(level) === 0 || Number(level) === 100) {
            moveIds.forEach((moveId) => {
              const coefficient = deviation - Math.floor(deviation);
              const interval =
                Math.random() < coefficient
                  ? Math.floor(deviation)
                  : Math.ceil(deviation);
              currentLevel += interval;
              const newLevel = String(Math.min(currentLevel, max));
              acc[newLevel] = [moveId];
            });
          } else if (Number(level) >= 2) {
            const coefficient = deviation - Math.floor(deviation);
            const interval =
              Math.random() < coefficient
                ? Math.floor(deviation)
                : Math.ceil(deviation);
            currentLevel += interval;
            const newLevel = String(Math.min(currentLevel, max));
            acc[newLevel] = moveIds;
          } else {
            acc[level] = moveIds;
          }
          return acc;
        },
        {} as Record<string, number[]>,
      );
      return immutate(s, {
        character: {
          learnset: {
            $set: newLearnset,
          },
        },
      });
    });
  };
}
