import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

import config from 'config.json';

const app = initializeApp(config);
export const firestore = getFirestore(app);
