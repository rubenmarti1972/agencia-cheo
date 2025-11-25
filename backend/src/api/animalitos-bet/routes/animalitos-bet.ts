export default {
  routes: [
    {
      method: 'POST',
      path: '/animalitos/place-bet',
      handler: 'api::animalitos-bet.animalitos-bet.placeBet',
      config: {
        auth: false,
      },
    },
  ],
};
