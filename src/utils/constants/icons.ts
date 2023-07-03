import { DamageClass, Type } from './enums';

const PokeIcon = <const>{
  Classes: {
    [DamageClass.PHYSICAL]: require('assets/icons/classes/Physical.png'),
    [DamageClass.SPECIAL]: require('assets/icons/classes/Special.png'),
    [DamageClass.STATUS]: require('assets/icons/classes/Status.png'),
  },
  Types: {
    [Type.BUG]: require('assets/icons/types/Bug.png'),
    [Type.DARK]: require('assets/icons/types/Dark.png'),
    [Type.DRAGON]: require('assets/icons/types/Dragon.png'),
    [Type.ELECTRIC]: require('assets/icons/types/Electric.png'),
    [Type.FAIRY]: require('assets/icons/types/Fairy.png'),
    [Type.FIGHTING]: require('assets/icons/types/Fighting.png'),
    [Type.FIRE]: require('assets/icons/types/Fire.png'),
    [Type.FLYING]: require('assets/icons/types/Flying.png'),
    [Type.GHOST]: require('assets/icons/types/Ghost.png'),
    [Type.GRASS]: require('assets/icons/types/Grass.png'),
    [Type.GROUND]: require('assets/icons/types/Ground.png'),
    [Type.ICE]: require('assets/icons/types/Ice.png'),
    [Type.NORMAL]: require('assets/icons/types/Normal.png'),
    [Type.POISON]: require('assets/icons/types/Poison.png'),
    [Type.PSYCHIC]: require('assets/icons/types/Psychic.png'),
    [Type.ROCK]: require('assets/icons/types/Rock.png'),
    [Type.STEEL]: require('assets/icons/types/Steel.png'),
    [Type.WATER]: require('assets/icons/types/Water.png'),
  },
};

export default PokeIcon;
