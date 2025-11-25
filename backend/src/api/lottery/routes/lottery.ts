// backend/src/api/lottery/routes/lottery.ts

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
