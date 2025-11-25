export default {
  routes: [
    {
      method: 'POST',
      path: '/animalitos/place-bet',
      handler: 'animalitos-bet.placeBet',
      config: {
        auth: false,
      },
    },
  ],
};
