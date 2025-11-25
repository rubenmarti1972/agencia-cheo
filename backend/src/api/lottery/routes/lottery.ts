export default {
  contentType: 'api::lottery.lottery',
  routes: [
    {
      method: 'POST',
      path: '/loterias/place-bet',
      handler: 'api::lottery.lottery.placeBet',
      info: {
        contentType: 'api::lottery.lottery',
      },
      config: {
        auth: false,
      },
    },
  ],
};
