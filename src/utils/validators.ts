import { z } from 'zod';

import { Stat, Type } from './constants/enums';

export const zStats = z.object({
  [Stat.HP]: z.number(),
  [Stat.ATTACK]: z.number(),
  [Stat.DEFENCE]: z.number(),
  [Stat.SPATK]: z.number(),
  [Stat.SPDEF]: z.number(),
  [Stat.SPEED]: z.number(),
});

export const zCharacter = z.object({
  id: z.string().optional(),
  name: z.string(),
  universe: z.string().optional(),
  type1: z.nativeEnum(Type).nullable(),
  type2: z.nativeEnum(Type).nullable(),
  ability1: z.string(),
  ability2: z.string().nullable(),
  abilityX: z.string().nullable(),
  stats: zStats,
  learnset: z.array(z.number()),
  createTime: z.number(),
});
