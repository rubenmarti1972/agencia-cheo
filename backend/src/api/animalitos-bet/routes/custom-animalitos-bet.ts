import { ANIMALITOS_BET_UID } from '../constants';

export default {
  routes: [
    {
      method: 'POST',
      path: '/animalitos/place-bet',
      handler: 'api::animalitos-bet.animalitos-bet.placeBet',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
