import { ANIMALITOS_BET_UID } from '../constants';

export default {
  routes: [
    {
      method: 'POST',
      path: '/animalitos/place-bet',
      handler: 'api::animalitos-bet.animalitos-bet.placeBet',
      info: {
        contentType: ANIMALITOS_BET_UID,
      },
      config: {
        auth: false,
      },
    },
  ],
};
