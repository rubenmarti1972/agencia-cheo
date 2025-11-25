export default {
  routes: [
    {
      method: 'POST',
      path: '/loterias/place-bet',
      handler: 'lottery.placeBet',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
